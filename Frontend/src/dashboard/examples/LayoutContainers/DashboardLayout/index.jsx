import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";

import Sidenav from "examples/Sidenav";
import routes from "dashboard/routes.js";
import studentRoutes from "../../../student/studentRoutes";
import teacherRoutes from "../../../Teacher/teacherRoutes";
import parentRoutes from "dashboard/parentRoutes";

import { useMaterialUIController, setLayout } from "context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname, dispatch]);

  let currentRoutes = routes;

  if (pathname.includes("parent")) {
    currentRoutes = parentRoutes;
  } else if (pathname.includes("teacher")) {
    currentRoutes = teacherRoutes;
  } else if (
    pathname.includes("student") ||
    pathname === "/tables" ||
    pathname === "/attendance" ||
    pathname === "/notifications" ||
    pathname === "/subjects" ||
    pathname.startsWith("/subject/") ||
    pathname === "/profile"
  ) {
    currentRoutes = studentRoutes;
  }

  return (
    <>
      <Sidenav brandName="Dashboard" routes={currentRoutes} />

      <MDBox
        sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
          p: 3,
          position: "relative",

          [breakpoints.up("xl")]: {
            marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
            transition: transitions.create(["margin-left", "margin-right"], {
              easing: transitions.easing.easeInOut,
              duration: transitions.duration.standard,
            }),
          },
        })}
      >
        {children}
      </MDBox>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;