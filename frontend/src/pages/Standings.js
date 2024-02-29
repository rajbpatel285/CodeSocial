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
} from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function Standings() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState("desc");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/users");
        setUsers(response.data);
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
  }, []);

  const handleSort = () => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    const sortedUsers = users.sort((a, b) => {
      return isAsc ? a.rating - b.rating : b.rating - a.rating;
    });
    setUsers([...sortedUsers]);
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
        <Typography
          variant="h4"
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Standings
        </Typography>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "70%" }}
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
                      {friends.includes(user.username) &&
                        userId !== user.username && (
                          <HandshakeIcon
                            style={{
                              color: "goldenrod",
                              marginLeft: 8,
                              fontSize: "1.2rem",
                            }}
                          />
                        )}
                    </Link>
                  </TableCell>
                  <TableCell align="center" style={cellStyle}>
                    {user.rating}
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
