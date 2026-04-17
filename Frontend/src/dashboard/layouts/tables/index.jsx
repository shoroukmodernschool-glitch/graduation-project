/**
=========================================================
* Material Dashboard 2 React - Class Page
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Tables() {
  const columns = [
    { Header: "day", accessor: "day", align: "left" },
    { Header: "1st period", accessor: "first", align: "center" },
    { Header: "2nd period", accessor: "second", align: "center" },
    { Header: "3rd period", accessor: "third", align: "center" },
    { Header: "4th period", accessor: "fourth", align: "center" },
  ];

  const rows = [
    {
      day: "Sunday",
      first: "English",
      second: "Math",
      third: "Science",
      fourth: "Arabic",
    },
    {
      day: "Monday",
      first: "Math",
      second: "Computer",
      third: "English",
      fourth: "Social Studies",
    },
    {
      day: "Tuesday",
      first: "Science",
      second: "Arabic",
      third: "Math",
      fourth: "English",
    },
    {
      day: "Wednesday",
      first: "Computer",
      second: "Science",
      third: "Arabic",
      fourth: "Math",
    },
    {
      day: "Thursday",
      first: "English",
      second: "Social Studies",
      third: "Math",
      fourth: "Activity",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={10} pb={3} px={2}>
        <Grid container spacing={3}>
          {/* Top Cards */}
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card sx={{ height: "100%" }}>
              <MDBox p={2.5}>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Class Name
                </MDTypography>
                <MDTypography variant="h4" fontWeight="bold">
                  Class A
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card sx={{ height: "100%" }}>
              <MDBox p={2.5}>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Grade
                </MDTypography>
                <MDTypography variant="h4" fontWeight="bold">
                  Grade 10
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card sx={{ height: "100%" }}>
              <MDBox p={2.5}>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Class Teacher
                </MDTypography>
                <MDTypography variant="h4" fontWeight="bold">
                  Mr. Ahmed
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card sx={{ height: "100%" }}>
              <MDBox p={2.5}>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Students Count
                </MDTypography>
                <MDTypography variant="h4" fontWeight="bold">
                  32
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>

          {/* Class Info */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <MDBox
                mx={2}
                mt={2}
                py={2}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Class Information
                </MDTypography>
              </MDBox>

              <MDBox p={4}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <MDTypography variant="button" color="text">
                      Room Number
                    </MDTypography>
                    <MDTypography variant="h6" fontWeight="medium">
                      Room 204
                    </MDTypography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <MDTypography variant="button" color="text">
                      Academic Year
                    </MDTypography>
                    <MDTypography variant="h6" fontWeight="medium">
                      2025 / 2026
                    </MDTypography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <MDTypography variant="button" color="text">
                      Supervisor
                    </MDTypography>
                    <MDTypography variant="h6" fontWeight="medium">
                      Mrs. Mona Ali
                    </MDTypography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <MDTypography variant="button" color="text">
                      Class Code
                    </MDTypography>
                    <MDTypography variant="h6" fontWeight="medium">
                      10-A
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>

          {/* Weekly Schedule */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <MDBox
                mx={2}
                mt={2}
                py={2}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
              >
                <MDTypography variant="h6" color="white">
                  Weekly Class Schedule
                </MDTypography>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Tables;