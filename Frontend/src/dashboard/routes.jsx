import { lazy } from "react";
import Icon from "@mui/material/Icon";
import Subjects from "../pages/subjects/Subjects";
import TeacherDashboard from "./layouts/dashboard/teacher";
// layouts
const StudentDashboard = lazy(() => import("./layouts/student"));
const Profile = lazy(() => import("./layouts/profile"));
const Tables = lazy(() => import("./layouts/tables"));
const Billing = lazy(() => import("./layouts/billing"));
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
    icon: <Icon>school</Icon>, // 👈 مناسب للكلاسات
    route: "/tables",
    component: <Tables />,
  },
{
  type: "collapse",
  name: "Subjects",
  key: "subjects",
  icon: <Icon>menu_book</Icon>,
  route: "/subjects", // 👈 اتغيرت
  component: <Subjects />, // 👈 اتغيرت
},

  {
    type: "collapse",
    name: "Assignments",
    key: "assignments",
    icon: <Icon>assignment</Icon>, // 👈 واجبات
    route: "/billing",
    component: <Billing />,
  },

  {
    type: "collapse",
    name: "Attendance",
    key: "attendance",
    icon: <Icon>fact_check</Icon>, // 👈 حضور
    route: "/billing",
    component: <Billing />,
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
  name: "Teacher",
  key: "teacher",
  icon: <Icon>school</Icon>,
  route: "/teacher-dashboard",
  component: <TeacherDashboard />,
}

];

export default routes;