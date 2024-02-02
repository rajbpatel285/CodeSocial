import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";

// Customized button with hover effect
const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&.active": {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.action.selected,
  },
  "&:hover": {
    color: theme.palette.secondary.dark,
  },
}));

function Help() {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path, { state: { id: location.state?.id } });
  };

  return (
    <div>
      {/* Top AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CodeSocial
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Secondary Navbar */}
      <AppBar
        position="static"
        color="warning"
        sx={{ margin: "20px 20px", borderRadius: 1 }}
      >
        <Toolbar>
          <NavButton
            onClick={() => handleNavigation("/home")}
            className={location.pathname === "/home" ? "active" : ""}
          >
            Home
          </NavButton>
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
          <NavButton
            onClick={() => handleNavigation("/help")}
            className={location.pathname === "/help" ? "active" : ""}
          >
            Help
          </NavButton>
        </Toolbar>
      </AppBar>

      <div style={{ padding: "20px" }}>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Help & Support
        </Typography>
        <Typography variant="body1">
          Need assistance? Here you can find FAQs, contact support, and access
          helpful resources to guide you through our platform.
        </Typography>
        {/* ...rest of your content */}
      </div>
    </div>
  );
}

export default Help;
