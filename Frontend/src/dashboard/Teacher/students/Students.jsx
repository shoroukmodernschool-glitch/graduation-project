import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Avatar from "@mui/material/Avatar";
import { useMemo, useState } from "react";

import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

function Students() {
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [search, setSearch] = useState("");

  const teacherSubject = "Mathematics";

  const grades = ["All Grades", "Grade 5", "Grade 6"];

  const studentsData = [
    {
      id: 1,
      name: "Ahmed Mohamed",
      grade: "Grade 5",
      className: "5A",
      email: "ahmed@example.com",
      attendance: "92%",
    },
    {
      id: 2,
      name: "Salma Ali",
      grade: "Grade 5",
      className: "5B",
      email: "salma@example.com",
      attendance: "88%",
    },
    {
      id: 3,
      name: "Omar Hassan",
      grade: "Grade 6",
      className: "6A",
      email: "omar@example.com",
      attendance: "95%",
    },
    {
      id: 4,
      name: "Mariam Tarek",
      grade: "Grade 6",
      className: "6B",
      email: "mariam@example.com",
      attendance: "90%",
    },
  ];

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) => {
      const matchGrade =
        selectedGrade === "All Grades" || student.grade === selectedGrade;

      const matchSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.className.toLowerCase().includes(search.toLowerCase()) ||
        student.grade.toLowerCase().includes(search.toLowerCase());

      return matchGrade && matchSearch;
    });
  }, [selectedGrade, search]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <Card
          sx={{
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            mb: 4,
          }}
        >
          <MDBox
            px={4}
            py={4}
            sx={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            }}
          >
            <MDTypography variant="h3" color="white" fontWeight="bold">
              Students
            </MDTypography>

            <MDTypography variant="button" color="white" opacity={0.8}>
              Manage students for {teacherSubject} and review their class details.
            </MDTypography>
          </MDBox>
        </Card>

        <Card
          sx={{
            p: 3,
            borderRadius: "18px",
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            mb: 4,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={7}>
              <MDInput
                fullWidth
                label="Search by student name, class, or grade"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={5}>
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
          </Grid>

          <MDBox mt={2}>
            <MDTypography variant="button" color="text">
              Showing {filteredStudents.length} student(s)
            </MDTypography>
          </MDBox>
        </Card>

        <Grid container spacing={3}>
          {filteredStudents.map((student) => (
            <Grid item xs={12} md={6} xl={4} key={student.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: "18px",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                  height: "100%",
                }}
              >
                <MDBox display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: "#111827",
                      fontWeight: "bold",
                    }}
                  >
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

                <Divider />

                <MDBox mt={2}>
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    py={1}
                  >
                    <MDTypography variant="button" color="text">
                      Subject
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="bold">
                      {teacherSubject}
                    </MDTypography>
                  </MDBox>

                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    py={1}
                  >
                    <MDTypography variant="button" color="text">
                      Email
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="bold">
                      {student.email}
                    </MDTypography>
                  </MDBox>

                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    py={1}
                  >
                    <MDTypography variant="button" color="text">
                      Attendance
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="bold">
                      {student.attendance}
                    </MDTypography>
                  </MDBox>
                </MDBox>

                <MDBox mt={3} display="flex" gap={1}>
                  <MDButton
                    variant="gradient"
                    color="dark"
                    size="small"
                    fullWidth
                    startIcon={<Icon>visibility</Icon>}
                  >
                    View
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="dark"
                    size="small"
                    fullWidth
                    startIcon={<Icon>assignment</Icon>}
                  >
                    Progress
                  </MDButton>
                </MDBox>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredStudents.length === 0 && (
          <Card
            sx={{
              p: 4,
              borderRadius: "18px",
              boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              mt: 3,
              textAlign: "center",
            }}
          >
            <MDBox
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: "#f3f4f6",
                display: "grid",
                placeItems: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <Icon sx={{ color: "#111827", fontSize: "32px" }}>groups</Icon>
            </MDBox>

            <MDTypography variant="h5" fontWeight="bold">
              No students found
            </MDTypography>
            <MDTypography variant="button" color="text">
              Try changing the search text or selected grade.
            </MDTypography>
          </Card>
        )}
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Students;