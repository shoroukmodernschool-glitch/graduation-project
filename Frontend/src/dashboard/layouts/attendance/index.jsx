import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Attendance() {
  const summaryData = {
    totalSchoolDays: 30,
    attendanceRate: 83,
  };

  const monthlyAttendance = [
    { day: 1, status: "P", color: "success" },
    { day: 2, status: "P", color: "success" },
    { day: 3, status: "A", color: "error" },
    { day: 4, status: "P", color: "success" },
    { day: 5, status: "P", color: "success" },
    { day: 6, status: "L", color: "warning" },
    { day: 7, status: "P", color: "success" },
    { day: 8, status: "P", color: "success" },
    { day: 9, status: "P", color: "success" },
    { day: 10, status: "A", color: "error" },
    { day: 11, status: "P", color: "success" },
    { day: 12, status: "P", color: "success" },
    { day: 13, status: "L", color: "warning" },
    { day: 14, status: "P", color: "success" },
    { day: 15, status: "P", color: "success" },
    { day: 16, status: "P", color: "success" },
    { day: 17, status: "P", color: "success" },
    { day: 18, status: "A", color: "error" },
    { day: 19, status: "P", color: "success" },
    { day: 20, status: "P", color: "success" },
    { day: 21, status: "P", color: "success" },
    { day: 22, status: "P", color: "success" },
    { day: 23, status: "A", color: "error" },
    { day: 24, status: "P", color: "success" },
    { day: 25, status: "P", color: "success" },
    { day: 26, status: "P", color: "success" },
    { day: 27, status: "L", color: "warning" },
    { day: 28, status: "P", color: "success" },
    { day: 29, status: "P", color: "success" },
    { day: 30, status: "P", color: "success" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        {/* Attendance Center */}
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

            <MDBox display="flex" gap={2}>
              <MDBox px={2} py={1} borderRadius="lg" sx={{ background: "#fff" }}>
                Total Days: {summaryData.totalSchoolDays}
              </MDBox>

              <MDBox px={2} py={1} borderRadius="lg" sx={{ background: "#fff" }}>
                Attendance Rate: {summaryData.attendanceRate}%
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>

        {/* Monthly Attendance */}
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
              <MDBox px={3} py={2.5} sx={{ borderBottom: "1px solid #edf2f7" }}>
                <MDTypography variant="h5" fontWeight="bold">
                  Monthly Attendance
                </MDTypography>

                <MDTypography variant="button" color="text">
                  Full attendance view for the whole month
                </MDTypography>
              </MDBox>

              <MDBox px={2} py={3}>
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
                      }}
                    >
                      <MDTypography>Day {item.day}</MDTypography>

                      <MDBox
                        width="50px"
                        height="50px"
                        borderRadius="50%"
                        bgColor={item.color}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <MDTypography color="white">
                          {item.status}
                        </MDTypography>
                      </MDBox>

                      <MDTypography variant="caption">
                        {item.status === "P"
                          ? "Present"
                          : item.status === "A"
                          ? "Absent"
                          : "Late"}
                      </MDTypography>
                    </MDBox>
                  ))}
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Attendance;