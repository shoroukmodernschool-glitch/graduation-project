import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

function InfoItem({ icon, label, value }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "16px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <MDBox p={2.5} display="flex" alignItems="center" gap={2}>
        <MDBox
          width="40px"
          height="40px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="12px"
          bgColor="info"
          coloredShadow="info"
          sx={{
            flexShrink: 0,
            boxShadow: "0 6px 14px rgba(33, 150, 243, 0.22)",
          }}
        >
          <Icon sx={{ color: "#fff !important", fontSize: "18px !important" }}>
            {icon}
          </Icon>
        </MDBox>

        <MDBox sx={{ minWidth: 0 }}>
          <MDTypography
            variant="button"
            color="text"
            fontWeight="regular"
            sx={{ fontSize: "0.95rem", display: "block", mb: 0.5 }}
          >
            {label}
          </MDTypography>

          <MDTypography
            variant="h6"
            fontWeight="medium"
            sx={{
              fontSize: "1.1rem",
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {value || "-"}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

function SummaryCard({ title, value, icon, color = "info" }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "16px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <MDBox p={2.5} display="flex" alignItems="center" gap={2}>
        <MDBox
          width="44px"
          height="44px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="12px"
          bgColor={color}
          coloredShadow={color}
          sx={{
            flexShrink: 0,
            boxShadow: "0 6px 14px rgba(0,0,0,0.14)",
          }}
        >
          <Icon sx={{ color: "#fff !important", fontSize: "19px !important" }}>
            {icon}
          </Icon>
        </MDBox>

        <MDBox sx={{ minWidth: 0 }}>
          <MDTypography
            variant="button"
            color="text"
            sx={{ fontSize: "0.95rem", display: "block", mb: 0.5 }}
          >
            {title}
          </MDTypography>

          <MDTypography
            variant="h4"
            fontWeight="bold"
            sx={{
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {value}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const docRef = doc(db, "student", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error(error);
      }
    });

    return () => unsubscribe();
  }, []);

  const fullName = userData
    ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
    : "Loading...";

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <Card
          sx={{
            overflow: "hidden",
            borderRadius: "20px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Cover */}
          <MDBox
            sx={{
              minHeight: "240px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              background:
                "linear-gradient(135deg, rgba(33,150,243,0.85), rgba(25,118,210,0.80))",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
            }}
          >
          <MDBox
  component="img"
  src="/images/logo.png"
  alt="SMS Logo"
  sx={{
    width: { xs: "160px", md: "240px" },
    height: "auto",
    objectFit: "contain",

    filter: "invert(1)", // 🔥 ده اللي بيحول الأبيض لأسود
  }}
/>

            <MDTypography
              variant="h3"
              fontWeight="bold"
              color="white"
              sx={{
                textAlign: "center",
                textShadow: "0 3px 10px rgba(0,0,0,0.25)",
              }}
            >
             
            </MDTypography>
          </MDBox>

          <MDBox px={{ xs: 2, md: 4 }} pb={4}>
            <MDBox
              mt={-8}
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              alignItems={{ xs: "center", md: "flex-end" }}
              gap={3}
            >
              <MDBox
                component="img"
                src={userData?.faceImage || "https://i.imgur.com/6VBx3io.png"}
                alt="profile-image"
                sx={{
                  width: { xs: "110px", md: "130px" },
                  height: { xs: "110px", md: "130px" },
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "5px solid white",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
                  backgroundColor: "#fff",
                }}
              />

              <MDBox
                flex={1}
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "center", md: "flex-end" }}
                gap={2}
              >
                <MDBox textAlign={{ xs: "center", md: "left" }}>
                  <MDTypography variant="h3" fontWeight="bold">
                    {fullName}
                  </MDTypography>
                  <MDTypography variant="h6" color="text">
                    {userData?.role || "Student"}
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    Student ID: {userData?.id || "-"}
                  </MDTypography>
                </MDBox>

                <MDBox
                  px={2}
                  py={1}
                  borderRadius="xl"
                  bgColor="info"
                  coloredShadow="info"
                >
                  <MDTypography variant="button" color="white" fontWeight="bold">
                    Grade {userData?.grade || "-"}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <SummaryCard title="Grade Level" value={userData?.grade || "-"} icon="school" color="info" />
              </Grid>
              <Grid item xs={12} md={4}>
                <SummaryCard title="Student Role" value={userData?.role || "Student"} icon="person" color="success" />
              </Grid>
              <Grid item xs={12} md={4}>
                <SummaryCard title="Student ID" value={userData?.id || "-"} icon="badge" color="dark" />
              </Grid>
            </Grid>

            <MDBox mt={4}>
              <MDTypography variant="h5" fontWeight="bold" mb={2}>
                Personal Information
              </MDTypography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoItem icon="email" label="Email Address" value={userData?.email} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem icon="call" label="Phone Number" value={userData?.phone} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem icon="wc" label="Gender" value={userData?.gender} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem icon="cake" label="Date of Birth" value={userData?.dob} />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem icon="location_on" label="Address" value={userData?.address} />
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Profile;