import os
import cv2
import numpy as np
import requests
import firebase_admin
from firebase_admin import credentials, firestore
import matplotlib.pyplot as plt

from insightface.app import FaceAnalysis
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_curve,
    auc
)
from sklearn.preprocessing import label_binarize


TEST_DIR = "dataset/test"
SIMILARITY_THRESHOLD = 0.66


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


def get_embedding_from_image(img, analyzer):
    faces = analyzer.get(img)

    if len(faces) == 0:
        return None

    best_face = max(
        faces,
        key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1])
    )

    return best_face.embedding


def get_embedding_from_file(image_path, analyzer):
    img = cv2.imread(image_path)

    if img is None:
        print(f"[SKIP] Cannot read image: {image_path}")
        return None

    return get_embedding_from_image(img, analyzer)


def cosine_similarity(a, b):
    a = a / (np.linalg.norm(a) + 1e-10)
    b = b / (np.linalg.norm(b) + 1e-10)
    return float(np.dot(a, b))


def load_reference_faces_from_firestore(firestore_db, analyzer):
    face_db = {}

    docs = firestore_db.collection("student").stream()

    for doc in docs:
        data = doc.to_dict()

        first_name = data.get("firstName", "").strip()
        last_name = data.get("lastName", "").strip()
        face_images = data.get("faceImages")

        if not first_name or not face_images:
            continue

        person_name = f"{first_name} {last_name}".strip()
        embeddings = []

        for url in face_images:
            img = load_image_from_url(url)

            if img is None:
                continue

            embedding = get_embedding_from_image(img, analyzer)

            if embedding is not None:
                embeddings.append(embedding)

        if embeddings:
            face_db[person_name] = embeddings
            print(f"[REFERENCE] Loaded {len(embeddings)} image(s) for {person_name}")

    return face_db


def predict_person(test_embedding, face_db):
    best_name = "Unknown"
    best_score = 0.0
    class_scores = {}

    for person_name, embeddings in face_db.items():
        sims = [cosine_similarity(test_embedding, emb) for emb in embeddings]
        person_score = max(sims)

        class_scores[person_name] = person_score

        if person_score > best_score:
            best_score = person_score
            best_name = person_name

    if best_score < SIMILARITY_THRESHOLD:
        best_name = "Unknown"

    class_scores["Unknown"] = 1 - best_score

    return best_name, best_score, class_scores


def evaluate_model(analyzer, face_db):
    y_true = []
    y_pred = []
    all_scores = []

    labels_all = sorted(list(face_db.keys()) + ["Unknown"])

    print("\nStarting evaluation...\n")

    for actual_name in os.listdir(TEST_DIR):
        actual_folder = os.path.join(TEST_DIR, actual_name)

        if not os.path.isdir(actual_folder):
            continue

        for image_name in os.listdir(actual_folder):
            image_path = os.path.join(actual_folder, image_name)

            test_embedding = get_embedding_from_file(image_path, analyzer)

            if test_embedding is None:
                continue

            predicted_name, score, class_scores = predict_person(test_embedding, face_db)

            y_true.append(actual_name)
            y_pred.append(predicted_name)

            score_row = [class_scores.get(label, 0.0) for label in labels_all]
            all_scores.append(score_row)

            status = "ok" if actual_name == predicted_name else "wrong"

            print(
                f"Actual: {actual_name} | "
                f"Predicted: {predicted_name} | "
                f"Score: {score:.6f} | "
                f"Status: {status}"
            )

    return y_true, y_pred, np.array(all_scores), labels_all


def save_confusion_matrix(y_true, y_pred, labels):
    cm = confusion_matrix(y_true, y_pred, labels=labels)

    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=labels)
    disp.plot(cmap="Blues", xticks_rotation=45)

    plt.title("Confusion Matrix")
    plt.tight_layout()
    plt.savefig("confusion_matrix.png", dpi=300)
    plt.show()


def save_roc_curve(y_true, y_scores, labels_all):
    try:
        valid_labels = []

        for label in labels_all:
            if label in y_true and len(set(y_true)) > 1:
                valid_labels.append(label)

        if len(valid_labels) < 2:
            print("[ROC SKIPPED] Not enough classes for ROC Curve")
            return

        label_indexes = [labels_all.index(label) for label in valid_labels]

        y_true_bin = label_binarize(y_true, classes=valid_labels)
        selected_scores = y_scores[:, label_indexes]

        plt.figure()

        for i, label in enumerate(valid_labels):
            fpr, tpr, _ = roc_curve(y_true_bin[:, i], selected_scores[:, i])
            roc_auc = auc(fpr, tpr)

            plt.plot(fpr, tpr, label=f"{label} AUC = {roc_auc:.6f}")

        plt.plot([0, 1], [0, 1], linestyle="--")
        plt.xlabel("False Positive Rate")
        plt.ylabel("True Positive Rate")
        plt.title("ROC Curve")
        plt.legend(fontsize=8)
        plt.tight_layout()
        plt.savefig("roc_curve.png", dpi=300)
        plt.show()

    except Exception as e:
        print("[ROC ERROR]", e)


def main():
    analyzer = load_face_analyzer()
    firestore_db = init_firestore()

    print("Loading reference images from Firebase / Cloudinary...")
    face_db = load_reference_faces_from_firestore(firestore_db, analyzer)

    print(f"\nLoaded {len(face_db)} student(s) from reference data.\n")

    if not face_db:
        print("[ERROR] No reference images loaded from Firebase / Cloudinary.")
        return

    y_true, y_pred, y_scores, labels_all = evaluate_model(analyzer, face_db)

    if len(y_true) == 0:
        print("[ERROR] No testing images found or no faces detected.")
        return

    report_labels = sorted(list(set(y_true) | set(y_pred)))

    print("\nClassification Report:\n")
    report = classification_report(
        y_true,
        y_pred,
        labels=report_labels,
        digits=6,
        zero_division=0
    )
    print(report)

    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, labels=report_labels, average="macro", zero_division=0)
    recall = recall_score(y_true, y_pred, labels=report_labels, average="macro", zero_division=0)
    f1 = f1_score(y_true, y_pred, labels=report_labels, average="macro", zero_division=0)

    print("\nMain Evaluation Metrics:")
    print(f"Accuracy: {accuracy:.6f}")
    print(f"Precision: {precision:.6f}")
    print(f"Recall: {recall:.6f}")
    print(f"F1-score: {f1:.6f}")

    with open("evaluation_results.txt", "w", encoding="utf-8") as file:
        file.write("Classification Report:\n")
        file.write(report)
        file.write("\nMain Evaluation Metrics:\n")
        file.write(f"Accuracy: {accuracy:.6f}\n")
        file.write(f"Precision: {precision:.6f}\n")
        file.write(f"Recall: {recall:.6f}\n")
        file.write(f"F1-score: {f1:.6f}\n")

    save_confusion_matrix(y_true, y_pred, report_labels)
    save_roc_curve(y_true, y_scores, labels_all)

    print("\nDone ✅")
    print("Saved files:")
    print("- confusion_matrix.png")
    print("- roc_curve.png")
    print("- evaluation_results.txt")


if __name__ == "__main__":
    main()