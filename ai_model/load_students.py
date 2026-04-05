import firebase_admin
from firebase_admin import credentials, firestore
import requests
import numpy as np
import cv2

# Firebase init
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()


def load_image_from_url(url):
    response = requests.get(url)
    image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    return image


students_ref = db.collection("student")
docs = students_ref.stream()

students_data = []

for doc in docs:
    data = doc.to_dict()

    student_id = data.get("id")
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    face_image = data.get("faceImage")

    # فلترة أي document فاضي أو قديم
    if not student_id or not face_image or not first_name:
        print("⏭️ skip document:", doc.id)
        continue

    image = load_image_from_url(face_image)

    if image is None:
        print(f"❌ فشل تحميل صورة الطالب {student_id}")
        continue

    full_name = f"{first_name} {last_name}"

    students_data.append({
        "studentId": student_id,
        "name": full_name,
        "image": image
    })

    print(f"✅ تم تحميل: {full_name} - {student_id}")

print(f"\n🎯 إجمالي الطلبة اللي اتحملوا: {len(students_data)}")