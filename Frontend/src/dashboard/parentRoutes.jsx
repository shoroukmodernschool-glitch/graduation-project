import { lazy } from "react";
import Icon from "@mui/material/Icon";

const ParentDashboard = lazy(() => import("./layouts/dashboard/parent"));
const Profile = lazy(() => import("./layouts/profile"));
const Attendance = lazy(() => import("./layouts/attendance"));
const Notifications = lazy(() => import("./layouts/notifications"));

const parentRoutes = [
  {
    type: "collapse",
    name: "Parent Dashboard",
    key: "parent-dashboard",
    icon: <Icon>dashboard</Icon>,
    route: "/parent-dashboard",
    component: <ParentDashboard />,
  },
  
  {
    type: "collapse",
    name: "Notifications",
    key: "parent-notifications",
    icon: <Icon>notifications</Icon>,
    route: "/parent-notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "parent-profile",
    icon: <Icon>person</Icon>,
    route: "/parent-profile",
    component: <Profile />,
  },
];

export default parentRoutes;