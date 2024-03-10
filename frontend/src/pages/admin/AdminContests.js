import React, { useState, useEffect } from "react";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import AdminTopAppBar from "../../components/AdminTopAppBar";
import AdminSecondaryNavbar from "../../components/AdminSecondaryNavbar";
import axios from "axios";

function AdminContests() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [contests, setContests] = useState([]);
  const [open, setOpen] = useState(false);
  const [contestName, setContestName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [date, setDate] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchContests();
    if (location.state && location.state.message) {
      setAlertMessage(location.state.message);
      const timer = setTimeout(() => {
        setAlertMessage(null);
        navigate(location.pathname, { replace: true, state: {} });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const fetchContests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/contest");
      setContests(response.data);
    } catch (error) {
      console.error("Failed to fetch contests", error);
    }
  };

  const handleCreateContest = async () => {
    try {
      const response = await axios.post("http://localhost:8000/contest", {
        contestName,
        description,
        level,
        date,
      });
      console.log(response.data);
      fetchContests();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create contest", error);
    }
  };

  const toggleSortDate = () => {
    const sortedContests = [...contests].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (sortDirection === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setContests(sortedContests);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  if (!userId || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const cellStyle = {
    border: "3px solid rgba(224, 224, 224, 1)",
  };

  return (
    <div>
      <AdminTopAppBar title="CodeSocial" />
      <AdminSecondaryNavbar />
      <div style={{ margin: "0 5%" }}>
        <Typography
          variant="h4"
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Contests
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          style={{ marginBottom: "20px" }}
        >
          Add Contest
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add a New Contest</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="contestName"
              label="Contest Name"
              type="text"
              fullWidth
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="level-label">Level</InputLabel>
              <Select
                labelId="level-label"
                id="level"
                value={level}
                label="Level"
                onChange={(e) => setLevel(e.target.value)}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Difficult">Difficult</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              id="date"
              label="Date"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateContest}>Create</Button>
          </DialogActions>
        </Dialog>
        {alertMessage && (
          <Alert
            severity={alertMessage.includes("published") ? "success" : "error"}
            onClose={() => setAlertMessage(null)}
            sx={{ marginBottom: "20px" }}
          >
            {alertMessage}
          </Alert>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "55%" }}
                >
                  Contest Name
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                >
                  Level
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                  onClick={toggleSortDate}
                  sx={{ cursor: "pointer" }}
                >
                  Date {sortDirection === "asc" ? "↑" : "↓"}
                </TableCell>

                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contests.map((contest) => (
                <TableRow
                  key={contest.contestId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    style={{ ...cellStyle, width: "55%" }}
                    component="th"
                    scope="row"
                  >
                    <Link
                      to={`/admincontestdetail/${contest.contestId}`}
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
                      {contest.contestName}
                    </Link>
                  </TableCell>
                  <TableCell style={{ ...cellStyle, width: "15%" }}>
                    {contest.level}
                  </TableCell>
                  <TableCell style={{ ...cellStyle, width: "15%" }}>
                    {new Date(contest.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell style={{ ...cellStyle, width: "15%" }}>
                    {contest.isPublished ? (
                      <Typography style={{ color: "green" }}>
                        Published
                      </Typography>
                    ) : (
                      <Typography style={{ color: "red" }}>
                        Not yet Published
                      </Typography>
                    )}
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

export default AdminContests;
