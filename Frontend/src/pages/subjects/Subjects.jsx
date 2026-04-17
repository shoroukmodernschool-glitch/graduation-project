import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

import Sidenav from "../../dashboard/examples/Sidenav";
import routes from "../../dashboard/routes";
import DashboardNavbar from "../../dashboard/examples/Navbars/DashboardNavbar";

import "./Subjects.css";

const subjectConfig = {
  Arabic: { className: "arabic", icon: "ع" },
  English: { className: "E", icon: "E" },
  Math: { className: "math", icon: "M" },
  Science: {
    className: "Science",
    icon: <i className="fa-solid fa-atom"></i>,
  },
  Religion: { className: "religion", icon: "R" },
  "Social Studies": {
    className: "Social-Studies",
    icon: <i className="fa-solid fa-earth-africa"></i>,
  },
  Computer: {
    className: "computer",
    icon: <i className="fa-solid fa-computer"></i>,
  },
};

const subjectOrder = [
  "Arabic",
  "English",
  "Math",
  "Science",
  "Religion",
  "Computer",
  "Social Studies",
];

const getSubjectName = (subject) => {
  return subject.subject_name || subject.name || subject.title || "Subject";
};

const getConfig = (name) => {
  return subjectConfig[name] || { className: "E", icon: name?.[0] || "?" };
};

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSubjects([]);
        setLoading(false);
        return;
      }

      try {
        const studentRef = doc(db, "student", user.uid);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
          console.log("No student data found");
          setSubjects([]);
          setLoading(false);
          return;
        }

        const studentData = studentSnap.data();
        const studentStage = studentData.stage || "";
        const studentGrade = studentData.grade || "";
        const studentSection = studentData.section || "";

        let subjectsQuery;

        if (studentSection && studentSection.trim() !== "") {
          subjectsQuery = query(
            collection(db, "subject"),
            where("stage", "==", studentStage),
            where("grade", "==", studentGrade),
            where("section", "==", studentSection)
          );
        } else {
          subjectsQuery = query(
            collection(db, "subject"),
            where("stage", "==", studentStage),
            where("grade", "==", studentGrade)
          );
        }

        const snapshot = await getDocs(subjectsQuery);

        const data = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        const filteredData = data.filter((subject) => {
          const name = getSubjectName(subject);
          return name !== "Subject";
        });

        const sortedData = filteredData.sort((a, b) => {
          const nameA = getSubjectName(a);
          const nameB = getSubjectName(b);

          const indexA = subjectOrder.indexOf(nameA);
          const indexB = subjectOrder.indexOf(nameB);

          if (indexA === -1 && indexB === -1) {
            return nameA.localeCompare(nameB);
          }

          if (indexA === -1) return 1;
          if (indexB === -1) return -1;

          return indexA - indexB;
        });

        setSubjects(sortedData);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidenav routes={routes} />

      <div
        style={{
          flex: 1,
          padding: "30px",
          width: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <DashboardNavbar />

        <h1 className="hello-stu">
          Welcome, Student <i className="fa-regular fa-hand-spock"></i>
        </h1>

        <p className="Subjects">Your Subjects:</p>

        {loading ? (
          <p>Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p>No subjects found for this student.</p>
        ) : (
          <div className="cards">
            {subjects.map((subject) => {
              const name = getSubjectName(subject);
              const { className, icon } = getConfig(name);
              const progress = subject.progress ?? 50;
              const lessons = subject.lessons
                ? `${subject.lessons} Lessons`
                : "Last attended: Today";

              return (
                <div
                  key={subject.id}
                  className={`card ${className}`}
                  onClick={() => navigate(`/subject/${encodeURIComponent(name)}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="top">
                    <div className="text">
                      <h3>{name}</h3>
                      <span>Grade: {subject.grade || "-"}</span>
                    </div>

                    <div className="icon">{icon}</div>
                  </div>

                  <p className="Lessons">{lessons}</p>

                  <div className="progress">
                    <div
                      className="bar"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <span className="percent">{progress}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}