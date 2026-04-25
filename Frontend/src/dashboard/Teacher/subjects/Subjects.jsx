import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";

import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

function Subjects() {
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        let teacherData = null;

        const teacherRef = doc(db, "teachers", user.uid);
        const teacherSnap = await getDoc(teacherRef);

        if (teacherSnap.exists()) {
          teacherData = teacherSnap.data();
        } else {
          const teacherQuery = query(collection(db, "teachers"), where("email", "==", user.email));
          const teacherSnapshot = await getDocs(teacherQuery);

          if (!teacherSnapshot.empty) {
            teacherData = teacherSnapshot.docs[0].data();
          }
        }

        const subjects = teacherData?.subjects || [];

        setTeacherSubjects(subjects);

        if (subjects.length > 0) {
          setSelectedSubject(subjects[0]);
          setSelectedGrade(`Grade ${subjects[0].grade}`);
        }
      } catch (error) {
        console.error("Error fetching teacher subjects:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const teacherSubject = selectedSubject?.name || "No Subject";
  const grades = teacherSubjects.map((subject) => `Grade ${subject.grade}`);

  const contentCards = [
    {
      title: "Videos",
      icon: "smart_display",
      count: 0,
      description: "Upload and manage lesson videos for students.",
    },
    {
      title: "PDF Files",
      icon: "picture_as_pdf",
      count: 0,
      description: "Add worksheets, notes, and explanation files.",
    },
    {
      title: "Exams",
      icon: "quiz",
      count: 0,
      description: "Create and organize quizzes and exams.",
    },
    {
      title: "Assignments",
      icon: "assignment",
      count: 0,
      description: "Upload homework and track required tasks.",
    },
  ];

  const handleGradeClick = (grade) => {
    setSelectedGrade(grade);

    const gradeNumber = grade.replace("Grade ", "");
    const subject = teacherSubjects.find((item) => item.grade === gradeNumber);

    if (subject) {
      setSelectedSubject(subject);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3} width="100%">
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
              {teacherSubject}
            </MDTypography>

            <MDTypography variant="button" color="white" opacity={0.8}>
              Manage your subject content, lessons, files, exams, and assignments from one place.
            </MDTypography>
          </MDBox>
        </Card>

        <Card
          sx={{
            p: 3,
            borderRadius: "18px",
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            mb: 4,
          }}
        >
          <MDBox mb={2}>
            <MDTypography variant="h5" fontWeight="bold">
              Available Grades
            </MDTypography>
            <MDTypography variant="button" color="text">
              Choose the grade you want to manage for this subject.
            </MDTypography>
          </MDBox>

          <Divider />

          <MDBox mt={2} display="flex" flexWrap="wrap" gap={1.5}>
            {grades.map((grade) => (
              <MDButton
                key={grade}
                variant={selectedGrade === grade ? "gradient" : "outlined"}
                color="dark"
                onClick={() => handleGradeClick(grade)}
                sx={{
                  borderRadius: "12px",
                }}
              >
                {grade}
              </MDButton>
            ))}
          </MDBox>
        </Card>

        <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="bold">
            {selectedGrade || "No Grade"} Content
          </MDTypography>
          <MDTypography variant="button" color="text">
            Choose the section you want to manage.
          </MDTypography>
        </MDBox>

        <MDBox
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "20px",
            width: "100%",
          }}
        >
          {contentCards.map((item, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                borderRadius: "18px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                minHeight: "215px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.25s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 28px rgba(15,23,42,0.14)",
                },
              }}
            >
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MDBox
                  sx={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "14px",
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: "#f3f4f6",
                  }}
                >
                  <Icon sx={{ color: "#111827" }}>{item.icon}</Icon>
                </MDBox>

                <MDTypography variant="h4" fontWeight="bold">
                  {item.count}
                </MDTypography>
              </MDBox>

              <MDBox>
                <MDTypography variant="h6" fontWeight="bold" mb={1}>
                  {item.title}
                </MDTypography>

                <MDTypography variant="button" color="text">
                  {item.description}
                </MDTypography>
              </MDBox>

              <MDBox mt={2.5} display="flex" gap={1}>
                <MDButton variant="gradient" color="dark" size="small" fullWidth>
                  View
                </MDButton>

                <MDButton variant="outlined" color="dark" size="small" fullWidth>
                  Upload
                </MDButton>
              </MDBox>
            </Card>
          ))}
        </MDBox>

        <MDBox mt={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: "18px",
              boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            }}
          >
            <MDTypography variant="h5" fontWeight="bold" mb={1}>
              Current Selection
            </MDTypography>

            <MDTypography variant="button" color="text">
              You are currently managing:
            </MDTypography>

            <MDBox mt={2}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" py={1.5}>
                <MDTypography variant="button" color="text">
                  Subject
                </MDTypography>
                <MDTypography variant="button" fontWeight="bold">
                  {teacherSubject}
                </MDTypography>
              </MDBox>

              <Divider />

              <MDBox display="flex" justifyContent="space-between" alignItems="center" py={1.5}>
                <MDTypography variant="button" color="text">
                  Grade
                </MDTypography>
                <MDTypography variant="button" fontWeight="bold">
                  {selectedGrade || "No Grade"}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Subjects;