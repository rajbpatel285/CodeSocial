import React from "react";
import { Typography } from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function Contests() {
  return (
    <div>
      <TopAppBar title="CodeSocial" />
      <SecondaryNavbar />
      <div style={{ padding: "20px" }}>
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

export default Contests;
