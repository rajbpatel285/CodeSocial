import React from "react";
import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";
import AdminTopAppBar from "../../components/AdminTopAppBar";
import AdminSecondaryNavbar from "../../components/AdminSecondaryNavbar";

function AdminContests() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!userId || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <AdminTopAppBar title="CodeSocial" />
      <AdminSecondaryNavbar />
      <div style={{ margin: "0 5%" }}>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Contests
        </Typography>
        <Typography variant="body1">
          Here you can find all the contests happening on CodeSocial.
          Participate and test your skills against other coders.
        </Typography>
      </div>
    </div>
  );
}

export default AdminContests;