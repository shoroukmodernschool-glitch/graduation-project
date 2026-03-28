import { lazy } from "react";
import Icon from "@mui/material/Icon";

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
    name: "Profile",
    key: "profile",
    icon: <Icon>person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon>table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon>receipt_long</Icon>,
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
];

export default routes;
