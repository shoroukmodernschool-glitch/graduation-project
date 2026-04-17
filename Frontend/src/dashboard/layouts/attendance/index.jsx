/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

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

        <MDBox
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(260px, 1fr))"
          gap={3}
        >
          {attendanceData.map((item, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                minHeight: "245px",
                borderRadius: "16px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              }}
            >
              <MDBox p={3} height="100%" display="flex" flexDirection="column">
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={3}
                  gap={1}
                >
                  <MDTypography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      fontSize: "1.8rem",
                      lineHeight: 1.2,
                      flex: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.subject}
                  </MDTypography>

                  <MDBox
                    px={1.8}
                    py={0.8}
                    borderRadius="lg"
                    bgColor={item.color}
                    coloredShadow={item.color}
                    sx={{
                      minWidth: "54px",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MDTypography
                      variant="button"
                      color="white"
                      fontWeight="bold"
                      sx={{ fontSize: "0.95rem" }}
                    >
                      {item.percentage}%
                    </MDTypography>
                  </MDBox>
                </MDBox>

                <MDBox mb={1.5}>
                  <MDTypography variant="button" color="text" sx={{ fontSize: "1rem" }}>
                    Attended: <strong>{item.attended}</strong> days
                  </MDTypography>
                </MDBox>

                <MDBox mb={2.5}>
                  <MDTypography variant="button" color="text" sx={{ fontSize: "1rem" }}>
                    Absent: <strong>{item.absent}</strong> days
                  </MDTypography>
                </MDBox>

                <MDBox mt="auto">
                  <MDBox mb={1}>
                    <MDTypography variant="button" color="text" sx={{ fontSize: "1rem" }}>
                      Attendance Rate
                    </MDTypography>
                  </MDBox>

                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    color={item.color}
                    sx={{
                      height: "10px",
                      borderRadius: "10px",
                    }}
                  />
                </MDBox>
              </MDBox>
            </Card>
          ))}
        </MDBox>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Attendance;