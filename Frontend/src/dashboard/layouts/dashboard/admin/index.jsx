import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

import MDBox from "components/MDBox";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import ComplexStatisticsCard from "../../../examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Firebase
import { auth, db } from "../../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function AdminDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [streamUrl, setStreamUrl] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("❌ No logged in user");
        setAdminName("No Name");
        return;
      }

      console.log("✅ Logged user email:", user.email);

      try {
        const q = query(
          collection(db, "Admin"),
          where("email", "==", user.email)
        );

        const querySnapshot = await getDocs(q);

        console.log("📦 Admin docs found:", querySnapshot.size);

        if (!querySnapshot.empty) {
          const adminData = querySnapshot.docs[0].data();
          console.log("✅ Admin data:", adminData);
          setAdminName(`${adminData.firstName} ${adminData.lastName}`);
        } else {
          console.log("❌ No matching admin found in Firestore");
          setAdminName("No Name");
        }
      } catch (error) {
        console.log("🔥 Error fetching admin:", error);
        setAdminName("No Name");
      }
    });

    return () => unsubscribe();
  }, []);

  const startCamera = () => {
    if (isRunning) return;
    setStreamUrl(`http://127.0.0.1:5000/video_feed?ts=${Date.now()}`);
    setIsRunning(true);
  };

  const stopCamera = () => {
    setIsRunning(false);
    setStreamUrl("");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox mb={2} px={3}>
        <h3>Welcome, {adminName || "Loading..."}</h3>
      </MDBox>

      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <MDBox mb={1.5} onClick={startCamera} sx={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="success"
                icon="videocam"
                title="Start Attendance"
                count={isRunning ? "Running" : "Click"}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Start AI camera",
                }}
              />
            </MDBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <MDBox mb={1.5} onClick={stopCamera} sx={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="error"
                icon="stop"
                title="Stop Attendance"
                count={!isRunning ? "Stopped" : "Click"}
                percentage={{
                  color: "error",
                  amount: "",
                  label: "Stop AI camera",
                }}
              />
            </MDBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="info"
                title="Status"
                count={isRunning ? "Active" : "Inactive"}
                percentage={{
                  color: isRunning ? "success" : "error",
                  amount: "",
                  label: "Camera status",
                }}
              />
            </MDBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="groups"
                title="Recognition"
                count={isRunning ? "ON" : "OFF"}
                percentage={{
                  color: "info",
                  amount: "",
                  label: "Inside dashboard",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4} textAlign="center">
          <div
            style={{
              width: "500px",
              height: "375px",
              margin: "0 auto",
              overflow: "hidden",
              borderRadius: "15px",
              border: "2px solid #ccc",
              background: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isRunning && streamUrl ? (
              <img
                src={streamUrl}
                alt="AI Camera"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Click Start Attendance to open Face Recognition
              </div>
            )}
          </div>
        </MDBox>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default AdminDashboard;