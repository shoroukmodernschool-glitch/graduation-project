import { lazy } from "react";
import Icon from "@mui/material/Icon";
import Subjects from "./student/subjects/Subjects";
import SubjectDetails from "./student/subject-details/SubjectDetails";
import AdminDashboard from "./layouts/dashboard/admin";

// layouts
const StudentDashboard = lazy(() => import("./layouts/student"));
const Profile = lazy(() => import("./layouts/profile"));
const Tables = lazy(() => import("./layouts/tables"));

const Attendance = lazy(() => import("./layouts/attendance"));
const Notifications = lazy(() => import("./layouts/notifications"));

const routes = [
  {
    type: "collapse",
    name: "Student Dashboard",
    key: "student-dashboard",
    icon: <Icon>dashboard</Icon>,
    route: "/student-dashboard",
    component: <StudentDashboard />,
  },
  {
    type: "collapse",
    name: "Class",
    key: "tables",
    icon: <Icon>school</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Subjects",
    key: "subjects",
    icon: <Icon>menu_book</Icon>,
    route: "/subjects",
    component: <Subjects />,
  },
  
  {
    type: "collapse",
    name: "Attendance",
    key: "attendance",
    icon: <Icon>fact_check</Icon>,
    route: "/attendance",
    component: <Attendance />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon>notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon>person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Admin",
    key: "admin",
    icon: <Icon>videocam</Icon>,
    route: "/admin",
    component: <AdminDashboard />,
  },
];

export default routes;