from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import cv2
import os
import numpy as np

app = Flask(__name__)
CORS(app)

DB_PATH = "database"

print("Loading AI model...")
DeepFace.build_model("ArcFace")
print("Model loaded")


@app.route("/recognize", methods=["POST"])
def recognize():

    if "image" not in request.files:
        return jsonify({"faces": [{"name": "Unknown"}]})

    file = request.files["image"]

    img_bytes = file.read()
    npimg = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    faces_data = []

    try:

        faces = DeepFace.extract_faces(
            img_path=frame,
            detector_backend="opencv",
            enforce_detection=False
        )

        # لو مفيش وش
        if faces is None or len(faces) == 0:
            return jsonify({"faces": [{"name": "Unknown"}]})

        for face in faces:

            area = face["facial_area"]

            x = area["x"]
            y = area["y"]
            w = area["w"]
            h = area["h"]

            face_img = frame[y:y+h, x:x+w]

            name = "Unknown"

            result = DeepFace.find(
                img_path=face_img,
                db_path=DB_PATH,
                model_name="ArcFace",
                detector_backend="opencv",
                enforce_detection=False,
                silent=True
            )

            if len(result) > 0 and len(result[0]) > 0:

                distance = result[0].iloc[0]["distance"]

                # threshold للتحكم في الدقة
                if distance < 0.5:
                    identity = result[0].iloc[0]["identity"]
                    name = os.path.basename(os.path.dirname(identity))

            faces_data.append({
                "name": name,
                "x": int(x),
                "y": int(y),
                "w": int(w),
                "h": int(h)
            })

    except Exception as e:
        print("Error:", e)
        return jsonify({"faces": [{"name": "Unknown"}]})

    return jsonify({"faces": faces_data})


if __name__ == "__main__":
    print("AI Server Started")
    app.run(host="127.0.0.1", port=5000, debug=False)