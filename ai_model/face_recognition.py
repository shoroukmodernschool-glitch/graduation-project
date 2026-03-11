from flask import Flask, request, jsonify
from deepface import DeepFace
import cv2
import os
import numpy as np

app = Flask(__name__)

DB_PATH = "database"

@app.route("/recognize", methods=["POST"])
def recognize():

    file = request.files["image"]

    img_bytes = file.read()
    npimg = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    try:

        result = DeepFace.find(
            img_path=frame,
            db_path=DB_PATH,
            model_name="ArcFace",
            distance_metric="cosine",
            enforce_detection=False,
            silent=True
        )

        if len(result) > 0 and len(result[0]) > 0:

            identity = result[0].iloc[0]["identity"]

            name = os.path.basename(os.path.dirname(identity))

        else:
            name = "Unknown"

    except:
        name = "Unknown"

    return jsonify({"name": name})


if __name__ == "__main__":
    app.run(port=5000)