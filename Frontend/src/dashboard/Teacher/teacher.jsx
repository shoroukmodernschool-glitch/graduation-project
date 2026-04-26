import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { db, auth } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

import DashboardLayout from "../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../examples/Navbars/DashboardNavbar";
import Footer from "../examples/Footer";

function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getTeacherName = (teacherData) => {
    if (!teacherData) return "Teacher";

    if (teacherData.name) return teacherData.name;
    if (teacherData.fullName) return teacherData.fullName;
    if (teacherData.teacher_name) return teacherData.teacher_name;

    const firstName = teacherData.firstName || "";
    const lastName = teacherData.lastName || "";

    return `${firstName} ${lastName}`.trim() || "Teacher";
  };

  const getTeacherGrades = (teacherData) => {
    if (!teacherData?.subjects || !Array.isArray(teacherData.subjects)) return [];

    return [
      ...new Set(
        teacherData.subjects
          .map((subject) => String(subject.grade || "").trim())
          .filter(Boolean)
      ),
    ];
  };

  const getTeacherSubjectIds = (teacherData) => {
    if (!teacherData?.subjects || !Array.isArray(teacherData.subjects)) return [];

    return teacherData.subjects
      .map((subject) => subject.subjectId)
      .filter(Boolean);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const teacherQuery = query(
          collection(db, "teachers"),
          where("email", "==", user.email)
        );

        const teacherSnapshot = await getDocs(teacherQuery);

        const teacherData = teacherSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const currentTeacher = teacherData[0] || null;
        setTeacher(currentTeacher);

        if (!currentTeacher) {
          setSubjectsCount(0);
          setStudentsCount(0);
          setNotificationsCount(0);
          setAttendanceCount(0);
          return;
        }

        const teacherGrades = getTeacherGrades(currentTeacher);
        const teacherSubjectIds = getTeacherSubjectIds(currentTeacher);

        if (Array.isArray(currentTeacher.subjects)) {
          setSubjectsCount(currentTeacher.subjects.length);
        } else if (currentTeacher.subject) {
          setSubjectsCount(1);
        } else {
          setSubjectsCount(0);
        }

        let teacherStudents = [];

        try {
          const studentsSnapshot = await getDocs(collection(db, "student"));

          teacherStudents = studentsSnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((student) => {
              const studentGrade = String(student.grade || "").trim();
              return teacherGrades.includes(studentGrade);
            });

          setStudentsCount(teacherStudents.length);
        } catch (error) {
          console.error("Students error:", error);
          setStudentsCount(0);
        }

        try {
          const studentIds = teacherStudents.map((student) =>
            String(student.student_id || student.studentId || student.id)
          );

          const attendanceSnapshot = await getDocs(collection(db, "attendance"));

          const teacherAttendance = attendanceSnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((record) => {
              const attendanceStudentId = String(
                record.student_id || record.studentId || record.studentID || ""
              );

              return (
                studentIds.includes(attendanceStudentId) ||
                teacherGrades.includes(String(record.grade || "").trim())
              );
            });

          setAttendanceCount(teacherAttendance.length);
        } catch (error) {
          console.error("Attendance error:", error);
          setAttendanceCount(0);
        }

        try {
          const notificationsSnapshot = await getDocs(collection(db, "notifications"));

          const teacherNotifications = notificationsSnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((notification) => {
              return (
                notification.teacherId === currentTeacher.id ||
                notification.teacher_id === currentTeacher.teacherId ||
                notification.teacherEmail === currentTeacher.email ||
                notification.email === currentTeacher.email ||
                notification.targetRole === "teacher" ||
                notification.role === "teacher" ||
                teacherSubjectIds.includes(notification.subjectId) ||
                teacherGrades.includes(String(notification.grade || "").trim())
              );
            });

          setNotificationsCount(teacherNotifications.length);
        } catch (error) {
          console.error("Notifications error:", error);
          setNotificationsCount(0);
        }
      } catch (error) {
        console.error("Teacher dashboard error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const teacherName = getTeacherName(teacher);

  const infoCards = [
    {
      title: "Subjects",
      value: loading ? "..." : subjectsCount,
      icon: "menu_book",
      route: "/teacher-subjects",
    },
    {
      title: "Students",
      value: loading ? "..." : studentsCount,
      icon: "groups",
      route: "/teacher-students",
    },
    {
      title: "Attendance",
      value: loading ? "..." : attendanceCount,
      icon: "fact_check",
      route: "/teacher-attendance",
    },
    {
      title: "Notifications",
      value: loading ? "..." : notificationsCount,
      icon: "notifications",
      route: "/teacher-notifications",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            overflow: "hidden",
            mb: 4,
          }}
        >
          <MDBox
            px={4}
            py={4}
            sx={{
              background: "linear-gradient(135deg, #1f2937 0%, #334155 100%)",
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <MDTypography variant="h3" color="white" fontWeight="bold">
                  Welcome back, {teacherName}
                </MDTypography>
                <MDTypography variant="button" color="white" opacity={0.8}>
                  Manage your classes, review attendance, and follow up with students from one place.
                </MDTypography>
              </Grid>
            </Grid>
          </MDBox>
        </Card>

        <Grid container spacing={3} mb={4}>
          {infoCards.map((card, index) => (
            <Grid item xs={12} sm={6} xl={3} key={index}>
              <Card
                onClick={() => navigate(card.route)}
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                  cursor: "pointer",
                  transition: "0.25s",
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 28px rgba(15,23,42,0.14)",
                  },
                }}
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="flex-start">
                  <MDBox>
                    <MDTypography variant="button" color="text">
                      {card.title}
                    </MDTypography>
                    <MDTypography variant="h3" fontWeight="bold">
                      {card.value}
                    </MDTypography>
                  </MDBox>

                  <MDBox
                    sx={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    <Icon sx={{ color: "#111827" }}>{card.icon}</Icon>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Card
              sx={{
                p: 3,
                borderRadius: "18px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                height: "100%",
              }}
            >
              <MDBox mb={2}>
                <MDTypography variant="h5" fontWeight="bold">
                  Quick Actions
                </MDTypography>
              </MDBox>

              <Divider />

              <Grid container spacing={2} mt={0.5}>
                {[
                  ["menu_book", "Open Subjects", "Review assigned subjects and related content.", "/teacher-subjects", "Go to Subjects"],
                  ["groups", "View Students", "Check students and follow their data quickly.", "/teacher-students", "Open Students"],
                  ["fact_check", "Attendance", "Open attendance page and review latest records.", "/teacher-attendance", "Open Attendance"],
                  ["notifications", "Notifications", "Read recent updates and important alerts.", "/teacher-notifications", "Open Notifications"],
                ].map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        backgroundColor: "#f8fafc",
                        boxShadow: "none",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <MDBox display="flex" alignItems="center" gap={1.5} mb={1}>
                        <Icon sx={{ color: "#111827" }}>{item[0]}</Icon>
                        <MDTypography variant="h6">{item[1]}</MDTypography>
                      </MDBox>
                      <MDTypography variant="button" color="text">
                        {item[2]}
                      </MDTypography>
                      <MDBox mt={2}>
                        <MDButton
                          variant={index === 0 ? "gradient" : "outlined"}
                          color="dark"
                          size="small"
                          onClick={() => navigate(item[3])}
                        >
                          {item[4]}
                        </MDButton>
                      </MDBox>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default TeacherDashboard;