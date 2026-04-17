import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Assignments() {
  const assignments = [
    {
      subject: "English",
      title: "Write an essay about school life",
      dueDate: "20 Apr 2026",
      status: "Pending",
    },
    {
      subject: "Math",
      title: "Solve exercises 1 to 10",
      dueDate: "18 Apr 2026",
      status: "Submitted",
    },
    {
      subject: "Science",
      title: "Prepare the lab report",
      dueDate: "22 Apr 2026",
      status: "Pending",
    },
    {
      subject: "Arabic",
      title: "Read and summarize chapter 3",
      dueDate: "19 Apr 2026",
      status: "Submitted",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="bold" color="info">
            Assignments
          </MDTypography>
          <MDTypography variant="button" color="text">
            Check your homework and submission status
          </MDTypography>
        </MDBox>

        <MDBox
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
          gap={3}
        >
          {assignments.map((item, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                minHeight: "215px",
                borderRadius: "16px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              }}
            >
              <MDBox p={3} height="100%" display="flex" flexDirection="column">
                <MDTypography
                  variant="h4"
                  fontWeight="bold"
                  mb={3}
                  sx={{
                    fontSize: "1.8rem",
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {item.subject}
                </MDTypography>

                <MDTypography
                  variant="button"
                  display="block"
                  mb={1.5}
                  sx={{ fontSize: "1rem", lineHeight: 1.8 }}
                >
                  <strong>Task:</strong> {item.title}
                </MDTypography>

                <MDTypography
                  variant="button"
                  display="block"
                  mb={3}
                  sx={{ fontSize: "1rem", lineHeight: 1.8 }}
                >
                  <strong>Due Date:</strong> {item.dueDate}
                </MDTypography>

                <MDBox mt="auto">
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    color={item.status === "Submitted" ? "success" : "warning"}
                    sx={{ fontSize: "1rem" }}
                  >
                    {item.status}
                  </MDTypography>
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

export default Assignments;