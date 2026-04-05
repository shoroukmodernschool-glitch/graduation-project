import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

docs = db.collection("student").stream()

for doc in docs:
    data = doc.to_dict()
    print("DOC:", doc.id)
    print("id:", data.get("id"))
    print("firstName:", data.get("firstName"))
    print("lastName:", data.get("lastName"))
    print("faceImages:", data.get("faceImages"))
    print("-" * 50)