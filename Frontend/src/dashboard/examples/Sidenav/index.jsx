import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";

// context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

function Sidenav({ color = "info", brand = "", brandName, routes = [], ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const [openCollapse, setOpenCollapse] = useState(false);

  const collapseName = location.pathname.replace("/", "");

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();

    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location, transparentSidenav, whiteSidenav]);

  const renderRoutes = routes.map(
    ({ type, name, icon, title, noCollapse, key, href, route }) => {
      let returnValue;

      if (type === "collapse") {
        returnValue = href ? (
          <a
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <SidenavCollapse
              name={name}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            />
          </a>
        ) : (
          <NavLink key={key} to={route} style={{ textDecoration: "none" }}>
            <SidenavCollapse
              name={name}
              icon={icon}
              active={route === location.pathname}
              noCollapse={noCollapse}
            />
          </NavLink>
        );
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            opacity={0.6}
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={() => setMiniSidenav(dispatch, true)}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>

        {/* ✅ التعديل هنا فقط */}
        <MDBox
          component={Link}
          to="/"
          position="relative"
          display="flex"
          alignItems="center"
          width="100%"
          minHeight="2rem"
        >
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}

          <MDTypography
            component="h6"
            variant="button"
            fontWeight="medium"
            color="white"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {brandName}
          </MDTypography>
        </MDBox>
      </MDBox>

      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />

      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

Sidenav.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object),
};

export default Sidenav;