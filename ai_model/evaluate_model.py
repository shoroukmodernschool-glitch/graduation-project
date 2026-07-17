import os
import cv2
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    roc_curve,
    auc,
    ConfusionMatrixDisplay
)

from face_recognition import (
    init_firestore,
    load_face_analyzer,
    load_faces_from_firestore,
    recognize
)


CSV_PATH = "model_evaluation/evaluation_links.csv"
OUTPUT_RESULTS_PATH = "model_evaluation/evaluation_results.csv"
CONFUSION_MATRIX_IMAGE = "model_evaluation/confusion_matrix.png"
ROC_CURVE_IMAGE = "model_evaluation/roc_curve.png"


def normalize_columns(df):
    df.columns = [
        str(col)
        .replace("\ufeff", "")
        .strip()
        .replace(" ", "_")
        .lower()
        for col in df.columns
    ]

    # يشيل أي عمود فاضي Excel عامله لوحده
    df = df.loc[:, ~df.columns.str.startswith("unnamed")]

    return df


def calculate_multiclass_specificity(cm):
    specificities = []

    for i in range(len(cm)):
        tp = cm[i, i]
        fp = cm[:, i].sum() - tp
        fn = cm[i, :].sum() - tp
        tn = cm.sum() - (tp + fp + fn)

        specificity = tn / (tn + fp) if (tn + fp) != 0 else 0
        specificities.append(specificity)

    return float(np.mean(specificities))


def evaluate_single_image(image_path, analyzer, face_db):
    img = cv2.imread(image_path)

    if img is None:
        return "Unknown", 0.0, "image_not_loaded"

    results = recognize(img, analyzer, face_db)

    if len(results) == 0:
        return "Unknown", 0.0, "no_face_detected"

    best_result = max(results, key=lambda r: r[3])

    bbox, predicted_name, student_id, score, color = best_result

    return predicted_name, score, "ok"


def main():
    if not os.path.exists(CSV_PATH):
        print(f"[ERROR] CSV file not found: {CSV_PATH}")
        return

    # قراءة CSV حتى لو Excel حافظه بفاصل مختلف
    df = pd.read_csv(CSV_PATH, sep=None, engine="python")
    df = normalize_columns(df)

    print("[INFO] CSV columns:", list(df.columns))

    if "actual" not in df.columns or "image_path" not in df.columns:
        print("[ERROR] CSV must contain these columns: actual, image_path")
        print("[TIP] أول صف في الشيت لازم يبقى: actual,image_path")
        return

    print("Loading model...")
    analyzer = load_face_analyzer()

    print("Connecting to Firestore...")
    firestore_db = init_firestore()

    print("Loading registered student faces from Firestore...")
    face_db = load_faces_from_firestore(firestore_db, analyzer)

    print(f"Loaded database with {len(face_db)} student(s).")
    print("Starting evaluation...")

    output_rows = []

    for index, row in df.iterrows():
        actual = str(row["actual"]).strip()
        image_path = str(row["image_path"]).strip()

        predicted, score, status = evaluate_single_image(
            image_path,
            analyzer,
            face_db
        )

        output_rows.append({
            "image_path": image_path,
            "actual": actual,
            "predicted": predicted,
            "score": round(score, 4),
            "status": status,
            "correct": 1 if actual == predicted else 0
        })

        print(
            f"{index + 1}) Actual: {actual} | "
            f"Predicted: {predicted} | "
            f"Score: {score:.4f} | "
            f"Status: {status}"
        )

    results_df = pd.DataFrame(output_rows)
    results_df.to_csv(OUTPUT_RESULTS_PATH, index=False)

    print("\nSaved results to:")
    print(OUTPUT_RESULTS_PATH)

    y_true = results_df["actual"]
    y_pred = results_df["predicted"]

    labels = sorted(list(set(y_true) | set(y_pred)))

    cm = confusion_matrix(y_true, y_pred, labels=labels)

    print("\nConfusion Matrix:")
    print(cm)

    print("\nLabels:")
    print(labels)

    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, labels=labels, zero_division=0))

    report = classification_report(
        y_true,
        y_pred,
        labels=labels,
        zero_division=0,
        output_dict=True
    )

    precision = report["weighted avg"]["precision"]
    recall = report["weighted avg"]["recall"]
    f1 = report["weighted avg"]["f1-score"]
    specificity = calculate_multiclass_specificity(cm)

    print("\nMain Evaluation Metrics:")
    print("Precision:", round(precision, 3))
    print("Recall:", round(recall, 3))
    print("F1 Score:", round(f1, 3))
    print("Specificity:", round(specificity, 3))

    plt.figure(figsize=(8, 6))
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=labels)
    disp.plot(cmap="Blues", values_format="d", xticks_rotation=45)
    plt.title("Confusion Matrix")
    plt.tight_layout()
    plt.savefig(CONFUSION_MATRIX_IMAGE)
    plt.close()

    print("\nSaved Confusion Matrix image to:")
    print(CONFUSION_MATRIX_IMAGE)

    # ROC Curve: Known Student vs Unknown
    y_true_binary = results_df["actual"].apply(
        lambda x: 0 if str(x).strip().lower() == "unknown" else 1
    )

    y_score = results_df["score"]

    if len(set(y_true_binary)) == 2:
        fpr, tpr, thresholds = roc_curve(y_true_binary, y_score)
        roc_auc = auc(fpr, tpr)

        print("AUC:", round(roc_auc, 3))

        plt.figure()
        plt.plot(fpr, tpr, label=f"ROC Curve AUC = {roc_auc:.2f}")
        plt.plot([0, 1], [0, 1], linestyle="--")
        plt.xlabel("False Positive Rate")
        plt.ylabel("True Positive Rate")
        plt.title("ROC Curve")
        plt.legend()
        plt.tight_layout()
        plt.savefig(ROC_CURVE_IMAGE)
        plt.close()

        print("\nSaved ROC Curve image to:")
        print(ROC_CURVE_IMAGE)
    else:
        print("\n[WARNING] ROC Curve was not created.")
        print("You need both Known students and Unknown images in the CSV.")


if __name__ == "__main__":
    main()