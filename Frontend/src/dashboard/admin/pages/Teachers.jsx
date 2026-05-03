import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Teachers({ stats, openModal }) {
  const [teachersList, setTeachersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersSnap = await getDocs(collection(db, "teachers"));

        const data = teachersSnap.docs.map((docItem) => {
          const teacher = docItem.data();

          const name =
            teacher.name ||
            teacher.fullName ||
            `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
            "Teacher";

          const subject = Array.isArray(teacher.subjects)
            ? teacher.subjects.join(", ")
            : teacher.subject || teacher.subjectName || "—";

          const classes = Array.isArray(teacher.classes)
            ? teacher.classes.join(", ")
            : Array.isArray(teacher.grades)
            ? teacher.grades.map((g) => `Grade ${g}`).join(", ")
            : teacher.className || teacher.grade || "—";

          return {
            id: docItem.id,
            name,
            subject,
            classes,
            rating: teacher.rating || teacher.avgRating || "—",
            status: teacher.status || "Active",
          };
        });

        setTeachersList(data);
      } catch (error) {
        console.error("Fetch teachers error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const getBadgeClass = (status) => {
    const s = String(status || "").toLowerCase();

    if (s.includes("leave") || s.includes("warning")) return "ba";
    if (s.includes("inactive")) return "br";
    return "bg";
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">
          Teaching staff{" "}
          <span className="page-sub">
            ({loading ? "..." : teachersList.length} total)
          </span>
        </div>

        <button
          className="qb inline-btn"
          onClick={() => openModal("add-teacher")}
        >
          Add teacher
        </button>
      </div>

      <div className="card card-table">
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Classes</th>
              <th>Avg rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading teachers...</td>
              </tr>
            ) : teachersList.length === 0 ? (
              <tr>
                <td colSpan="6">No teachers found</td>
              </tr>
            ) : (
              teachersList.map((teacher) => (
                <tr
                  key={teacher.id}
                  onClick={() =>
                    openModal("teacher-detail", {
                      name: teacher.name,
                      subj: teacher.subject,
                      classes: teacher.classes,
                      rating: teacher.rating,
                    })
                  }
                >
                  <td>{teacher.name}</td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.classes}</td>
                  <td>
                    {teacher.rating === "—"
                      ? "—"
                      : `${teacher.rating} / 5`}
                  </td>
                  <td>
                    <span className={`badge ${getBadgeClass(teacher.status)}`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="mbtn sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("edit-teacher", { name: teacher.name });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="mbtn sm danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("confirm-delete", {
                          type: "teacher",
                          name: teacher.name,
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