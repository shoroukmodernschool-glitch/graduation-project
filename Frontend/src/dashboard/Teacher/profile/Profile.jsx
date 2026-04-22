import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

function Profile() {
  const teacherData = {
    name: "Mr. Ahmed Hassan",
    email: "ahmed.hassan@school.com",
    phone: "+20 100 123 4567",
    subject: "Mathematics",
    grades: ["Grade 5", "Grade 6"],
    role: "Teacher",
    school: "Shorouq Smart School",
    bio: "Passionate mathematics teacher focused on helping students understand concepts in a simple and practical way.",
  };

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
              Teacher Profile
            </MDTypography>

            <MDTypography variant="button" color="white" opacity={0.8}>
              View and manage your personal and teaching information.
            </MDTypography>
          </MDBox>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: "18px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                textAlign: "center",
                height: "100%",
              }}
            >
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "#111827",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                {teacherData.name.charAt(0)}
              </Avatar>

              <MDTypography variant="h4" fontWeight="bold">
                {teacherData.name}
              </MDTypography>

              <MDTypography variant="button" color="text">
                {teacherData.role}
              </MDTypography>

              <MDBox mt={2}>
                <MDButton variant="gradient" color="dark" size="small">
                  Edit Profile
                </MDButton>
              </MDBox>

              <Divider sx={{ my: 3 }} />

              <MDBox textAlign="left">
                <MDBox display="flex" alignItems="center" gap={1.2} mb={1.5}>
                  <Icon sx={{ color: "#111827" }}>menu_book</Icon>
                  <MDTypography variant="button" color="text">
                    {teacherData.subject}
                  </MDTypography>
                </MDBox>

                <MDBox display="flex" alignItems="center" gap={1.2} mb={1.5}>
                  <Icon sx={{ color: "#111827" }}>school</Icon>
                  <MDTypography variant="button" color="text">
                    {teacherData.school}
                  </MDTypography>
                </MDBox>

                <MDBox display="flex" alignItems="center" gap={1.2}>
                  <Icon sx={{ color: "#111827" }}>email</Icon>
                  <MDTypography variant="button" color="text">
                    {teacherData.email}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                p: 3,
                borderRadius: "18px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                mb: 3,
              }}
            >
              <MDTypography variant="h5" fontWeight="bold" mb={2}>
                Personal Information
              </MDTypography>

              <Divider />

              <MDBox mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDBox py={1}>
                      <MDTypography variant="button" color="text">
                        Full Name
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="bold">
                        {teacherData.name}
                      </MDTypography>
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MDBox py={1}>
                      <MDTypography variant="button" color="text">
                        Role
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="bold">
                        {teacherData.role}
                      </MDTypography>
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MDBox py={1}>
                      <MDTypography variant="button" color="text">
                        Email Address
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="bold">
                        {teacherData.email}
                      </MDTypography>
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MDBox py={1}>
                      <MDTypography variant="button" color="text">
                        Phone Number
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="bold">
                        {teacherData.phone}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>

            <Card
              sx={{
                p: 3,
                borderRadius: "18px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                mb: 3,
              }}
            >
              <MDTypography variant="h5" fontWeight="bold" mb={2}>
                Teaching Information
              </MDTypography>

              <Divider />

              <MDBox mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDBox py={1}>
                      <MDTypography variant="button" color="text">
                        Subject
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="bold">
                        {teacherData.subject}
                      </MDTypography>
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MDBox py={1}>
                      <MDTypography variant="button" color="text">
                        Assigned Grades
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="bold">
                        {teacherData.grades.join(", ")}
                      </MDTypography>
                    </MDBox>
                  </Grid>

                  <Grid item xs={12}>
                    <MDBox py={1}>
                      <MDTypography variant="button" color="text">
                        Bio
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="regular">
                        {teacherData.bio}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>

            <Card
              sx={{
                p: 3,
                borderRadius: "18px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
            >
              <MDTypography variant="h5" fontWeight="bold" mb={2}>
                Quick Actions
              </MDTypography>

              <Divider />

              <MDBox
                mt={2}
                display="flex"
                flexWrap="wrap"
                gap={1.5}
              >
                <MDButton variant="gradient" color="dark" size="small">
                  Edit Information
                </MDButton>

                <MDButton variant="outlined" color="dark" size="small">
                  Change Password
                </MDButton>

                <MDButton variant="outlined" color="dark" size="small">
                  View Subjects
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Profile;