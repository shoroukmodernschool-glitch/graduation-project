import cv2
import json
import os
from typing import Dict, List, Tuple, Optional

import numpy as np
from insightface.app import FaceAnalysis


DB_PATH = "face_db.json"
SIMILARITY_THRESHOLD = 0.5


def load_face_analyzer(det_size: Tuple[int, int] = (640, 640)) -> FaceAnalysis:
    app = FaceAnalysis(name="buffalo_l")
    app.prepare(ctx_id=0, det_size=det_size)
    return app


def load_faces_from_folder(folder, face_analyzer):
    db = {}

    if not os.path.exists(folder):
        print("Faces folder not found.")
        return db

    for file in os.listdir(folder):
        path = os.path.join(folder, file)

        img = cv2.imread(path)
        if img is None:
            continue

        faces = face_analyzer.get(img)

        if len(faces) > 0:
            name = os.path.splitext(file)[0]
            embedding = faces[0].embedding
            db[name] = embedding.tolist()
            print(f"Loaded face for {name}")

    return db


def detect_faces(frame: np.ndarray, face_analyzer: FaceAnalysis):
    faces = face_analyzer.get(frame)
    return faces


def extract_embeddings(faces) -> Tuple[List[np.ndarray], List[np.ndarray]]:
    embeddings = []
    bboxes = []

    for face in faces:
        if getattr(face, "embedding", None) is None:
            continue

        embeddings.append(np.asarray(face.embedding, dtype=np.float32))
        bboxes.append(np.asarray(face.bbox, dtype=np.int32))

    return embeddings, bboxes


def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    v1 = vec1 / (np.linalg.norm(vec1) + 1e-10)
    v2 = vec2 / (np.linalg.norm(vec2) + 1e-10)
    return float(np.dot(v1, v2))


def compare_embedding(
    embedding: np.ndarray,
    db: Dict[str, List[float]],
    threshold: float = SIMILARITY_THRESHOLD,
) -> Tuple[Optional[str], float]:

    if not db:
        return None, 0.0

    best_name = None
    best_sim = -1.0

    for name, stored_vec in db.items():
        stored_vec_np = np.asarray(stored_vec, dtype=np.float32)
        sim = cosine_similarity(embedding, stored_vec_np)

        if sim > best_sim:
            best_sim = sim
            best_name = name

    if best_sim < threshold:
        return None, best_sim

    return best_name, best_sim


def recognize_faces_in_frame(frame, face_analyzer, db):

    faces = detect_faces(frame, face_analyzer)
    embeddings, bboxes = extract_embeddings(faces)

    for emb, bbox in zip(embeddings, bboxes):

        name, sim = compare_embedding(emb, db)

        if name is None:
            display_name = "Unknown"
            color = (0, 0, 255)
        else:
            display_name = name
            color = (0, 255, 0)

        x1, y1, x2, y2 = bbox

        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

        label = f"{display_name} {sim*100:.1f}%"

        cv2.putText(
            frame,
            label,
            (x1, max(y1 - 10, 0)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            color,
            2,
            cv2.LINE_AA,
        )

    return frame


def main():

    print("Loading face analyzer (ArcFace model)...")

    face_analyzer = load_face_analyzer(det_size=(320, 320))

    db = load_faces_from_folder("faces", face_analyzer)

    print(f"Loaded database with {len(db)} person(s).")

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    print("Press 'q' to quit.")

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        annotated_frame = recognize_faces_in_frame(
            frame, face_analyzer, db
        )

        cv2.imshow("Real-time Face Recognition", annotated_frame)

        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()