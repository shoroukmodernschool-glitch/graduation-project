import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Attendance({ stats, openModal }) {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const studentsSnap = await getDocs(collection(db, "student"));

        const studentMap = {};

        studentsSnap.forEach((docItem) => {
          const data = docItem.data();

          const studentId = String(data.student_id || "").trim();
          const uid = String(data.uid || docItem.id || "").trim();

          if (studentId) studentMap[studentId] = data;
          if (uid) studentMap[uid] = data;
        });

        const attendanceQ = query(
          collection(db, "attendance"),
          where("date", "==", selectedDate)
        );

        const attendanceSnap = await getDocs(attendanceQ);

        const classStats = {};

        attendanceSnap.forEach((docItem) => {
          const data = docItem.data();

          const attendanceStudentId = String(data.studentId || "").trim();
          const studentData = studentMap[attendanceStudentId];

          const grade = String(studentData?.className || "Unknown").trim();
          const cls = grade === "Unknown" ? "Unknown" : `Grade ${grade}`;

          const status = String(data.status || "").toLowerCase();

          if (!classStats[cls]) {
            classStats[cls] = {
              cls,
              teacher: "—",
              present: 0,
              absent: 0,
              late: 0,
            };
          }

          if (status === "present") classStats[cls].present += 1;
          if (status === "absent") classStats[cls].absent += 1;
          if (status === "late") classStats[cls].late += 1;
        });

        const rows = Object.values(classStats).map((item) => {
          const total = item.present + item.absent + item.late;
          const rate = total > 0 ? Math.round((item.present / total) * 100) : 0;

          let badge = "bg";
          if (rate < 85) badge = "ba";
          if (rate < 75) badge = "br";

          return {
            ...item,
            rate: `${rate}%`,
            badge,
          };
        });

        setAttendanceRows(rows);
      } catch (error) {
        console.error("Fetch attendance error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedDate]);

  const totals = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;

    attendanceRows.forEach((row) => {
      present += row.present;
      absent += row.absent;
      late += row.late;
    });

    const total = present + absent + late;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      present,
      absent,
      late,
      attendanceRate,
    };
  }, [attendanceRows]);

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Attendance — Today</div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="date"
            className="ctrl-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <button
            className="qb inline-btn"
            onClick={() => openModal("export-attendance")}
          >
            Export
          </button>
        </div>
      </div>

      <div className="metrics" style={{ marginBottom: 12 }}>
        <div className="mc">
          <div className="mc-l">Present</div>
          <div className="mc-v" style={{ color: "#27500A" }}>
            {loading ? "..." : totals.present}
          </div>
          <div className="mc-s muted">
            {loading ? "..." : `${totals.attendanceRate}% of recorded`}
          </div>
        </div>

        <div className="mc">
          <div className="mc-l">Absent</div>
          <div className="mc-v" style={{ color: "#791F1F" }}>
            {loading ? "..." : totals.absent}
          </div>
          <div className="mc-s muted">Recorded today</div>
        </div>

        <div className="mc">
          <div className="mc-l">Late</div>
          <div className="mc-v" style={{ color: "#633806" }}>
            {loading ? "..." : totals.late}
          </div>
          <div className="mc-s muted">Recorded today</div>
        </div>

        <div className="mc">
          <div className="mc-l">Excused</div>
          <div className="mc-v">0</div>
          <div className="mc-s muted">Not connected yet</div>
        </div>
      </div>

      <div className="card card-table">
        <table className="tbl">
          <thead>
            <tr>
              <th>Class</th>
              <th>Teacher</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Rate</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading attendance...</td>
              </tr>
            ) : attendanceRows.length === 0 ? (
              <tr>
                <td colSpan="7">No attendance records found</td>
              </tr>
            ) : (
              attendanceRows.map((row) => (
                <tr key={row.cls}>
                  <td>{row.cls}</td>
                  <td>{row.teacher}</td>
                  <td>{row.present}</td>
                  <td>{row.absent}</td>
                  <td>{row.late}</td>
                  <td>
                    <span className={`badge ${row.badge}`}>{row.rate}</span>
                  </td>
                  <td>
                    <button
                      className="mbtn sm"
                      onClick={() => openModal("attendance-detail", { cls: row.cls })}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}