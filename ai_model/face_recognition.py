import cv2
import time
import threading
from typing import Optional
import numpy as np
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from insightface.app import FaceAnalysis
from datetime import datetime

SIMILARITY_THRESHOLD = 0.7

# Performance
DETECTION_FRAME_SKIP = 4
DETECTION_INTERVAL_SEC = 0.25
DETECTION_WIDTH = 240
MAX_FACES = 3


class VideoStream:
    def __init__(self, src=0):
        self.src = src
        self.stream = cv2.VideoCapture(src, cv2.CAP_DSHOW)

        if self.stream.isOpened():
            self.grabbed, self.frame = self.stream.read()
            if not self.grabbed:
                self.frame = None
        else:
            self.grabbed = False
            self.frame = None

        self.stopped = False
        self.lock = threading.Lock()

    def start(self):
        if not self.stream.isOpened():
            return self
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
                    break

    def read(self):
        with self.lock:
            if self.frame is None:
                return None
            return self.frame.copy()

    def stop(self):
        self.stopped = True
        if self.stream.isOpened():
            self.stream.release()


def open_available_camera(preferred_indexes=None) -> Optional[VideoStream]:
    if preferred_indexes is None:
        preferred_indexes = [0, 1, 2]

    for cam_id in preferred_indexes:
        print(f"[INFO] Trying camera index {cam_id} ...")
        vs = VideoStream(cam_id)

        if vs.stream.isOpened() and vs.frame is not None:
            print(f"[INFO] Camera opened successfully on index {cam_id}")
            return vs.start()

        vs.stop()

    return None


def init_firestore():
    if not firebase_admin._apps:
        cred = credentials.Certificate("firebase_key.json")
        firebase_admin.initialize_app(cred)
    return firestore.client()


def load_face_analyzer():
    app = FaceAnalysis(name="buffalo_l")
    try:
        app.prepare(ctx_id=0, det_size=(320, 320))
    except Exception:
        app.prepare(ctx_id=-1, det_size=(320, 320))
    return app


def load_image_from_url(url):
    try:
        response = requests.get(url, timeout=20)
        response.raise_for_status()
        image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"[ERROR] Failed to load image from URL: {url} -> {e}")
        return None


def load_faces_from_firestore(firestore_db, face_analyzer):
    db = {}

    docs = firestore_db.collection("student").stream()

    for doc in docs:
        data = doc.to_dict()

        student_id = data.get("id")
        first_name = data.get("firstName", "").strip()
        last_name = data.get("lastName", "").strip()
        face_images = data.get("faceImages")

        if not student_id or not first_name or not face_images:
            print(f"[SKIP] Invalid student document: {doc.id}")
            continue

        person_name = f"{first_name} {last_name}".strip()
        embeddings = []

        for url in face_images:
            img = load_image_from_url(url)

            if img is None:
                continue

            faces = face_analyzer.get(img)

            if len(faces) > 0:
                embeddings.append(faces[0].embedding)

        if embeddings:
            avg_embedding = np.mean(embeddings, axis=0)
            db[person_name] = {
                "student_id": student_id,
                "embedding": avg_embedding
            }
            print(f"Loaded {len(embeddings)} images for {person_name}")

    return db


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
        best_student_id = None

        for name, student_data in db.items():
            sim = cosine_similarity(emb, student_data["embedding"])
            if sim > best_sim:
                best_sim = sim
                best_name = name
                best_student_id = student_data["student_id"]

        if best_sim < SIMILARITY_THRESHOLD:
            best_name = "Unknown"
            best_student_id = None
            color = (0, 0, 255)
        else:
            color = (0, 255, 0)

        results.append((bbox, best_name, best_student_id, best_sim, color))

    return results


def mark_attendance(firestore_db, student_id, student_name):
    today = datetime.now().strftime("%Y-%m-%d")
    current_time = datetime.now().strftime("%H:%M:%S")

    doc_id = f"{student_id}_{today}"
    doc_ref = firestore_db.collection("attendance").document(doc_id)
    doc = doc_ref.get()

    if not doc.exists:
        doc_ref.set({
            "studentId": student_id,
            "name": student_name,
            "date": today,
            "time": current_time,
            "status": "present",
            "method": "face_recognition"
        })
        print(f"[ATTENDANCE] Marked present: {student_name}")
    else:
        print(f"[ATTENDANCE] Already marked today: {student_name}")


def generate_frames():
    print("Loading model...")
    analyzer = load_face_analyzer()

    print("Connecting to Firestore...")
    firestore_db = init_firestore()

    face_db = load_faces_from_firestore(firestore_db, analyzer)
    print(f"Loaded database with {len(face_db)} person(s).")

    print("Starting camera...")
    vs = open_available_camera([0, 1, 2])

    if vs is None:
        return

    time.sleep(2)

    frame_count = 0
    last_time = 0
    cached_results = []
    prev_gray = None
    already_seen = set()

    try:
        while True:
            frame = vs.read()

            if frame is None:
                time.sleep(0.1)
                continue

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            do_detection = True

            if prev_gray is not None:
                diff = cv2.absdiff(prev_gray, gray)
                change = np.mean(diff)

                if change < 6:
                    do_detection = False

            prev_gray = gray
            frame_count += 1

            if do_detection and frame_count % DETECTION_FRAME_SKIP == 0:
                now = time.time()

                if now - last_time > DETECTION_INTERVAL_SEC:
                    small = cv2.resize(
                        frame,
                        (DETECTION_WIDTH, int(frame.shape[0] * DETECTION_WIDTH / frame.shape[1]))
                    )

                    results = recognize(small, analyzer, face_db)

                    cached_results = []
                    for bbox, name, student_id, sim, color in results:
                        x1, y1, x2, y2 = bbox

                        scale_x = frame.shape[1] / small.shape[1]
                        scale_y = frame.shape[0] / small.shape[0]

                        x1 = int(x1 * scale_x)
                        x2 = int(x2 * scale_x)
                        y1 = int(y1 * scale_y)
                        y2 = int(y2 * scale_y)

                        cached_results.append(((x1, y1, x2, y2), name, student_id, sim, color))

                        if name != "Unknown" and student_id is not None and student_id not in already_seen:
                            mark_attendance(firestore_db, student_id, name)
                            already_seen.add(student_id)

                    last_time = now

            for bbox, name, student_id, sim, color in cached_results:
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

            ret, buffer = cv2.imencode(".jpg", frame)
            if not ret:
                continue

            frame_bytes = buffer.tobytes()

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
            )
    finally:
        vs.stop()


def main():
    for _ in generate_frames():
        pass


if __name__ == "__main__":
    main()