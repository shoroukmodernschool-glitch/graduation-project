import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";

import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

const CLOUDINARY_CLOUD_NAME = "dzoppqvhy";
const CLOUDINARY_UPLOAD_PRESET = "react_upload";

function Subjects() {
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [teacher, setTeacher] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [activeView, setActiveView] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchMaterials = async (subject, grade) => {
    if (!subject || !grade) return;

    const gradeNumber = grade.replace("Grade ", "");

    try {
      const materialsQuery = query(
        collection(db, "teacher_materials"),
        where("subjectId", "==", subject.subjectId),
        where("grade", "==", gradeNumber)
      );

      const snapshot = await getDocs(materialsQuery);

      setMaterials(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        let teacherData = null;
        let teacherDocId = "";

        const teacherRef = doc(db, "teachers", user.uid);
        const teacherSnap = await getDoc(teacherRef);

        if (teacherSnap.exists()) {
          teacherData = teacherSnap.data();
          teacherDocId = teacherSnap.id;
        } else {
          const teacherQuery = query(
            collection(db, "teachers"),
            where("email", "==", user.email)
          );
          const teacherSnapshot = await getDocs(teacherQuery);

          if (!teacherSnapshot.empty) {
            teacherData = teacherSnapshot.docs[0].data();
            teacherDocId = teacherSnapshot.docs[0].id;
          }
        }

        const fullTeacher = {
          id: teacherDocId,
          email: user.email,
          ...teacherData,
        };

        setTeacher(fullTeacher);

        const subjects = teacherData?.subjects || [];

        setTeacherSubjects(subjects);

        if (subjects.length > 0) {
          setSelectedSubject(subjects[0]);
          setSelectedGrade(`Grade ${subjects[0].grade}`);
          await fetchMaterials(subjects[0], `Grade ${subjects[0].grade}`);
        }
      } catch (error) {
        console.error("Error fetching teacher subjects:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const teacherSubject = selectedSubject?.name || "No Subject";
  const grades = teacherSubjects.map((subject) => `Grade ${subject.grade}`);

  const videosCount = materials.filter((item) => item.type === "video").length;
  const pdfCount = materials.filter((item) => item.type === "pdf").length;

  const contentCards = [
    {
      title: "Videos",
      type: "video",
      accept: "video/*",
      icon: "smart_display",
      count: videosCount,
      description: "Upload and manage lesson videos for students.",
    },
    {
      title: "PDF Files",
      type: "pdf",
      accept: "application/pdf",
      icon: "picture_as_pdf",
      count: pdfCount,
      description: "Add worksheets, notes, and explanation files.",
    },
    {
      title: "Exams",
      type: "exam",
      icon: "quiz",
      count: 0,
      description: "Create and organize quizzes and exams.",
      disabled: true,
    },
    {
      title: "Assignments",
      type: "assignment",
      icon: "assignment",
      count: 0,
      description: "Upload homework and track required tasks.",
      disabled: true,
    },
  ];

  const handleGradeClick = async (grade) => {
    setSelectedGrade(grade);

    const gradeNumber = grade.replace("Grade ", "");
    const subject = teacherSubjects.find((item) => item.grade === gradeNumber);

    if (subject) {
      setSelectedSubject(subject);
      setActiveView("");
      await fetchMaterials(subject, grade);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", `teacher_materials/${selectedSubject.subjectId}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }

    return data.secure_url;
  };

  const handleUpload = async (event, type) => {
    const file = event.target.files[0];
    event.target.value = "";

    if (!file || !selectedSubject || !selectedGrade || !teacher) return;

    try {
      setUploading(true);

      const fileUrl = await uploadToCloudinary(file);
      const gradeNumber = selectedGrade.replace("Grade ", "");

      await addDoc(collection(db, "teacher_materials"), {
        type,
        title: file.name,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        subjectName: selectedSubject.name,
        subjectId: selectedSubject.subjectId,
        grade: gradeNumber,
        teacherId: teacher.id,
        teacherEmail: teacher.email,
        createdAt: serverTimestamp(),
      });

      await fetchMaterials(selectedSubject, selectedGrade);
      setActiveView(type);
      alert("Uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  const viewedMaterials = materials.filter((item) => item.type === activeView);

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
                sx={{ borderRadius: "12px" }}
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
                <MDButton
                  variant="gradient"
                  color="dark"
                  size="small"
                  fullWidth
                  disabled={item.disabled}
                  onClick={() => setActiveView(item.type)}
                >
                  View
                </MDButton>

                <MDButton
                  component="label"
                  variant="outlined"
                  color="dark"
                  size="small"
                  fullWidth
                  disabled={item.disabled || uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}

                  {!item.disabled && (
                    <input
                      type="file"
                      hidden
                      accept={item.accept}
                      onChange={(e) => handleUpload(e, item.type)}
                    />
                  )}
                </MDButton>
              </MDBox>
            </Card>
          ))}
        </MDBox>

        {activeView && (
          <MDBox mt={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: "18px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
            >
              <MDTypography variant="h5" fontWeight="bold" mb={2}>
                {activeView === "video" ? "Uploaded Videos" : "Uploaded PDF Files"}
              </MDTypography>

              {viewedMaterials.length === 0 ? (
                <MDTypography variant="button" color="text">
                  No files uploaded yet.
                </MDTypography>
              ) : (
                viewedMaterials.map((material) => (
                  <MDBox key={material.id}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1.5}
                    >
                      <MDBox display="flex" alignItems="center" gap={1.5}>
                        <Icon sx={{ color: "#111827" }}>
                          {material.type === "video" ? "smart_display" : "picture_as_pdf"}
                        </Icon>

                        <MDTypography variant="button" fontWeight="bold">
                          {material.title}
                        </MDTypography>
                      </MDBox>

                      <MDButton
                        variant="outlined"
                        color="dark"
                        size="small"
                        onClick={() => window.open(material.fileUrl, "_blank")}
                      >
                        Open
                      </MDButton>
                    </MDBox>

                    <Divider />
                  </MDBox>
                ))
              )}
            </Card>
          </MDBox>
        )}

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