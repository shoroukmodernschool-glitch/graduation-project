import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";

import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
  setDarkMode,
} from "context";

import { auth, db } from "../../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function DashboardNavbar({ absolute, light, isMini, onToggleNotifications }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    miniSidenav,
    transparentNavbar,
    fixedNavbar,
    openConfigurator,
    darkMode,
  } = controller;

  const [openMenu, setOpenMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const route = location.pathname.split("/").slice(1);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const teacherRef = doc(db, "teachers", user.uid);
          const teacherSnap = await getDoc(teacherRef);

          if (teacherSnap.exists()) {
            const data = teacherSnap.data();
            const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
            setUserName(fullName || "User");
            setUserRole("teacher");
            return;
          }

          const studentRef = doc(db, "student", user.uid);
          const studentSnap = await getDoc(studentRef);

          if (studentSnap.exists()) {
            const data = studentSnap.data();
            const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
            setUserName(fullName || "User");
            setUserRole("student");
            return;
          }

          const parentRef = doc(db, "parents", user.uid);
          const parentSnap = await getDoc(parentRef);

          if (parentSnap.exists()) {
            const data = parentSnap.data();
            const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
            setUserName(fullName || data.name || data.fullName || "User");
            setUserRole("parent");
            return;
          }

          setUserName("User");
          setUserRole("");
        } catch (error) {
          console.error("Error:", error);
          setUserName("User");
          setUserRole("");
        }
      } else {
        setUserName("");
        setUserRole("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const handleDarkMode = () => {
    setDarkMode(dispatch, !darkMode);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("uid");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      navigate("/login-parent", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNotificationClick = () => {
    handleCloseMenu();

    if (onToggleNotifications) {
      onToggleNotifications();
      return;
    }

    if (location.pathname.startsWith("/teacher")) {
      navigate("/teacher-notifications");
    } else {
      navigate("/notifications");
    }
  };

  const handleBellClick = (event) => {
    if (onToggleNotifications) {
      event.stopPropagation();
      onToggleNotifications();
      return;
    }

    handleOpenMenu(event);
  };

  const handleProfileClick = () => {
    if (location.pathname.startsWith("/teacher")) {
      navigate("/teacher-profile");
    } else {
      navigate("/profile");
    }
  };

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <MDBox onClick={handleNotificationClick}>
        <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      </MDBox>
    </Menu>
  );

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs
            icon="home"
            title={userName ? `Welcome, ${userName}` : "Welcome"}
            route={route}
            light={light}
          />
        </MDBox>

        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleDarkMode}
              >
                <Icon sx={iconsStyle}>
                  {darkMode ? "dark_mode" : "light_mode"}
                </Icon>
              </IconButton>

              {userRole === "parent" ? (
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  onClick={handleLogout}
                >
                  <Icon sx={iconsStyle}>logout</Icon>
                </IconButton>
              ) : (
                <>
                  <IconButton
                    sx={navbarIconButton}
                    size="small"
                    disableRipple
                    onClick={handleProfileClick}
                  >
                    <Icon sx={iconsStyle}>account_circle</Icon>
                  </IconButton>

                  <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    sx={navbarMobileMenu}
                    onClick={handleMiniSidenav}
                  >
                    <Icon sx={iconsStyle} fontSize="medium">
                      {miniSidenav ? "menu_open" : "menu"}
                    </Icon>
                  </IconButton>

                  <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    sx={navbarIconButton}
                    onClick={handleConfiguratorOpen}
                  >
                    <Icon sx={iconsStyle}>settings</Icon>
                  </IconButton>

                  <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    sx={navbarIconButton}
                    onClick={handleBellClick}
                  >
                    <Icon sx={iconsStyle}>notifications</Icon>
                  </IconButton>

                  {renderMenu()}
                </>
              )}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
  onToggleNotifications: null,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  onToggleNotifications: PropTypes.func,
};

export default DashboardNavbar;