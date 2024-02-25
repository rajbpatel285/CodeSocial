import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Paper, Avatar } from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";

function UserProfile() {
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
            <Typography variant="h5">Email: {userDetails.email}</Typography>
            <Typography variant="h5">
              Username: {userDetails.username}
            </Typography>
            <Typography variant="h5">Rating: {userDetails.rating}</Typography>
          </div>
        </Paper>
      </div>
    </div>
  );
}

export default UserProfile;
