import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
  Typography,
  Paper,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
} from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";

function UserProfile() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [userDetails, setUserDetails] = useState({});
  const [editData, setEditData] = useState({ username: "", name: "" });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/user/profile/${userId}`
      );
      setUserDetails(response.data);
      setEditData({
        username: response.data.username,
        name: response.data.name,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditProfile = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/user/profile/update/${userId}`,
        editData
      );
      if (response.data.message === "username already exists") {
        setSnackbarMessage("Username already exists. Please choose another.");
        setOpenSnackbar(true);
        return;
      }
      localStorage.setItem("userId", editData.username);
      fetchUserDetails();
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setSnackbarMessage("Error updating profile. Please try again.");
      setOpenSnackbar(true);
    }
  };

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
    return <Navigate to="/" />;
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
            src="/demo-avatar.jpg"
            style={{ marginRight: "20px", width: "250px", height: "250px" }}
          />
          <div>
            <Typography variant="h5">
              <span style={{ color: getRatingColor(userDetails.rating) }}>
                {getRatingTag(userDetails.rating)}
              </span>
            </Typography>
            <Typography variant="h5">
              <span style={{ color: "#6698e8" }}>Username :</span>{" "}
              {userDetails.username}
            </Typography>
            <Typography variant="h5">
              <span style={{ color: "#6698e8" }}>Email :</span>{" "}
              {userDetails.email}
            </Typography>
            <Typography variant="h5">
              <span style={{ color: "#6698e8" }}>Name :</span>{" "}
              {userDetails.name}
            </Typography>
            <Typography variant="h5">
              <span style={{ color: "#6698e8" }}>Rating :</span>{" "}
              <span style={{ color: getRatingColor(userDetails.rating) }}>
                {userDetails.rating}
              </span>
              {" ( max. "}
              <span style={{ color: getRatingColor(userDetails.maxRating) }}>
                {userDetails.maxRating}
              </span>
              {", "}
              <span style={{ color: getRatingColor(userDetails.maxRating) }}>
                {getRatingTag(userDetails.maxRating)}
              </span>
              {")"}
            </Typography>
          </div>
        </Paper>
        <Button variant="outlined" onClick={handleOpenEditDialog}>
          Edit Profile
        </Button>
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              value={editData.username}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleEditProfile}>Save</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
        />
      </div>
    </div>
  );
}

export default UserProfile;
