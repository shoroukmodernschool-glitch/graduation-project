/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Attendance() {
  const attendanceData = [
    {
      subject: "English",
      attended: 18,
      absent: 2,
      percentage: 90,
      color: "info",
    },
    {
      subject: "Math",
      attended: 15,
      absent: 5,
      percentage: 75,
      color: "success",
    },
    {
      subject: "Science",
      attended: 17,
      absent: 3,
      percentage: 85,
      color: "error",
    },
    {
      subject: "Arabic",
      attended: 16,
      absent: 4,
      percentage: 80,
      color: "dark",
    },
    {
      subject: "Social Studies",
      attended: 14,
      absent: 6,
      percentage: 70,
      color: "warning",
    },
    {
      subject: "Computer",
      attended: 19,
      absent: 1,
      percentage: 95,
      color: "secondary",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <MDBox py={3}>
        <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="bold" color="info">
            Attendance Overview
          </MDTypography>
          <MDTypography variant="button" color="text">
            Check attendance and absence percentage for each subject
          </MDTypography>
        </MDBox>

        <Grid container spacing={3}>
          {attendanceData.map((item, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card>
                <MDBox p={3}>
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <MDTypography variant="h5" fontWeight="bold">
                      {item.subject}
                    </MDTypography>

                    <MDBox
                      px={1.5}
                      py={0.5}
                      borderRadius="lg"
                      bgColor={item.color}
                      coloredShadow={item.color}
                    >
                      <MDTypography variant="button" color="white" fontWeight="bold">
                        {item.percentage}%
                      </MDTypography>
                    </MDBox>
                  </MDBox>

                  <MDBox mb={1}>
                    <MDTypography variant="button" color="text">
                      Attended: <strong>{item.attended}</strong> days
                    </MDTypography>
                  </MDBox>

                  <MDBox mb={2}>
                    <MDTypography variant="button" color="text">
                      Absent: <strong>{item.absent}</strong> days
                    </MDTypography>
                  </MDBox>

                  <MDBox mb={1}>
                    <MDTypography variant="button" color="text">
                      Attendance Rate
                    </MDTypography>
                  </MDBox>

                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    color={item.color}
                    sx={{ height: "10px", borderRadius: "10px" }}
                  />
                </MDBox>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Attendance;