import React from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function ProblemSet() {
  const location = useLocation();

  return (
    <div>
      <TopAppBar title="CodeSocial" />
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

export default ProblemSet;
