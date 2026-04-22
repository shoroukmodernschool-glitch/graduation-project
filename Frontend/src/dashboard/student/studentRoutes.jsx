import { lazy } from "react";
import Icon from "@mui/material/Icon";
import Subjects from "./subjects/Subjects";
import SubjectDetails from "./subject-details/SubjectDetails";

// layouts
const StudentDashboard = lazy(() => import("./dashboard"));
const Profile = lazy(() => import("./profile"));
const Tables = lazy(() => import("./student"));
const Attendance = lazy(() => import("./attendance"));
const Notifications = lazy(() => import("./notifications"));

const studentRoutes = [
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
];

export default studentRoutes;