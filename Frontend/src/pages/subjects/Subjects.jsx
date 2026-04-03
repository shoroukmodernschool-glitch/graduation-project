import { useEffect, useState } from "react";
import Sidenav from "../../dashboard/examples/Sidenav";
import routes from "../../dashboard/routes";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Subjects.css";

const subjectConfig = {
  English: { className: "E", icon: "E" },
  Math: { className: "math", icon: "M" },
  Science: { className: "Science", icon: <i className="fa-solid fa-atom"></i> },
  Arabic: { className: "arabic", icon: "ع" },
  "Social Studies": { className: "Social-Studies", icon: <i className="fa-solid fa-earth-africa"></i> },
  Computer: { className: "computer", icon: <i className="fa-solid fa-computer"></i> },
};

const getConfig = (name) =>
  subjectConfig[name] || { className: "E", icon: name?.[0] || "?" };

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "subject"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidenav routes={routes} />

      <div style={{ flex: 1, padding: "30px" }}>

        <h1 className="hello-stu">
          Welcome, Student <i className="fa-regular fa-hand-spock"></i>
        </h1>

        <p className="Subjects">Your Subjects:</p>

        <div className="cards">
          {subjects.map((subject) => {
            const name =
              subject.name ||
              subject.title ||
              subject.subject_name ||
              "Subject";

            const { className, icon } = getConfig(name);
            const progress = subject.progress ?? 50;
            const lessons = subject.lessons
              ? `${subject.lessons} Lessons`
              : "Last attended: Today";

            return (
              <div key={subject.id} className={`card ${className}`}>

                <div className="top">

                  <div className="text">
                    <h3>{name}</h3>
                    <span>Grade: {subject.grade || "10"}</span>
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

      </div>
    </div>
  );
}