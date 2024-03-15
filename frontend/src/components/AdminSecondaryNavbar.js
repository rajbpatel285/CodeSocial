import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

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
        my: 3,
        mx: "5%",
        maxWidth: "calc(90%)",
      }}
    >
      <Toolbar>
        <NavButton
          onClick={() => handleNavigation("/adminproblemset")}
          className={location.pathname === "/adminproblemset" ? "active" : ""}
        >
          Problem Set
        </NavButton>
        <NavButton
          onClick={() => handleNavigation("/admincontests")}
          className={location.pathname === "/admincontests" ? "active" : ""}
        >
          Contests
        </NavButton>
      </Toolbar>
    </AppBar>
  );
}

export default AdminSecondaryNavbar;
