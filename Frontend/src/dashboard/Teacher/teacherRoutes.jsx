import Icon from "@mui/material/Icon";
import TeacherDashboard from "./teacher";

import Subjects from "./subjects/Subjects";
import Students from "./students/Students";
import Attendance from "./attendance/Attendance";
import Notifications from "./notifications/Notifications";
import Profile from "./profile/Profile";
import TeacherExams from "./exams/TeacherExams";

const teacherRoutes = [
  {
    type: "collapse",
    name: "Dashboard teacher",
    key: "teacher-dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/teacher-dashboard",
    component: <TeacherDashboard />,
  },
  {
    type: "collapse",
    name: "Subjects",
    key: "teacher-subjects",
    icon: <Icon fontSize="small">menu_book</Icon>,
    route: "/teacher-subjects",
    component: <Subjects />,
  },
  {
    type: "collapse",
    name: "Students",
    key: "teacher-students",
    icon: <Icon fontSize="small">groups</Icon>,
    route: "/teacher-students",
    component: <Students />,
  },
  {
    type: "collapse",
    name: "Attendance",
    key: "teacher-attendance",
    icon: <Icon fontSize="small">fact_check</Icon>,
    route: "/teacher-attendance",
    component: <Attendance />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "teacher-notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/teacher-notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "teacher-profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/teacher-profile",
    component: <Profile />,
  },
  {
    type: "route",
    name: "Teacher Exams",
    key: "teacher-exams",
    route: "/teacher-exams",
    component: <TeacherExams />,
  },
];

export default teacherRoutes;