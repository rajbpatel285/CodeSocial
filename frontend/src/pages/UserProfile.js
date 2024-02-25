import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Paper, Avatar } from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";
import { Navigate } from "react-router-dom";

function UserProfile() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/profile/${userId}`
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [userId]);

  const getRatingColor = (rating) => {
    if (rating >= 2500) return "#ff8c00";
    if (rating >= 2300) return "#ff4500";
    if (rating >= 2000) return "#008b8b";
    if (rating >= 1600) return "#006400";
    if (rating >= 1200) return "#0000cd";
    if (rating >= 800) return "#00008b";
    return "#8b0000";
  };

  const getRatingTag = (rating) => {
    if (rating >= 2500) return "Grand Master";
    if (rating >= 2300) return "Master";
    if (rating >= 2000) return "Expert";
    if (rating >= 1600) return "Professional";
    if (rating >= 1200) return "Specialist";
    if (rating >= 800) return "Beginner";
    return "Newbie";
  };

  if (!userId || isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <TopAppBar title="CodeSocial" />
      <SecondaryNavbar />
      <div style={{ margin: "0 5%" }}>
        <Paper
          style={{
            padding: "20px",
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Avatar
            style={{ width: "250px", height: "250px", marginRight: "20px" }}
            src="/demo-avatar.jpg"
          />
          <div>
            <Typography variant="h5">
              <span style={{ color: "#6698e8" }}>Email :</span>{" "}
              {userDetails.email}
            </Typography>
            <Typography variant="h5">
              <span style={{ color: "#6698e8" }}>Username :</span>{" "}
              {userDetails.username}
            </Typography>
            <Typography variant="h5">
              <span style={{ color: "#6698e8" }}>Rating :</span>{" "}
              <span style={{ color: getRatingColor(userDetails.rating) }}>
                {userDetails.rating}
              </span>
              {" ("}
              <span style={{ color: getRatingColor(userDetails.rating) }}>
                {getRatingTag(userDetails.rating)}
              </span>
              {")"}
            </Typography>
          </div>
        </Paper>
      </div>
    </div>
  );
}

export default UserProfile;
