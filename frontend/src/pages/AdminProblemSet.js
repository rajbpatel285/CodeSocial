import React from "react";
import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";
import AdminTopAppBar from "../components/AdminTopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function AdminProblemSet() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <AdminTopAppBar title="CodeSocial" />
      <SecondaryNavbar />
      <div style={{ padding: "20px" }}>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Problem Set
        </Typography>
        <Typography variant="body1">
          Challenge yourself with a variety of problems. Solve problems to
          improve your coding skills and prepare for coding contests.
        </Typography>
      </div>
    </div>
  );
}

export default AdminProblemSet;
