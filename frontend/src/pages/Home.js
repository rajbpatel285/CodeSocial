import React from "react";
import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function Home() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!userId || isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <TopAppBar title="CodeSocial" />
      <SecondaryNavbar />
      <div style={{ margin: "0 5% 2% 5%", textAlign: "center" }}>
        <img
          src={process.env.PUBLIC_URL + "/images/poster_image.png"}
          alt="CodeSocial Home page poster"
        />
      </div>
    </div>
  );
}

export default Home;
