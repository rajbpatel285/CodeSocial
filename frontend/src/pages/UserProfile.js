import React, { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
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
  Box,
} from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import BalanceIcon from "@mui/icons-material/Balance";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";

function UserProfile() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { userEmailOrUsername } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [editData, setEditData] = useState({
    username: "",
    name: "",
    email: "",
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isFriend, setIsFriend] = useState(null);
  const [openBadgesDialog, setOpenBadgesDialog] = useState(false);
  const [badgesDialogTitle, setBadgesDialogTitle] = useState("");
  const [badgesDialogDescription, setBadgesDialogDescription] = useState("");
  const [badgesDialogIcon, setBadgesDialogIcon] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/profile/${userEmailOrUsername}`
        );
        setUserDetails(response.data);
        setEditData({
          username: response.data.username,
          name: response.data.name,
          email: response.data.email,
        });
        // After setting user details, check friendship
        checkFriendship(response.data._id);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userEmailOrUsername, userId]);

  const checkFriendship = async (profileId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/user/checkFriendship`,
        {
          params: { userId, profileId },
        }
      );
      setIsFriend(response.data.isFriend);
    } catch (error) {
      console.error("Error checking friendship status:", error);
      setIsFriend(false);
    }
  };

  const toggleFriendship = async () => {
    const action = isFriend ? "removeFriend" : "addFriend";
    try {
      const response = await axios.post(
        `http://localhost:8000/user/${action}`,
        {
          userId,
          friendId: userDetails._id,
        }
      );
      if (response.status === 200) {
        setIsFriend(!isFriend);
        setSnackbarMessage(response.data.message);
      }
    } catch (error) {
      console.error(`Error ${action} status:`, error);
      setSnackbarMessage(`Error updating friend status. Please try again.`);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleBadgesOpenDialog = (title, description, IconComponent) => {
    setBadgesDialogTitle(title);
    setBadgesDialogDescription(description);
    setBadgesDialogIcon(IconComponent);
    setOpenBadgesDialog(true);
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
      setOpenEditDialog(false);
      editData.username !== userEmailOrUsername
        ? navigate(`/userprofile/${editData.username}`)
        : window.location.reload();
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

  const canEditProfile =
    userId === userDetails.username || userId === userDetails.email;

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
            {isFriend && (
              <Box display="flex" alignItems="center" marginBottom={2}>
                <HandshakeIcon style={{ color: "#3d7ff2" }} />
                <Typography variant="h6" style={{ marginLeft: 8 }}>
                  Friends
                </Typography>
              </Box>
            )}
            <div style={{ marginTop: "40px" }}>
              <Tooltip title="Winner">
                <IconButton
                  onClick={() =>
                    handleBadgesOpenDialog(
                      "Winner",
                      "This badge signifies the winners of alteast 5 contests.",
                      <MilitaryTechIcon
                        style={{ color: "goldenrod", marginRight: "5px" }}
                      />
                    )
                  }
                >
                  <MilitaryTechIcon
                    style={{ color: "goldenrod", marginRight: "5px" }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Topper">
                <IconButton
                  onClick={() =>
                    handleBadgesOpenDialog(
                      "Topper",
                      "This badge signifies the contestants in top 5 for 5 contests.",
                      <EmojiEventsIcon
                        style={{ color: "goldenrod", marginRight: "5px" }}
                      />
                    )
                  }
                >
                  <EmojiEventsIcon
                    style={{ color: "goldenrod", marginRight: "5px" }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Challenger">
                <IconButton
                  onClick={() =>
                    handleBadgesOpenDialog(
                      "Challenger",
                      "This badge signifies the players that contested in atleast 25 contests.",
                      <WorkspacePremiumIcon
                        style={{ color: "goldenrod", marginRight: "5px" }}
                      />
                    )
                  }
                >
                  <WorkspacePremiumIcon
                    style={{ color: "goldenrod", marginRight: "5px" }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Balancer">
                <IconButton
                  onClick={() =>
                    handleBadgesOpenDialog(
                      "Balancer",
                      "This badge signifies the users that solved atleast 25 question of Difficulty 1, 2, 3, 4, 5.",
                      <BalanceIcon
                        style={{ color: "goldenrod", marginRight: "5px" }}
                      />
                    )
                  }
                >
                  <BalanceIcon
                    style={{ color: "goldenrod", marginRight: "5px" }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Consistent">
                <IconButton
                  onClick={() =>
                    handleBadgesOpenDialog(
                      "Consistent",
                      "This badge signifies the users who regularly solved questions for 50 days.",
                      <AssuredWorkloadIcon
                        style={{ color: "goldenrod", marginRight: "5px" }}
                      />
                    )
                  }
                >
                  <AssuredWorkloadIcon
                    style={{ color: "goldenrod", marginRight: "5px" }}
                  />
                </IconButton>
              </Tooltip>
            </div>
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
        {canEditProfile && (
          <Button variant="outlined" onClick={handleOpenEditDialog}>
            Edit Profile
          </Button>
        )}
        {!canEditProfile && (
          <Button
            variant="outlined"
            onClick={toggleFriendship}
            style={{
              color: isFriend ? "red" : "green",
              borderColor: isFriend ? "red" : "green",
            }}
          >
            {isFriend ? "Delete Friend" : "Add Friend"}
          </Button>
        )}
        <Dialog
          open={openBadgesDialog}
          onClose={() => setOpenBadgesDialog(false)}
        >
          <DialogTitle>
            {badgesDialogIcon} {badgesDialogTitle}
          </DialogTitle>
          <DialogContent>
            <Typography>{badgesDialogDescription}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBadgesDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={editData.email}
              disabled={true}
            />
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
