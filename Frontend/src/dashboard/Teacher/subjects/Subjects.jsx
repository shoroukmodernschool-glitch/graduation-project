import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import { useState } from "react";

import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

function Subjects() {
  const [selectedGrade, setSelectedGrade] = useState("Grade 5");

  const teacherSubject = "Mathematics";
  const grades = ["Grade 5", "Grade 6"];

  const contentCards = [
    {
      title: "Videos",
      icon: "smart_display",
      count: 0,
      description: "Upload and manage lesson videos for students.",
    },
    {
      title: "PDF Files",
      icon: "picture_as_pdf",
      count: 0,
      description: "Add worksheets, notes, and explanation files.",
    },
    {
      title: "Exams",
      icon: "quiz",
      count: 0,
      description: "Create and organize quizzes and exams.",
    },
    {
      title: "Assignments",
      icon: "assignment",
      count: 0,
      description: "Upload homework and track required tasks.",
    },
  ];

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
              {teacherSubject}
            </MDTypography>

            <MDTypography variant="button" color="white" opacity={0.8}>
              Manage your subject content, lessons, files, exams, and assignments from one place.
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
          <MDBox mb={2}>
            <MDTypography variant="h5" fontWeight="bold">
              Available Grades
            </MDTypography>
            <MDTypography variant="button" color="text">
              Choose the grade you want to manage for this subject.
            </MDTypography>
          </MDBox>

          <Divider />

          <MDBox
            mt={2}
            display="flex"
            flexWrap="wrap"
            gap={1.5}
          >
            {grades.map((grade) => (
              <MDButton
                key={grade}
                variant={selectedGrade === grade ? "gradient" : "outlined"}
                color="dark"
                onClick={() => setSelectedGrade(grade)}
                sx={{
                  borderRadius: "12px",
                }}
              >
                {grade}
              </MDButton>
            ))}
          </MDBox>
        </Card>

        <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="bold">
            {selectedGrade} Content
          </MDTypography>
          <MDTypography variant="button" color="text">
            Choose the section you want to manage.
          </MDTypography>
        </MDBox>

        <Grid container spacing={3}>
          {contentCards.map((item, index) => (
            <Grid item xs={12} md={6} xl={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: "18px",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                  height: "100%",
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 28px rgba(15,23,42,0.14)",
                  },
                }}
              >
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <MDBox
                    sx={{
                      width: "54px",
                      height: "54px",
                      borderRadius: "14px",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    <Icon sx={{ color: "#111827" }}>{item.icon}</Icon>
                  </MDBox>

                  <MDTypography variant="h4" fontWeight="bold">
                    {item.count}
                  </MDTypography>
                </MDBox>

                <MDTypography variant="h6" fontWeight="bold" mb={1}>
                  {item.title}
                </MDTypography>

                <MDTypography variant="button" color="text">
                  {item.description}
                </MDTypography>

                <MDBox mt={3} display="flex" gap={1}>
                  <MDButton
                    variant="gradient"
                    color="dark"
                    size="small"
                    fullWidth
                  >
                    View
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="dark"
                    size="small"
                    fullWidth
                  >
                    Upload
                  </MDButton>
                </MDBox>
              </Card>
            </Grid>
          ))}
        </Grid>

        <MDBox mt={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: "18px",
              boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            }}
          >
            <MDTypography variant="h5" fontWeight="bold" mb={1}>
              Current Selection
            </MDTypography>

            <MDTypography variant="button" color="text">
              You are currently managing:
            </MDTypography>

            <MDBox mt={2}>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1.5}
              >
                <MDTypography variant="button" color="text">
                  Subject
                </MDTypography>
                <MDTypography variant="button" fontWeight="bold">
                  {teacherSubject}
                </MDTypography>
              </MDBox>

              <Divider />

              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1.5}
              >
                <MDTypography variant="button" color="text">
                  Grade
                </MDTypography>
                <MDTypography variant="button" fontWeight="bold">
                  {selectedGrade}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Subjects;