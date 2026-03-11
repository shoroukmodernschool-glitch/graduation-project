import React, { useRef, useEffect, useState } from "react";

export default function Camera() {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [names, setNames] = useState([]);
  const scanning = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {

    startCamera();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

  }, []);

  async function startCamera() {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      const video = videoRef.current;

      if (video) {

        video.srcObject = stream;

        video.onloadedmetadata = () => {
          video.play();
          startScanning();
        };

      }

    } catch (error) {

      console.log("Camera error:", error);

    }

  }

  function startScanning() {

    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      scanFace();
    }, 300);

  }

  async function scanFace() {

    const video = videoRef.current;

    if (!video || scanning.current) return;

    scanning.current = true;

    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");

    tempCanvas.width = 160;
    tempCanvas.height = 120;

    ctx.drawImage(video, 0, 0, 160, 120);

    const blob = await new Promise(resolve =>
      tempCanvas.toBlob(resolve, "image/jpeg", 0.6)
    );

    const formData = new FormData();
    formData.append("image", blob);

    try {

      const res = await fetch("http://127.0.0.1:5000/recognize", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      if (data.faces && data.faces.length > 0) {

        drawBoxes(data.faces);

        setNames(
          data.faces.map(face => face.name || "Unknown")
        );

      } else {

        clearCanvas();
        setNames(["Unknown"]);

      }

    } catch (err) {

      console.log("Server error:", err);
      setNames(["Server Offline"]);

    }

    scanning.current = false;

  }

  function drawBoxes(faces) {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // مسح أي رسم قديم
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!faces || faces.length === 0) return;

    ctx.lineWidth = 3;
    ctx.font = "18px Arial";

    faces.forEach(face => {

      const scaleX = 640 / 160;
      const scaleY = 480 / 120;

      const x = face.x * scaleX;
      const y = face.y * scaleY;
      const w = face.w * scaleX;
      const h = face.h * scaleY;

      ctx.strokeStyle = face.name === "Unknown" ? "red" : "lime";
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillText(face.name, x, y - 10);

    });

  }

  function clearCanvas() {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

  }

  return (

    <div style={{ textAlign: "center" }}>

      <h1>Face Recognition</h1>

      <div style={{ position: "relative", display: "inline-block" }}>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          width="640"
          height="480"
        />

        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            position: "absolute",
            top: 0,
            left: 0
          }}
        />

      </div>

      <h2>
        {names.length ? names.join(", ") : "Scanning..."}
      </h2>

    </div>

  );

}