import cv2
import os
import time
import threading
from typing import Dict, List, Tuple, Optional
import numpy as np
from insightface.app import FaceAnalysis

SIMILARITY_THRESHOLD = 0.7

# Performance
DETECTION_FRAME_SKIP = 4
DETECTION_INTERVAL_SEC = 0.25
DETECTION_WIDTH = 240
MAX_FACES = 3


# ==============================
# Video Stream Thread
# ==============================
class VideoStream:
    def __init__(self, src=0):
        self.stream = cv2.VideoCapture(src, cv2.CAP_DSHOW)
        self.grabbed, self.frame = self.stream.read()
        self.stopped = False
        self.lock = threading.Lock()

    def start(self):
        threading.Thread(target=self.update, daemon=True).start()
        return self

    def update(self):
        while not self.stopped:
            if not self.stream.isOpened():
                self.stopped = True
                break

            grabbed, frame = self.stream.read()
            with self.lock:
                if grabbed:
                    self.frame = frame
                else:
                    self.stopped = True

    def read(self):
        with self.lock:
            if self.frame is None:
                return None
            return self.frame.copy()

    def stop(self):
        self.stopped = True
        if self.stream.isOpened():
            self.stream.release()


# ==============================
# Face Analyzer
# ==============================
def load_face_analyzer():
    app = FaceAnalysis(name="buffalo_l")
    app.prepare(ctx_id=0, det_size=(320, 320))
    return app


# ==============================
# Load Faces
# ==============================
def load_faces_from_folder(folder, face_analyzer):
    db = {}

    if not os.path.exists(folder):
        print("Faces folder not found.")
        return db

    for person_name in os.listdir(folder):
        person_path = os.path.join(folder, person_name)

        if not os.path.isdir(person_path):
            continue

        embeddings = []

        for file in os.listdir(person_path):
            img_path = os.path.join(person_path, file)
            img = cv2.imread(img_path)

            if img is None:
                continue

            faces = face_analyzer.get(img)

            if len(faces) > 0:
                embeddings.append(faces[0].embedding)

        if embeddings:
            avg_embedding = np.mean(embeddings, axis=0)
            db[person_name] = avg_embedding
            print(f"Loaded {len(embeddings)} images for {person_name}")

    return db


# ==============================
# Utils
# ==============================
def cosine_similarity(a, b):
    a = a / (np.linalg.norm(a) + 1e-10)
    b = b / (np.linalg.norm(b) + 1e-10)
    return float(np.dot(a, b))


def recognize(frame, analyzer, db):
    faces = analyzer.get(frame)
    results = []

    for face in faces[:MAX_FACES]:
        emb = face.embedding
        bbox = face.bbox.astype(int)

        best_name = "Unknown"
        best_sim = 0

        for name, db_emb in db.items():
            sim = cosine_similarity(emb, db_emb)
            if sim > best_sim:
                best_sim = sim
                best_name = name

        if best_sim < SIMILARITY_THRESHOLD:
            best_name = "Unknown"
            color = (0, 0, 255)
        else:
            color = (0, 255, 0)

        results.append((bbox, best_name, best_sim, color))

    return results


# ==============================
# MAIN
# ==============================
def main():
    print("Loading model...")
    analyzer = load_face_analyzer()

    db = load_faces_from_folder("faces", analyzer)
    print(f"Loaded database with {len(db)} person(s).")

    cam_id = 1
    print("[INFO] Using external camera (USB)")

    print("Starting camera...")
    vs = VideoStream(cam_id).start()
    time.sleep(2)

    frame_count = 0
    last_time = 0
    cached_results = []

    prev_gray = None

    while True:
        frame = vs.read()

        if frame is None:
            time.sleep(0.1)
            continue

        # ✅ مقارنة الفريمات بدون ما نوقف الرسم
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        do_detection = True

        if prev_gray is not None:
            diff = cv2.absdiff(prev_gray, gray)
            change = np.mean(diff)

            if change < 6:
                do_detection = False

        prev_gray = gray

        frame_count += 1

        # ✅ detect بس لما في حركة
        if do_detection and frame_count % DETECTION_FRAME_SKIP == 0:
            now = time.time()

            if now - last_time > DETECTION_INTERVAL_SEC:
                small = cv2.resize(
                    frame,
                    (DETECTION_WIDTH, int(frame.shape[0] * DETECTION_WIDTH / frame.shape[1]))
                )

                results = recognize(small, analyzer, db)

                cached_results = []
                for bbox, name, sim, color in results:
                    x1, y1, x2, y2 = bbox

                    scale_x = frame.shape[1] / small.shape[1]
                    scale_y = frame.shape[0] / small.shape[0]

                    x1 = int(x1 * scale_x)
                    x2 = int(x2 * scale_x)
                    y1 = int(y1 * scale_y)
                    y2 = int(y2 * scale_y)

                    cached_results.append(((x1, y1, x2, y2), name, sim, color))

                last_time = now

        # ✅ الرسم دايمًا شغال حتى لو مفيش detect
        for bbox, name, sim, color in cached_results:
            x1, y1, x2, y2 = bbox

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(
                frame,
                f"{name} {sim*100:.1f}%",
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                color,
                2
            )

        cv2.imshow("Face Recognition", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    vs.stop()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()