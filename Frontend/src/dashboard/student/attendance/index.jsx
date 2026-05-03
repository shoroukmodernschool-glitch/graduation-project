import { useEffect, useMemo, useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import AIAttendance from "components/AI_Attendance/AI_Attendance";

import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

function Attendance() {
  const [studentData, setStudentData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const todayDateNumber = today.getDate();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getStudentData = async (user) => {
    const directDocRef = doc(db, "student", user.uid);
    const directDocSnap = await getDoc(directDocRef);

    if (directDocSnap.exists()) {
      return {
        id: directDocSnap.id,
        ...directDocSnap.data(),
      };
    }

    const q = query(collection(db, "student"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const studentDoc = querySnapshot.docs[0];
      return {
        id: studentDoc.id,
        ...studentDoc.data(),
      };
    }

    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const currentStudent = await getStudentData(user);
        setStudentData(currentStudent);

        if (!currentStudent) {
          setAttendanceData([]);
          return;
        }

        const studentCode = String(
          currentStudent.student_id || currentStudent.studentId || currentStudent.id || ""
        ).trim();

        if (!studentCode) {
          setAttendanceData([]);
          return;
        }

        const attendanceQuery = query(
          collection(db, "attendance"),
          where("studentId", "==", studentCode)
        );

        const attendanceSnapshot = await getDocs(attendanceQuery);
        const records = attendanceSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setAttendanceData(records);
      } catch (error) {
        console.error("Attendance page error:", error);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const attendanceMap = useMemo(() => {
    const map = {};

    attendanceData.forEach((item) => {
      if (item.date) {
        map[item.date] = item;
      }
    });

    return map;
  }, [attendanceData]);

  const monthlyAttendance = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const result = [];

    for (let day = 1; day <= daysInMonth; day += 1) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const dateString = formatDate(currentDate);
      const record = attendanceMap[dateString];
      const isFutureDay = day > todayDateNumber;

      if (isFutureDay) {
        result.push({
          day,
          status: "-",
          label: "Upcoming",
          color: "secondary",
          counted: false,
        });
        continue;
      }

      if (record) {
        const rawStatus = String(record.status || "").toLowerCase();

        if (rawStatus === "present") {
          result.push({
            day,
            status: "P",
            label: "Present",
            color: "success",
            counted: true,
            present: true,
          });
        } else if (rawStatus === "late") {
          result.push({
            day,
            status: "L",
            label: "Late",
            color: "warning",
            counted: true,
            present: false,
          });
        } else if (rawStatus === "absent") {
          result.push({
            day,
            status: "A",
            label: "Absent",
            color: "error",
            counted: true,
            present: false,
          });
        } else {
          result.push({
            day,
            status: "?",
            label: "Recorded",
            color: "info",
            counted: true,
            present: false,
          });
        }
      } else {
        result.push({
          day,
          status: "-",
          label: "No Record",
          color: "light",
          counted: false,
        });
      }
    }

    return result;
  }, [attendanceMap, currentMonth, currentYear, todayDateNumber]);

  const summaryData = useMemo(() => {
    const recordedDays = monthlyAttendance.filter((item) => item.counted);
    const totalRecordedDays = recordedDays.length;
    const presentDays = recordedDays.filter((item) => item.status === "P").length;
    const lateDays = recordedDays.filter((item) => item.status === "L").length;
    const absentDays = recordedDays.filter((item) => item.status === "A").length;

    const attendanceRate =
      totalRecordedDays > 0 ? Math.round((presentDays / totalRecordedDays) * 100) : 0;

    return {
      totalRecordedDays,
      presentDays,
      lateDays,
      absentDays,
      attendanceRate,
    };
  }, [monthlyAttendance]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <Card
          sx={{
            borderRadius: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            background: "linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%)",
            mb: 3,
            width: "95%",
            margin: "0 auto",
          }}
        >
          <MDBox p={{ xs: 2.5, md: 4 }}>
            <MDTypography variant="h3" fontWeight="bold">
              Attendance Center
            </MDTypography>

            <MDTypography variant="button" color="text" mt={1} mb={3} display="block">
              Track and manage attendance in a simple full-page view.
            </MDTypography>

            {loading ? (
              <MDBox display="flex" justifyContent="center" py={3}>
                <CircularProgress />
              </MDBox>
            ) : (
              <MDBox display="flex" gap={2} flexWrap="wrap">
                <MDBox px={2} py={1} borderRadius="lg" sx={{ background: "#fff" }}>
                  Recorded Days: {summaryData.totalRecordedDays}
                </MDBox>

                <MDBox px={2} py={1} borderRadius="lg" sx={{ background: "#fff" }}>
                  Present: {summaryData.presentDays}
                </MDBox>

                <MDBox px={2} py={1} borderRadius="lg" sx={{ background: "#fff" }}>
                  Late: {summaryData.lateDays}
                </MDBox>

                <MDBox px={2} py={1} borderRadius="lg" sx={{ background: "#fff" }}>
                  Absent: {summaryData.absentDays}
                </MDBox>

                <MDBox px={2} py={1} borderRadius="lg" sx={{ background: "#fff" }}>
                  Attendance Rate: {summaryData.attendanceRate}%
                </MDBox>
              </MDBox>
            )}
          </MDBox>
        </Card>

        <Grid container>
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: "24px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                overflow: "hidden",
                width: "95%",
                margin: "0 auto",
                mt: 4,
              }}
            >
              <MDBox
                px={3}
                py={2.5}
                sx={{
                  borderBottom: "1px solid #edf2f7",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <MDBox>
                  <MDTypography variant="h5" fontWeight="bold">
                    Monthly Attendance
                  </MDTypography>

                  <MDTypography variant="button" color="text">
                    Full attendance view for the current month
                  </MDTypography>
                </MDBox>

                <button
                  type="button"
                  onClick={() => setAiOpen(true)}
                  style={{
                    border: "none",
                    background: "#061b9b",
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                  }}
                >
                  🤖 AI Attendance
                </button>
              </MDBox>

              <MDBox px={2} py={3}>
                {loading ? (
                  <MDBox display="flex" justifyContent="center" py={5}>
                    <CircularProgress />
                  </MDBox>
                ) : (
                  <MDBox
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        md: "repeat(5, 1fr)",
                        lg: "repeat(7, 1fr)",
                        xl: "repeat(9, 1fr)",
                      },
                      gap: 2,
                    }}
                  >
                    {monthlyAttendance.map((item, index) => (
                      <MDBox
                        key={index}
                        p={2}
                        borderRadius="2xl"
                        sx={{
                          background: "#f9fbfd",
                          border: "1px solid #edf2f7",
                          minHeight: "120px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          opacity: item.label === "Upcoming" ? 0.6 : 1,
                        }}
                      >
                        <MDTypography fontWeight="medium">Day {item.day}</MDTypography>

                        <MDBox
                          width="50px"
                          height="50px"
                          borderRadius="50%"
                          bgColor={item.color}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            border: item.status === "-" ? "1px solid #dbe3ec" : "none",
                          }}
                        >
                          <MDTypography
                            color={item.status === "-" ? "dark" : "white"}
                            fontWeight="bold"
                          >
                            {item.status}
                          </MDTypography>
                        </MDBox>

                        <MDTypography variant="caption" textAlign="center">
                          {item.label}
                        </MDTypography>
                      </MDBox>
                    ))}
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <AIAttendance open={aiOpen} onClose={() => setAiOpen(false)} />

      <Footer />
    </DashboardLayout>
  );
}

export default Attendance;