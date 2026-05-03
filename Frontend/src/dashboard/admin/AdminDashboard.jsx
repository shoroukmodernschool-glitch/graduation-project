import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import "./AdminDashboard.css";

import AdminTopbar from "./components/AdminTopbar";
import AdminTabs from "./components/AdminTabs";
import AdminModal from "./components/AdminModal";

import Overview from "./pages/Overview";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Parents from "./pages/Parents";
import Attendance from "./pages/Attendance";
import AiAttendance from "./pages/AiAttendance";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";

export default function AdminDashboard() {
  const [page, setPage] = useState("overview");
  const [showNoti, setShowNoti] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [dot, setDot] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
    messages: 0,
    attendanceRate: 0,
    present: 0,
    absent: 0,
    performanceByGrade: [],
    recentActivity: [],
    loading: true,
  });

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        const studentsSnap = await getDocs(collection(db, "student"));
        const teachersSnap = await getDocs(collection(db, "teachers"));
        const parentsSnap = await getDocs(collection(db, "parents"));
        const messagesSnap = await getDocs(collection(db, "notifications"));

        const today = new Date().toISOString().split("T")[0];

        const attendanceQ = query(
          collection(db, "attendance"),
          where("date", "==", today)
        );

        const attendanceSnap = await getDocs(attendanceQ);

        const studentMap = {};
        const gradeStats = {};

        studentsSnap.forEach((docItem) => {
          const data = docItem.data();
          const studentId = String(data.student_id || "").trim();
          const uid = String(data.uid || docItem.id || "").trim();
          const grade = String(data.className || "Unknown").trim();

          if (studentId) studentMap[studentId] = data;
          if (uid) studentMap[uid] = data;

          if (!gradeStats[grade]) {
            gradeStats[grade] = { total: 0, present: 0 };
          }

          gradeStats[grade].total += 1;
        });

        let present = 0;
        let absent = 0;
        const activityList = [];

        attendanceSnap.forEach((docItem) => {
          const data = docItem.data();
          const status = String(data.status || "").toLowerCase();
          const attendanceStudentId = String(data.studentId || "").trim();

          const studentData = studentMap[attendanceStudentId];
          const grade = String(studentData?.className || "Unknown").trim();

          if (status === "present") {
            present += 1;
            if (gradeStats[grade]) gradeStats[grade].present += 1;
          }

          if (status === "absent") absent += 1;

          activityList.push({
            id: docItem.id,
            name: data.name || studentData?.firstName || "Student",
            status: status || "recorded",
            grade,
            time: data.time || "",
          });
        });

        const totalAttendance = present + absent;
        const attendanceRate =
          totalAttendance > 0 ? Math.round((present / totalAttendance) * 100) : 0;

        const performanceByGrade = Object.keys(gradeStats)
          .filter((grade) => grade !== "Unknown")
          .sort((a, b) => Number(a) - Number(b))
          .map((grade) => {
            const total = gradeStats[grade].total;
            const gradePresent = gradeStats[grade].present;
            const percent = total > 0 ? Math.round((gradePresent / total) * 100) : 0;

            return { grade: `Grade ${grade}`, percent };
          });

        const recentActivity = activityList
          .sort((a, b) => String(b.time).localeCompare(String(a.time)))
          .slice(0, 4);

        setStats({
          students: studentsSnap.size,
          teachers: teachersSnap.size,
          parents: parentsSnap.size,
          messages: messagesSnap.size,
          attendanceRate,
          present,
          absent,
          performanceByGrade,
          recentActivity,
          loading: false,
        });
      } catch (error) {
        console.error("Admin dashboard overview error:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchOverviewStats();
  }, []);

  const tabs = [
    "overview",
    "students",
    "teachers",
    "parents",
    "attendance",
    "ai-attendance",
    "messages",
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const closeAll = () => {
    setModal(null);
    setShowNoti(false);
    setShowProfile(false);
  };

  const openModal = (type, data = {}) => setModal({ type, data });

  const confirm = (msg) => {
    closeAll();
    showToast(msg);
  };

  const startCamera = () => {
    if (isRunning) return;
    setStreamUrl(`http://127.0.0.1:5000/video_feed?ts=${Date.now()}`);
    setIsRunning(true);
  };

  const stopCamera = () => {
    setIsRunning(false);
    setStreamUrl("");
  };

  const formatTabName = (tab) => {
    if (tab === "ai-attendance") return "AI Attendance";
    return tab[0].toUpperCase() + tab.slice(1);
  };

  return (
    <div className="admin-dashboard-page">
      <div className="wrap container">
        <AdminTopbar
          showNoti={showNoti}
          setShowNoti={setShowNoti}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          dot={dot}
          setDot={setDot}
          closeAll={closeAll}
          showToast={showToast}
          stats={stats}
        />

        <AdminTabs
          tabs={tabs}
          page={page}
          setPage={setPage}
          formatTabName={formatTabName}
        />

        {page === "overview" && <Overview stats={stats} openModal={openModal} />}
        {page === "students" && <Students stats={stats} openModal={openModal} />}
        {page === "teachers" && <Teachers stats={stats} openModal={openModal} />}
        {page === "parents" && <Parents stats={stats} openModal={openModal} />}
        {page === "attendance" && <Attendance stats={stats} openModal={openModal} />}
        {page === "ai-attendance" && (
          <AiAttendance
            isRunning={isRunning}
            streamUrl={streamUrl}
            startCamera={startCamera}
            stopCamera={stopCamera}
          />
        )}
        
        {page === "messages" && <Messages openModal={openModal} />}

        {modal && (
          <div className="overlay show" onClick={closeAll}>
            <div className="mwrap" onClick={(e) => e.stopPropagation()}>
              <AdminModal modal={modal} closeAll={closeAll} openModal={openModal} confirm={confirm} />
            </div>
          </div>
        )}

        {toast && <div className="toast" style={{ display: "block" }}>{toast}</div>}
      </div>
    </div>
  );
}