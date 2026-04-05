import firebase_admin
from firebase_admin import credentials, firestore
import requests
import numpy as np
import cv2
from insightface.app import FaceAnalysis

# Firebase init
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

# InsightFace init
app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=-1, det_size=(640, 640))  # CPU


def load_image_from_url(url):
    response = requests.get(url, timeout=20)
    image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    return image


docs = db.collection("student").stream()

known_students = []

for doc in docs:
    data = doc.to_dict()

    student_id = data.get("id")
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    face_images = data.get("faceImages")

    if not student_id or not first_name or not face_images:
        print("skip:", doc.id)
        continue

    full_name = f"{first_name} {last_name}".strip()
    embeddings = []

    for i, url in enumerate(face_images):
        image = load_image_from_url(url)

        if image is None:
            print(f"فشل تحميل صورة {i+1} للطالب {full_name}")
            continue

        faces = app.get(image)

        if len(faces) == 0:
            print(f"مفيش وش واضح في صورة {i+1} للطالب {full_name}")
            continue

        embedding = faces[0].embedding
        embeddings.append(embedding)

        print(f"تم استخراج embedding من صورة رقم {i+1} للطالب {full_name}")

    if len(embeddings) == 0:
        print(f"مفيش أي embeddings صالحة للطالب {full_name}")
        continue

    known_students.append({
        "studentId": student_id,
        "name": full_name,
        "embeddings": embeddings
    })

    print(f"\nالطالب {full_name} جاهز بعدد embeddings = {len(embeddings)}")
    print("-" * 60)

print(f"\nإجمالي الطلبة الجاهزين للمقارنة: {len(known_students)}")