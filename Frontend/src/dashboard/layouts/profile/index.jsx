import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No user logged in");
        return;
      }

      try {
        const docRef = doc(db, "student", user.uid); // 🔥 نفس الاسم
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No data found");
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

      <MDBox
        height="300px"
        sx={{
          backgroundImage: `url(https://images.unsplash.com/photo-1501785888041-af3ef285b470)`,
          backgroundSize: "cover",
        }}
      />

      <MDBox mt={-12} px={2} display="flex" justifyContent="center">
        <MDBox
          width="100%"
          maxWidth="1100px"
          p={4}
          bgColor="white"
          borderRadius="xl"
        >
          <MDBox display="flex" alignItems="center" gap={3}>
            <MDBox
              component="img"
              src={userData?.faceImage || "https://i.imgur.com/6VBx3io.png"}
              sx={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover", // 🔥 أهم سطر
              }}
            />

            <MDBox>
              <MDTypography variant="h4">
                {userData
                  ? `${userData.firstName} ${userData.lastName}`
                  : "No Data"}
              </MDTypography>

              <MDTypography>{userData?.role || ""}</MDTypography>
            </MDBox>
          </MDBox>

          <MDBox mt={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <MDTypography>Email: {userData?.email || "-"}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDTypography>Grade: {userData?.grade || "-"}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDTypography>Phone: {userData?.phone || "-"}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDTypography>Gender: {userData?.gender || "-"}</MDTypography>
              </Grid>

              {/* 🔥 الجديد */}
              <Grid item xs={12} md={6}>
                <MDTypography>
                  Date of Birth: {userData?.dob || "-"}
                </MDTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDTypography>Address: {userData?.address || "-"}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDTypography>ID: {userData?.id || "-"}</MDTypography>
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
