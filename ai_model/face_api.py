from flask import Flask, Response
from flask_cors import CORS
from face_recognition import generate_frames

app = Flask(__name__)
CORS(app)

@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)