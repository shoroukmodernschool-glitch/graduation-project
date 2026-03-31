import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { db, auth } from "../../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import MDBox from "components/MDBox";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import ReportsBarChart from "../../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../../examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "../../../examples/Cards/StatisticsCards/ComplexStatisticsCard";

import reportsBarChartData from "../data/reportsBarChartData";
import reportsLineChartData from "../data/reportsLineChartData";

import Projects from "../components/Projects";
import OrdersOverview from "../components/OrdersOverview";

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { sales, tasks } = reportsLineChartData;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "student"),
          where("uid", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const currentStudent = data[0] || null;
        setStudent(currentStudent);

        // Subjects Count
        if (currentStudent?.grade) {
          const subjectQuery = query(
            collection(db, "subject"),
            where("grade", "==", currentStudent.grade)
          );

          const subjectSnapshot = await getDocs(subjectQuery);
          setSubjectsCount(subjectSnapshot.size);
        }

        // Attendance
        if (currentStudent?.id) {
          const attendanceQuery = query(
            collection(db, "attendance"),
            where("student_id", "==", currentStudent.id)
          );

          const attendanceSnapshot = await getDocs(attendanceQuery);
          const attendanceData = attendanceSnapshot.docs.map((doc) =>
            doc.data()
          );

          setAttendance(attendanceData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const presentCount = attendance.filter(
    (a) => a.status === "present"
  ).length;

  const attendancePercentage =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;

  return (
    <DashboardLayout>

      {/* ✅ Navbar بس */}
      <DashboardNavbar />

      <MDBox py={3}>
        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="school"
                title="Grades"
                count={loading ? "Loading..." : student?.grade ?? "No Data"}
                percentage={{
                  color: "success",
                  amount: "+10%",
                  label: "improved this month",
                }}
              />
            </MDBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <MDBox
              mb={1.5}
              onClick={() => navigate("/subjects")}
              sx={{ cursor: "pointer" }}
            >
              <ComplexStatisticsCard
                color="info"
                icon="menu_book"
                title="Subjects"
                count={loading ? "..." : subjectsCount}
                percentage={{
                  color: "info",
                  amount: "Active",
                  label: "subjects",
                }}
              />
            </MDBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="check_circle"
                title="Attendance"
                count={
                  loading
                    ? "Loading..."
                    : attendance.length > 0
                    ? attendancePercentage + "%"
                    : "No Data"
                }
                percentage={{
                  color: "success",
                  amount: `${presentCount}/${attendance.length}`,
                  label: "days present",
                }}
              />
            </MDBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="assignment"
                title="Assignments"
                count={
                  loading
                    ? "Loading..."
                    : student?.assignments ?? "No Data"
                }
                percentage={{
                  color: "warning",
                  amount: "2 pending",
                  label: "tasks",
                }}
              />
            </MDBox>
          </Grid>

        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Attendance Overview"
                  description="Weekly attendance performance"
                  date="updated recently"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Grades Progress"
                  description="Student performance over time"
                  date="updated 2 days ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Tasks Completion"
                  description="Assignments completion rate"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>

          </Grid>
        </MDBox>

        <MDBox>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6, lg: 8 }}>
              <Projects />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>

      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;