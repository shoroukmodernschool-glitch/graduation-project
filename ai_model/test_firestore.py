import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

# غير الاسم ده باسم الكوليكشن عندك
students_ref = db.collection("student")
docs = students_ref.stream()

for doc in docs:
    data = doc.to_dict()
    print("DOC ID:", doc.id)
    print(data)
    print("-" * 50)