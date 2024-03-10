import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Navigate, Link } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function Standings() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [order, setOrder] = useState("desc");
  const [friends, setFriends] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showOnlyFriends, setShowOnlyFriends] = useState(false);
  const [ratingFilter, setRatingFilter] = useState({
    GrandMaster: false,
    Master: false,
    Expert: false,
    Professional: false,
    Specialist: false,
    Beginner: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/users");
        setUsers(response.data);
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/friends/${userId}`
        );
        setFriends(response.data.map((friend) => friend.username));
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchUsers();
    fetchFriends();
    resetFilters();
  }, []);

  const handleSort = () => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    const sortedUsers = users.sort((a, b) => {
      return isAsc ? a.rating - b.rating : b.rating - a.rating;
    });
    setUsers([...sortedUsers]);
  };

  const handleShowOnlyFriendsChange = (event) => {
    setShowOnlyFriends(event.target.checked);
  };

  const handleRatingFilterChange = (name) => (event) => {
    setRatingFilter({ ...ratingFilter, [name]: event.target.checked });
  };

  const applyFilters = () => {
    let filteredUsers = allUsers;

    if (showOnlyFriends) {
      filteredUsers = filteredUsers.filter((user) =>
        friends.includes(user.username)
      );
    }

    const ratingCriteria = {
      GrandMaster: 2500,
      Master: 2300,
      Expert: 2000,
      Professional: 1600,
      Specialist: 1200,
      Beginner: 800,
    };

    if (Object.values(ratingFilter).some((value) => value)) {
      filteredUsers = filteredUsers.filter((user) => {
        return Object.entries(ratingFilter).some(([key, value]) => {
          if (!value) return false;
          const rating = user.rating;
          const minRating = ratingCriteria[key];
          const nextRating =
            Object.values(ratingCriteria)[
              Object.keys(ratingCriteria).indexOf(key) + 1
            ] || Infinity;
          console.log(minRating, nextRating);
          return rating < minRating && rating >= nextRating;
        });
      });
    }

    setUsers(filteredUsers);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setShowOnlyFriends(false);
    setRatingFilter({
      GrandMaster: false,
      Master: false,
      Expert: false,
      Professional: false,
      Specialist: false,
      Beginner: false,
      Newbie: false,
    });
    setUsers(allUsers);
    setFilterOpen(false);
  };

  const getRatingColor = (rating) => {
    if (rating >= 2500) return "#ff8c00";
    if (rating >= 2300) return "#008b8b";
    if (rating >= 2000) return "#ff4500";
    if (rating >= 1600) return "#006400";
    if (rating >= 1200) return "#00008b";
    if (rating >= 800) return "#8b0000";
    return "#0000cd";
  };

  const getRatingColorFromTag = (name) => {
    if (name == "GrandMaster") return "#ff8c00";
    if (name == "Master") return "#008b8b";
    if (name == "Expert") return "#ff4500";
    if (name == "Professional") return "#006400";
    if (name == "Specialist") return "#00008b";
    if (name == "Beginner") return "#8b0000";
    return "#0000cd";
  };

  if (!userId || isAdmin) {
    return <Navigate to="/" replace />;
  }

  const cellStyle = {
    border: "3px solid rgba(224, 224, 224, 1)",
  };

  return (
    <div>
      <TopAppBar title="CodeSocial" />
      <SecondaryNavbar />
      <div style={{ margin: "0 5%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", marginBottom: "20px" }}
          >
            Standings
          </Typography>
          <Button variant="outlined" onClick={() => setFilterOpen(true)}>
            <FilterAltIcon />
            Filter
          </Button>
        </div>
        <Dialog open={filterOpen} onClose={() => setFilterOpen(false)}>
          <DialogTitle>Filter Options</DialogTitle>
          <DialogContent>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showOnlyFriends}
                    onChange={handleShowOnlyFriendsChange}
                  />
                }
                label="Show Only Friends"
              />
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                Rating
              </Typography>
              {Object.keys(ratingFilter).map((name) => (
                <span style={{ color: getRatingColorFromTag(name) }}>
                  <FormControlLabel
                    key={name}
                    control={
                      <Checkbox
                        checked={ratingFilter[name]}
                        onChange={handleRatingFilterChange(name)}
                      />
                    }
                    label={name}
                    style={{ marginLeft: "5px" }}
                  />
                </span>
              ))}
            </FormGroup>
            <Button onClick={resetFilters} color="primary">
              Remove All Filters
            </Button>
            <Button onClick={applyFilters} color="primary">
              Apply
            </Button>
          </DialogContent>
        </Dialog>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "5%" }}
                ></TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "65%" }}
                >
                  Username
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "30%" }}
                  align="center"
                >
                  <TableSortLabel active direction={order} onClick={handleSort}>
                    Rating
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor:
                      userId === user.username || userId === user.email
                        ? "skyblue"
                        : "",
                  }}
                >
                  <TableCell align="center" style={cellStyle}>
                    {friends.includes(user.username) &&
                      userId !== user.username && (
                        <HandshakeIcon
                          style={{
                            color: "#3d7ff2",
                            marginLeft: 8,
                            fontSize: "1.2rem",
                          }}
                        />
                      )}
                  </TableCell>
                  <TableCell component="th" scope="row" style={cellStyle}>
                    <Link
                      to={`/userprofile/${user.username}`}
                      style={{
                        textDecoration: "underline",
                        color: "#1976d2",
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#1976d2",
                        },
                      }}
                    >
                      {user.username}
                    </Link>
                  </TableCell>
                  <TableCell align="center" style={cellStyle}>
                    <span style={{ color: getRatingColor(user.rating) }}>
                      {user.rating}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Standings;
