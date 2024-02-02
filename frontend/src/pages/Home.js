import React from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function Home() {
  const location = useLocation();

  return (
    <div>
      <TopAppBar title="CodeSocial" />
      <SecondaryNavbar />
      <div style={{ padding: "20px" }}>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Hello {location.state?.id || "Guest"}
        </Typography>
        <Typography variant="body1">
          Welcome to the home page of CodeSocial, where you can participate in
          contests, solve problems, and check your standings among peers.
        </Typography>
      </div>
    </div>
  );
}

export default Home;
