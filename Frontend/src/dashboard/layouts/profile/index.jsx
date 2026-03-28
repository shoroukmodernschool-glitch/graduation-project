import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Layout
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "student"),
          where("uid", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setUserData(data);
        }
      } catch (error) {
        console.error(error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* 🔥 Cover FULL WIDTH */}
      <MDBox
        height="300px"
        sx={{
          backgroundImage: `url(https://images.unsplash.com/photo-1501785888041-af3ef285b470)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
        }}
      />

      {/* 🔥 Profile Card */}
      <MDBox mt={-12} px={2} display="flex" justifyContent="center">
        <MDBox
          width="100%"
          maxWidth="1100px"
          p={4}
          bgColor="white"
          borderRadius="xl"
          shadow="lg"
        >
          {/* Top Section */}
          <MDBox display="flex" alignItems="center" gap={3}>
            {/* ✅ Avatar من Cloudinary */}
            <MDBox
              component="img"
              src={
                userData?.faceImage ||
                `${import.meta.env.BASE_URL}images/dolla.jpeg`
              }
              width="100px"
              height="100px"
              borderRadius="50%"
              sx={{ objectFit: "cover" }}
            />

            {/* Name */}
            <MDBox>
              <MDTypography variant="h4">
                {!userData
                  ? "Loading..."
                  : `${userData.firstName} ${userData.lastName}`}
              </MDTypography>

              <MDTypography variant="button" color="text">
                {userData?.role || "Student"}
              </MDTypography>
            </MDBox>
          </MDBox>

          {/* Info */}
          <MDBox mt={4}>
            <MDTypography variant="h5" mb={2}>
              Profile Information
            </MDTypography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <MDTypography>Email: {userData?.email || "..."}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDTypography>Grade: {userData?.grade || "..."}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDTypography>Phone: {userData?.phone || "..."}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDTypography>Gender: {userData?.gender || "..."}</MDTypography>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Profile;