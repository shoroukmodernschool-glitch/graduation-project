import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { useEffect, useMemo, useState } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

function Attendance() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const teacherSubject = "Mathematics";
  const grades = ["All Grades", "Grade 5", "Grade 6"];

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);

      try {
        const studentsSnapshot = await getDocs(collection(db, "student"));

        const attendanceQuery = query(
          collection(db, "attendance"),
          where("date", "==", selectedDate)
        );

        const attendanceSnapshot = await getDocs(attendanceQuery);
        const attendanceMap = new Map();

        attendanceSnapshot.forEach((doc) => {
          const data = doc.data();
          attendanceMap.set(String(data.studentId), data);
        });

        const students = studentsSnapshot.docs.map((doc) => {
          const data = doc.data();

          const studentId = String(data.student_id || doc.id);
          const firstName = data.firstName || "";
          const lastName = data.lastName || "";
          const name = `${firstName} ${lastName}`.trim() || "Unknown Student";

          const gradeValue = data.grade ? `Grade ${data.grade}` : "Unknown Grade";
          const className = data.className || data.section || "-";
          const attendanceRecord = attendanceMap.get(studentId);

          return {
            id: studentId,
            name,
            grade: gradeValue,
            className,
            status: attendanceRecord ? "Present" : "Absent",
          };
        });

        setAttendanceData(students);
      } catch (error) {
        console.error("Error loading attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedDate]);

  const filteredStudents = useMemo(() => {
    return attendanceData.filter((student) => {
      const matchGrade =
        selectedGrade === "All Grades" || student.grade === selectedGrade;

      const matchSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.className.toLowerCase().includes(search.toLowerCase()) ||
        student.grade.toLowerCase().includes(search.toLowerCase());

      return matchGrade && matchSearch;
    });
  }, [attendanceData, selectedGrade, search]);

  const presentCount = filteredStudents.filter((s) => s.status === "Present").length;
  const absentCount = filteredStudents.filter((s) => s.status === "Absent").length;
  const lateCount = filteredStudents.filter((s) => s.status === "Late").length;

  const getStatusChip = (status) => {
    if (status === "Present") {
      return <Chip label="Present" color="success" size="small" />;
    }
    if (status === "Absent") {
      return <Chip label="Absent" color="error" size="small" />;
    }
    return <Chip label="Late" color="warning" size="small" />;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <Card sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", mb: 4 }}>
          <MDBox px={4} py={4} sx={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
            <MDTypography variant="h3" color="white" fontWeight="bold">
              Attendance
            </MDTypography>

            <MDTypography variant="button" color="white" opacity={0.8}>
              Review and manage attendance records for {teacherSubject}.
            </MDTypography>
          </MDBox>
        </Card>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, borderRadius: "18px", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}>
              <MDTypography variant="button" color="text">Present</MDTypography>
              <MDTypography variant="h3" fontWeight="bold">{presentCount}</MDTypography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, borderRadius: "18px", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}>
              <MDTypography variant="button" color="text">Absent</MDTypography>
              <MDTypography variant="h3" fontWeight="bold">{absentCount}</MDTypography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, borderRadius: "18px", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}>
              <MDTypography variant="button" color="text">Late</MDTypography>
              <MDTypography variant="h3" fontWeight="bold">{lateCount}</MDTypography>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ p: 3, borderRadius: "18px", boxShadow: "0 8px 24px rgba(15,23,42,0.08)", mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <MDInput
                fullWidth
                label="Search by student name, class, or grade"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <Select
                  value={selectedGrade}
                  label="Grade"
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  sx={{ minHeight: "45px" }}
                >
                  {grades.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <MDInput
                fullWidth
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ p: 3, borderRadius: "18px", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}>
          <MDBox mb={2}>
            <MDTypography variant="h5" fontWeight="bold">
              Attendance List
            </MDTypography>
            <MDTypography variant="button" color="text">
              {selectedDate} - {selectedGrade}
            </MDTypography>
          </MDBox>

          <Divider />

          <MDBox mt={2}>
            {loading ? (
              <MDBox py={5} textAlign="center">
                <MDTypography variant="h6">Loading attendance...</MDTypography>
              </MDBox>
            ) : filteredStudents.length === 0 ? (
              <MDBox py={5} textAlign="center">
                <Icon sx={{ color: "#111827", fontSize: "32px" }}>fact_check</Icon>
                <MDTypography variant="h5" fontWeight="bold">
                  No attendance records found
                </MDTypography>
              </MDBox>
            ) : (
              <Grid container spacing={2}>
                {filteredStudents.map((student) => (
                  <Grid item xs={12} key={student.id}>
                    <Card sx={{ p: 2, borderRadius: "16px", boxShadow: "none", border: "1px solid #e5e7eb" }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                          <MDBox display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ width: 52, height: 52, bgcolor: "#111827", fontWeight: "bold" }}>
                              {student.name.charAt(0)}
                            </Avatar>

                            <MDBox>
                              <MDTypography variant="h6" fontWeight="bold">
                                {student.name}
                              </MDTypography>
                              <MDTypography variant="button" color="text">
                                {student.grade} - {student.className}
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <MDBox
                            display="flex"
                            flexDirection="column"
                            alignItems={{ xs: "flex-start", md: "flex-end" }}
                          >
                            <MDTypography variant="button" color="text">
                              Status
                            </MDTypography>
                            <MDBox mt={0.5}>{getStatusChip(student.status)}</MDBox>
                          </MDBox>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </MDBox>
        </Card>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Attendance;