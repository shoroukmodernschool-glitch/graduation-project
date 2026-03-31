import { useEffect, useState } from "react";
import Sidenav from "../../dashboard/examples/Sidenav";
import routes from "../../dashboard/routes";

import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "subject"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidenav routes={routes} />

      <div style={{ flex: 1, padding: "30px" }}>
        <h2 style={{ marginBottom: "20px" }}>Subjects Page</h2>

        <Grid container spacing={3}>
          {subjects.map((subject) => (
            <Grid item xs={12} md={6} lg={3} key={subject.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  textAlign: "center",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    margin: "0 auto 15px",
                    borderRadius: "16px",
                    background: "#1976d2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <Icon fontSize="medium">menu_book</Icon>
                </div>

                {/* Title */}
                <Typography variant="h6" fontWeight="bold">
                  {subject.name || subject.title || subject.subject_name || "Subject"}
                </Typography>

                {/* Grade */}
                <Typography variant="body2" color="text.secondary">
                  Grade: {subject.grade || "N/A"}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}