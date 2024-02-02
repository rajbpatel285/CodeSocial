import React from "react";
import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function Help() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <TopAppBar title="CodeSocial" />
      <SecondaryNavbar />
      <div style={{ padding: "20px" }}>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Help & Support
        </Typography>
        <Typography variant="body1">
          Need assistance? Here you can find FAQs, contact support, and access
          helpful resources to guide you through our platform.
        </Typography>
      </div>
    </div>
  );
}

export default Help;
