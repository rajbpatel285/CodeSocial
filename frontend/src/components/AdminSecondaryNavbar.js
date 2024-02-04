import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

// Customized button with hover effect
const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&.active": {
    color: theme.palette.secondary.main,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

function AdminSecondaryNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path, { state: { id: location.state?.id } });
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        color: "inherit",
        boxShadow: "none",
        border: "5px solid",
        borderColor: "divider",
        borderRadius: 1,
        mt: 5,
        mx: 2,
        maxWidth: "calc(100% - 35px)",
      }}
    >
      <Toolbar>
        <NavButton
          onClick={() => handleNavigation("/contests")}
          className={location.pathname === "/contests" ? "active" : ""}
        >
          Contests
        </NavButton>
        <NavButton
          onClick={() => handleNavigation("/problemset")}
          className={location.pathname === "/problemset" ? "active" : ""}
        >
          Problem Set
        </NavButton>
        <NavButton
          onClick={() => handleNavigation("/standings")}
          className={location.pathname === "/standings" ? "active" : ""}
        >
          Standings
        </NavButton>
      </Toolbar>
    </AppBar>
  );
}

export default AdminSecondaryNavbar;