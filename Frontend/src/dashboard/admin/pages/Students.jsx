import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Students({ stats, openModal }) {
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState("All grades");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsSnap = await getDocs(collection(db, "student"));

        const data = studentsSnap.docs.map((docItem) => {
          const student = docItem.data();

          const firstName = student.firstName || "";
          const lastName = student.lastName || "";
          const fullName =
            `${firstName} ${lastName}`.trim() ||
            student.name ||
            student.fullName ||
            "Unknown student";

          const gradeValue = student.className || student.grade || "—";
          const gradeText =
            gradeValue === "—" ? "—" : `Grade ${gradeValue}`;

          return {
            id: docItem.id,
            name: fullName,
            grade: gradeText,
            gradeValue: String(gradeValue),
            attendance: student.attendance || "—",
            avgScore: student.avgScore || student.averageScore || "—",
            status: student.status || "Active",
          };
        });

        setStudentsList(data);
      } catch (error) {
        console.error("Fetch students error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    if (selectedGrade === "All grades") return studentsList;

    const gradeNumber = selectedGrade.replace("Grade ", "");
    return studentsList.filter((student) => student.gradeValue === gradeNumber);
  }, [studentsList, selectedGrade]);

  const getBadgeClass = (status) => {
    const s = String(status || "").toLowerCase();

    if (s.includes("warning")) return "ba";
    if (s.includes("risk") || s.includes("inactive")) return "br";
    return "bg";
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">
          All students{" "}
          <span className="page-sub">
            ({loading ? "..." : filteredStudents.length} total)
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <select
            className="ctrl-select"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option>All grades</option>
            <option>Grade 1</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
            <option>Grade 4</option>
            <option>Grade 5</option>
            <option>Grade 6</option>
          </select>

          <button className="qb inline-btn" onClick={() => openModal("add-student")}>
            Add student
          </button>
        </div>
      </div>

      <div className="card card-table">
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>Attendance</th>
              <th>Avg score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading students...</td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6">No students found</td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  onClick={() =>
                    openModal("student-detail", {
                      name: student.name,
                      grade: student.grade,
                      att: student.attendance,
                      avg: student.avgScore,
                    })
                  }
                >
                  <td>{student.name}</td>
                  <td>{student.grade}</td>
                  <td>{student.attendance}</td>
                  <td>{student.avgScore}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="mbtn sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("edit-student", { name: student.name });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="mbtn sm danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("confirm-delete", {
                          type: "student",
                          name: student.name,
                        });
                      }}
                    >
                      Remove
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