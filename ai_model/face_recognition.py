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

SIMILARITY_THRESHOLD = 0.66

# Performance
DETECTION_FRAME_SKIP = 4
DETECTION_INTERVAL_SEC = 0.18
DETECTION_WIDTH = 256
MAX_FACES = 2

# Attendance cooldown
ATTENDANCE_COOLDOWN_SEC = 0

# Ignore very small faces to reduce false matches
MIN_FACE_SIZE = 45

# Smooth box movement
BOX_SMOOTHING_ALPHA = 0.55

# Stable identity / tracking
REQUIRED_MATCH_FRAMES = 1
TRACK_TTL_SEC = 0.9
TRACK_MATCH_DISTANCE = 170


class VideoStream:
    def __init__(self, src=0):
        self.src = src
        self.stream = cv2.VideoCapture(src, cv2.CAP_DSHOW)
        self.stream.set(cv2.CAP_PROP_FRAME_WIDTH, 800)
        self.stream.set(cv2.CAP_PROP_FRAME_HEIGHT, 600)
        self.stream.set(cv2.CAP_PROP_FPS, 30)
        self.stream.set(cv2.CAP_PROP_BUFFERSIZE, 1)

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
        preferred_indexes = [1, 0, 2]

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

        student_id = data.get("student_id")
        first_name = data.get("firstName", "").strip()
        last_name = data.get("lastName", "").strip()
        face_images = data.get("faceImages")

        if not student_id:
            print(f"[SKIP] Missing student_id for: {doc.id}")
            continue

        if not first_name or not face_images:
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
                best_face = max(
                    faces,
                    key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1])
                )
                embeddings.append(best_face.embedding)

        if embeddings:
            db[person_name] = {
                "student_id": student_id,
                "embeddings": embeddings
            }
            print(f"Loaded {len(embeddings)} images for {person_name}")

    return db


def cosine_similarity(a, b):
    a = a / (np.linalg.norm(a) + 1e-10)
    b = b / (np.linalg.norm(b) + 1e-10)
    return float(np.dot(a, b))


def bbox_center(bbox):
    x1, y1, x2, y2 = bbox
    return ((x1 + x2) / 2, (y1 + y2) / 2)


def smooth_bbox(old_bbox, new_bbox, alpha=BOX_SMOOTHING_ALPHA):
    ox1, oy1, ox2, oy2 = old_bbox
    nx1, ny1, nx2, ny2 = new_bbox

    x1 = int(alpha * nx1 + (1 - alpha) * ox1)
    y1 = int(alpha * ny1 + (1 - alpha) * oy1)
    x2 = int(alpha * nx2 + (1 - alpha) * ox2)
    y2 = int(alpha * ny2 + (1 - alpha) * oy2)

    return (x1, y1, x2, y2)


def distance_between_bboxes(b1, b2):
    c1x, c1y = bbox_center(b1)
    c2x, c2y = bbox_center(b2)
    return ((c1x - c2x) ** 2 + (c1y - c2y) ** 2) ** 0.5


def recognize(frame, analyzer, db):
    faces = analyzer.get(frame)
    results = []

    for face in faces[:MAX_FACES]:
        emb = face.embedding
        bbox = face.bbox.astype(int)
        x1, y1, x2, y2 = bbox

        face_w = x2 - x1
        face_h = y2 - y1

        if face_w < MIN_FACE_SIZE or face_h < MIN_FACE_SIZE:
            continue

        best_name = "Unknown"
        best_sim = 0
        best_student_id = None

        for name, student_data in db.items():
            person_best_sim = 0

            for stored_emb in student_data["embeddings"]:
                sim = cosine_similarity(emb, stored_emb)
                if sim > person_best_sim:
                    person_best_sim = sim

            if person_best_sim > best_sim:
                best_sim = person_best_sim
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


def update_tracks(tracks, detections, now):
    updated_tracks = []
    used_detection_indexes = set()

    for track in tracks:
        best_idx = None
        best_distance = float("inf")

        for i, det in enumerate(detections):
            if i in used_detection_indexes:
                continue

            det_bbox, det_name, det_student_id, det_sim, det_color = det
            distance = distance_between_bboxes(track["bbox"], det_bbox)

            if distance < TRACK_MATCH_DISTANCE and distance < best_distance:
                best_distance = distance
                best_idx = i

        if best_idx is not None:
            used_detection_indexes.add(best_idx)
            det_bbox, det_name, det_student_id, det_sim, det_color = detections[best_idx]

            stable_name = track["stable_name"]
            stable_student_id = track["stable_student_id"]
            stable_color = track["stable_color"]
            stable_sim = track["stable_sim"]

            candidate_name = track["candidate_name"]
            candidate_student_id = track["candidate_student_id"]
            candidate_count = track["candidate_count"]

            if det_name != "Unknown" and det_student_id is not None:
                if det_student_id == candidate_student_id:
                    candidate_count += 1
                else:
                    candidate_name = det_name
                    candidate_student_id = det_student_id
                    candidate_count = 1

                if candidate_count >= REQUIRED_MATCH_FRAMES:
                    stable_name = det_name
                    stable_student_id = det_student_id
                    stable_color = det_color
                    stable_sim = det_sim
            else:
                candidate_name = None
                candidate_student_id = None
                candidate_count = 0

            if stable_student_id is not None and det_student_id == stable_student_id:
                stable_sim = max(stable_sim, det_sim)
                stable_color = det_color
            elif stable_student_id is None:
                stable_color = det_color
                stable_sim = det_sim

            updated_tracks.append({
                "bbox": smooth_bbox(track["bbox"], det_bbox),
                "stable_name": stable_name,
                "stable_student_id": stable_student_id,
                "stable_color": stable_color,
                "stable_sim": stable_sim,
                "candidate_name": candidate_name,
                "candidate_student_id": candidate_student_id,
                "candidate_count": candidate_count,
                "last_seen": now
            })
        else:
            if now - track["last_seen"] <= TRACK_TTL_SEC:
                updated_tracks.append(track)

    for i, det in enumerate(detections):
        if i in used_detection_indexes:
            continue

        det_bbox, det_name, det_student_id, det_sim, det_color = det

        candidate_name = det_name if det_name != "Unknown" and det_student_id is not None else None
        candidate_student_id = det_student_id if det_name != "Unknown" and det_student_id is not None else None
        candidate_count = 1 if candidate_student_id is not None else 0

        stable_name = "Unknown"
        stable_student_id = None
        stable_color = det_color
        stable_sim = det_sim

        if candidate_count >= REQUIRED_MATCH_FRAMES:
            stable_name = det_name
            stable_student_id = det_student_id

        updated_tracks.append({
            "bbox": det_bbox,
            "stable_name": stable_name,
            "stable_student_id": stable_student_id,
            "stable_color": stable_color,
            "stable_sim": stable_sim,
            "candidate_name": candidate_name,
            "candidate_student_id": candidate_student_id,
            "candidate_count": candidate_count,
            "last_seen": now
        })

    return updated_tracks


def mark_attendance(firestore_db, student_id, student_name):
    today = datetime.now().strftime("%Y-%m-%d")
    current_time = datetime.now().strftime("%H:%M:%S")

    doc_id = f"{student_id}_{today}"
    doc_ref = firestore_db.collection("attendance").document(doc_id)
    doc = doc_ref.get()

    if doc.exists:
        return "already_marked"

    doc_ref.set({
        "studentId": student_id,
        "name": student_name,
        "date": today,
        "time": current_time,
        "status": "present",
        "method": "face_recognition"
    })
    print(f"[ATTENDANCE] Marked present: {student_name}")
    return "inserted"


class RecognitionWorker:
    def __init__(self, analyzer, face_db):
        self.analyzer = analyzer
        self.face_db = face_db
        self.lock = threading.Lock()
        self.stop_event = threading.Event()

        self.pending_frame = None
        self.latest_tracks = []
        self.last_processed_time = 0

        self.thread = threading.Thread(target=self.run, daemon=True)

    def start(self):
        self.thread.start()
        return self

    def submit_frame(self, frame):
        with self.lock:
            self.pending_frame = frame.copy()

    def get_tracks(self):
        with self.lock:
            return [track.copy() for track in self.latest_tracks]

    def set_tracks(self, tracks):
        with self.lock:
            self.latest_tracks = [track.copy() for track in tracks]

    def run(self):
        tracks = []
        frame_count = 0

        while not self.stop_event.is_set():
            with self.lock:
                frame = None if self.pending_frame is None else self.pending_frame.copy()
                self.pending_frame = None

            if frame is None:
                time.sleep(0.005)
                continue

            frame_count += 1
            now = time.time()

            if frame_count % DETECTION_FRAME_SKIP != 0:
                continue

            if now - self.last_processed_time < DETECTION_INTERVAL_SEC:
                continue

            small = cv2.resize(
                frame,
                (DETECTION_WIDTH, int(frame.shape[0] * DETECTION_WIDTH / frame.shape[1]))
            )

            results = recognize(small, self.analyzer, self.face_db)

            detections = []
            for bbox, name, student_id, sim, color in results:
                x1, y1, x2, y2 = bbox

                scale_x = frame.shape[1] / small.shape[1]
                scale_y = frame.shape[0] / small.shape[0]

                x1 = int(x1 * scale_x)
                x2 = int(x2 * scale_x)
                y1 = int(y1 * scale_y)
                y2 = int(y2 * scale_y)

                detections.append(((x1, y1, x2, y2), name, student_id, sim, color))

            tracks = update_tracks(tracks, detections, now)
            self.set_tracks(tracks)
            self.last_processed_time = now

    def stop(self):
        self.stop_event.set()
        self.thread.join(timeout=1.0)


def generate_frames():
    print("Loading model...")
    analyzer = load_face_analyzer()

    print("Connecting to Firestore...")
    firestore_db = init_firestore()

    face_db = load_faces_from_firestore(firestore_db, analyzer)
    print(f"Loaded database with {len(face_db)} person(s).")

    print("Starting camera...")
    vs = open_available_camera([1, 0, 2])

    if vs is None:
        return

    time.sleep(2)

    worker = RecognitionWorker(analyzer, face_db).start()

    last_seen = {}
    handled_students = set()
    already_announced = set()

    try:
        while True:
            frame = vs.read()

            if frame is None:
                time.sleep(0.01)
                continue

            worker.submit_frame(frame)
            tracks = worker.get_tracks()
            now = time.time()

            for track in tracks:
                student_id = track["stable_student_id"]
                student_name = track["stable_name"]

                if student_id is None or student_name == "Unknown":
                    continue

                if student_id in handled_students:
                    continue

                last_seen_time = last_seen.get(student_id, 0)
                if now - last_seen_time < ATTENDANCE_COOLDOWN_SEC:
                    continue

                status = mark_attendance(firestore_db, student_id, student_name)
                last_seen[student_id] = now

                if status == "inserted":
                    handled_students.add(student_id)
                elif status == "already_marked":
                    if student_id not in already_announced:
                        print(f"[ATTENDANCE] Already marked before: {student_name}")
                        already_announced.add(student_id)
                    handled_students.add(student_id)

            for track in tracks:
                x1, y1, x2, y2 = track["bbox"]
                name = track["stable_name"]
                sim = track["stable_sim"]
                color = track["stable_color"]

                label = name if name == "Unknown" else f"{name} {sim*100:.1f}%"

                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(
                    frame,
                    label,
                    (x1, max(20, y1 - 10)),
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
        worker.stop()
        vs.stop()


def main():
    for _ in generate_frames():
        pass


if __name__ == "__main__":
    main()