export default function AiAttendance({ isRunning, streamUrl, startCamera, stopCamera }) {
  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">AI Attendance</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="qb inline-btn" onClick={startCamera}>Start Camera</button>
          <button className="qb inline-btn" onClick={stopCamera}>Stop Camera</button>
        </div>
      </div>

      <div className="metrics" style={{ marginBottom: 12 }}>
        <div className="mc">
          <div className="mc-l">Camera status</div>
          <div className="mc-v" style={{ color: isRunning ? "#27500A" : "#791F1F" }}>
            {isRunning ? "Active" : "Inactive"}
          </div>
          <div className="mc-s muted">Face recognition model</div>
        </div>

        <div className="mc">
          <div className="mc-l">Recognition</div>
          <div className="mc-v">{isRunning ? "ON" : "OFF"}</div>
          <div className="mc-s muted">Inside dashboard</div>
        </div>
      </div>

      <div
        className="card"
        style={{
          textAlign: "center",
          minHeight: "620px",
          padding: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "820px",
            height: "520px",
            maxWidth: "100%",
            overflow: "hidden",
            borderRadius: "15px",
            border: "2px solid #ccc",
            background: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isRunning && streamUrl ? (
            <img
              src={streamUrl}
              alt="AI Camera"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                color: "#fff",
                fontSize: "22px",
                fontWeight: "bold",
                textAlign: "center",
                padding: "20px",
              }}
            >
              Click Start Camera to open Face Recognition
            </div>
          )}
        </div>
      </div>
    </div>
  );
}