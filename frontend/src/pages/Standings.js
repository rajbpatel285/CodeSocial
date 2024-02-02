import React from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function Standings() {
  const location = useLocation();

  return (
    <div>
      <TopAppBar title="CodeSocial" />
      <SecondaryNavbar />
      <div style={{ padding: "20px" }}>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Standings
        </Typography>
        <Typography variant="body1">
          View your standings and see how you rank against other participants.
          Keep pushing your limits!
        </Typography>
      </div>
    </div>
  );
}

export default Standings;
