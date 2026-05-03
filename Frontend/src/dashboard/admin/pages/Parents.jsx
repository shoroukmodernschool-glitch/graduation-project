import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Parents({ stats, openModal }) {
  const [parentsList, setParentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const parentsSnap = await getDocs(collection(db, "parents"));
        const studentsSnap = await getDocs(collection(db, "student"));

        const studentsMap = {};

        studentsSnap.forEach((docItem) => {
          const s = docItem.data();

          const studentId = String(s.student_id || "").trim();

          if (!studentId) return;

          const studentName =
            `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
            s.name ||
            "Student";

          const grade = s.className ? ` (${s.className})` : "";

          studentsMap[studentId] = studentName + grade;
        });

        const data = parentsSnap.docs.map((docItem) => {
          const p = docItem.data();

          const name =
            `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
            p.name ||
            "Parent";

          const parentStudentId = String(p.student_id || "").trim();
          const child = studentsMap[parentStudentId] || "—";

          return {
            id: docItem.id,
            name,
            children: child,
            contact: p.phone || p.mobile || "—",
            status: p.status || "Active",
          };
        });

        setParentsList(data);
      } catch (error) {
        console.error("Fetch parents error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  const getBadgeClass = (status) => {
    const s = String(status || "").toLowerCase();

    if (s.includes("inactive")) return "br";
    if (s.includes("warning")) return "ba";
    return "bg";
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">
          Parents / Guardians{" "}
          <span className="page-sub">
            ({loading ? "..." : parentsList.length} registered)
          </span>
        </div>

        
      </div>

      <div className="card card-table">
        <table className="tbl">
          <thead>
            <tr>
              <th>Parent name</th>
              <th>Child(ren)</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading parents...</td>
              </tr>
            ) : parentsList.length === 0 ? (
              <tr>
                <td colSpan="5">No parents found</td>
              </tr>
            ) : (
              parentsList.map((parent) => (
                <tr key={parent.id}>
                  <td>{parent.name}</td>
                  <td>{parent.children}</td>
                  <td>{parent.contact}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(parent.status)}`}>
                      {parent.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="mbtn sm"
                      onClick={() =>
                        openModal("message-parent", { name: parent.name })
                      }
                    >
                      Message
                    </button>

                    <button
                      className="mbtn sm"
                      onClick={() =>
                        openModal("parent-detail", { name: parent.name })
                      }
                    >
                      View
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