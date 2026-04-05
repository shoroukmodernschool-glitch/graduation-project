import Icon from "@mui/material/Icon";
import AdminDashboard from "./layouts/dashboard/admin";

const adminRoutes = [
  {
    type: "collapse",
    name: "Admin Dashboard",
    key: "admin-dashboard",
    icon: <Icon>dashboard</Icon>,
    route: "/admin",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Attendance",
    key: "attendance",
    icon: <Icon>fact_check</Icon>,
    route: "/admin",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    icon: <Icon>assessment</Icon>,
    route: "/admin",
    component: <AdminDashboard />,
  },
];

export default adminRoutes;