import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Projects() {
  const recentActivity = [
    {
      title: "English Lesson 2 Completed",
      time: "Today - 10:30 AM",
      icon: "menu_book",
      color: "info",
    },
    {
      title: "Math Assignment Submitted",
      time: "Yesterday - 5:00 PM",
      icon: "assignment_turned_in",
      color: "success",
    },
    {
      title: "Science Quiz Started",
      time: "2 days ago",
      icon: "quiz",
      color: "error",
    },
    {
      title: "Arabic Attendance Marked",
      time: "This week",
      icon: "check_circle",
      color: "dark",
    },
  ];

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h5" fontWeight="bold" mb={3}>
          Recent Activity
        </MDTypography>

        {recentActivity.map((item, index) => (
          <MDBox
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={1.5}
            borderBottom={index !== recentActivity.length - 1 ? "1px solid #eee" : "none"}
          >
            <MDBox display="flex" alignItems="center" gap={2}>
              <MDBox
                width="40px"
                height="40px"
                borderRadius="lg"
                bgColor={item.color}
                coloredShadow={item.color}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon sx={{ color: "#fff" }}>{item.icon}</Icon>
              </MDBox>

              <MDBox>
                <MDTypography variant="button" fontWeight="bold">
                  {item.title}
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  {item.time}
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        ))}
      </MDBox>
    </Card>
  );
}

export default Projects;