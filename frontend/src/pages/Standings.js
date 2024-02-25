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
import axios from "axios";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function Standings() {
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSort = () => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    const sortedUsers = users.sort((a, b) => {
      return isAsc ? a.rating - b.rating : b.rating - a.rating;
    });
    setUsers([...sortedUsers]);
  };

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
                <TableRow key={index}>
                  <TableCell component="th" scope="row" style={cellStyle}>
                    {user.username}
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
