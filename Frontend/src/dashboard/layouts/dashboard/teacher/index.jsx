import Grid from "@mui/material/Grid";
import { useState, useRef, useEffect } from "react";

import MDBox from "components/MDBox";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import ComplexStatisticsCard from "../../../examples/Cards/StatisticsCards/ComplexStatisticsCard";

// 🔥 Firebase
import { auth, db } from "../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function TeacherDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const videoRef = useRef(null);

  // ✅ اسم المدرس
  const [teacherName, setTeacherName] = useState("");

  // 🔥 نجيب بيانات المدرس بطريقة صح
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // ✅ غيرنا من users → teachers
          const docRef = doc(db, "teachers", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            // ✅ بدل name استخدمنا firstName + lastName
            setTeacherName(`${data.firstName} ${data.lastName}`);
          } else {
            console.log("❌ No such document!");
            setTeacherName("No Name");
          }
        } catch (error) {
          console.log("❌ Error fetching user:", error);
        }
      } else {
        console.log("❌ No user logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  // تشغيل الكاميرا
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsRunning(true);
    } catch (err) {
      console.error(err);
    }
  };

  // إيقاف الكاميرا
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsRunning(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* ✅ الترحيب بالمدرس */}
      <MDBox mb={2} px={3}>
        <h3>Welcome, {teacherName || "Loading..."}</h3>
      </MDBox>

      <MDBox py={3}>
        <Grid container spacing={3}>

          {/* Start Attendance */}
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
                  label: "Start camera",
                }}
              />
            </MDBox>
          </Grid>

          {/* Stop Attendance */}
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
                  label: "Stop camera",
                }}
              />
            </MDBox>
          </Grid>

          {/* Status */}
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

          {/* Students Detected */}
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="groups"
                title="Detected Students"
                count="0"
                percentage={{
                  color: "info",
                  amount: "",
                  label: "real-time",
                }}
              />
            </MDBox>
          </Grid>

        </Grid>

        {/* الكاميرا */}
        <MDBox mt={4} textAlign="center">
          <video
            ref={videoRef}
            autoPlay
            style={{
              width: "500px",
              borderRadius: "15px",
              border: "2px solid #ccc",
            }}
          />
        </MDBox>

      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default TeacherDashboard;