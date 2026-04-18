import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

function Tables() {
  const columns = [
    { Header: "day", accessor: "day", width: "20%", align: "left" },
    { Header: "1st Period", accessor: "first", align: "center" },
    { Header: "2nd Period", accessor: "second", align: "center" },
    { Header: "3rd Period", accessor: "third", align: "center" },
    { Header: "4th Period", accessor: "fourth", align: "center" },
  ];

  const rows = [
    {
      day: "Sunday",
      first: "Math",
      second: "English",
      third: "Science",
      fourth: "Arabic",
    },
    {
      day: "Monday",
      first: "Science",
      second: "Math",
      third: "English",
      fourth: "Computer",
    },
    {
      day: "Tuesday",
      first: "Arabic",
      second: "Social Studies",
      third: "Math",
      fourth: "English",
    },
    {
      day: "Wednesday",
      first: "English",
      second: "Computer",
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
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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