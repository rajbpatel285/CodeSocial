import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import SensorsIcon from "@mui/icons-material/Sensors";
import LoginIcon from "@mui/icons-material/Login";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";

function Contests() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [contests, setContests] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState({
    Easy: false,
    Medium: false,
    Difficult: false,
  });
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });
  const [allContests, setAllContests] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await axios.get(
        "https://codesocial-axmd.onrender.com/contest"
      );
      let publishedContests = response.data.filter(
        (contest) => contest.isPublished
      );
      const sortedContests = publishedContests.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
      setContests(sortedContests);
      setAllContests(sortedContests);
      const userDetails = await axios.get(
        `https://codesocial-axmd.onrender.com/user/profile/${userId}`
      );
      setUserEmail(userDetails.data.email);
      setUsername(userDetails.data.username);
    } catch (error) {
      console.error("Failed to fetch contests", error);
    }
  };

  const toggleSortDate = () => {
    const sortedContests = [...contests].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.startTime.localeCompare(b.startTime);
      } else {
        return b.startTime.localeCompare(a.startTime);
      }
    });
    setContests(sortedContests);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleDifficultyChange = (level) => (event) => {
    setDifficultyFilter({ ...difficultyFilter, [level]: event.target.checked });
  };

  const applyFilters = () => {
    let filteredContests = allContests;

    if (Object.values(difficultyFilter).some((value) => value)) {
      filteredContests = filteredContests.filter(
        (contest) => difficultyFilter[contest.level]
      );
    }

    if (dateRange.start && dateRange.end) {
      filteredContests = filteredContests.filter((contest) => {
        const contestDate = new Date(contest.startTime);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return contestDate >= startDate && contestDate <= endDate;
      });
    }

    setContests(filteredContests);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setDifficultyFilter({
      Easy: false,
      Medium: false,
      Difficult: false,
    });
    setDateRange({
      start: "",
      end: "",
    });
    setContests(allContests);
    setFilterOpen(false);
  };

  const handleRegister = async (contestId) => {
    try {
      await axios.post(
        `https://codesocial-axmd.onrender.com/contest/register/${contestId}`,
        {
          userId,
        }
      );
      fetchContests();
    } catch (error) {
      console.error("Error registering for contest", error);
    }
  };

  const handleUnregister = async (contestId) => {
    try {
      await axios.post(
        `https://codesocial-axmd.onrender.com/contest/unregister/${contestId}`,
        { userId }
      );
      fetchContests();
    } catch (error) {
      console.error("Error unregistering from contest", error);
    }
  };

  const handleEnter = (contest) => {
    navigate(`/contestdetail/${contest.contestId}`);
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
      <div style={{ margin: "0 5% 2% 5%" }}>
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
            Contests
          </Typography>
          <Button variant="outlined" onClick={() => setFilterOpen(true)}>
            <FilterAltIcon />
            Filter
          </Button>
        </div>
        <Dialog open={filterOpen} onClose={() => setFilterOpen(false)}>
          <DialogTitle>Filter Contests</DialogTitle>
          <DialogContent>
            <FormGroup>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                Difficulty
              </Typography>
              {Object.keys(difficultyFilter).map((level) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={difficultyFilter[level]}
                      onChange={handleDifficultyChange(level)}
                    />
                  }
                  label={level}
                  key={level}
                />
              ))}
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                Select Date Range
              </Typography>
              <div
                style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
              >
                <TextField
                  label="Start Date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ flex: 1 }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ flex: 1 }}
                />
              </div>
            </FormGroup>
            <Button onClick={resetFilters} color="primary">
              Remove All Filters
            </Button>
            <Button onClick={applyFilters} color="primary">
              Apply
            </Button>
          </DialogContent>
        </Dialog>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "45%" }}
                >
                  Contest Name
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "10%" }}
                >
                  Level
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "10%" }}
                  onClick={toggleSortDate}
                  sx={{ cursor: "pointer" }}
                >
                  Date {sortDirection === "asc" ? "↑" : "↓"}
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "20%" }}
                >
                  Time
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contests.map((contest) => (
                <TableRow
                  key={contest.contestId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    style={{ ...cellStyle, width: "45%" }}
                    component="th"
                    scope="row"
                  >
                    <Link
                      to={`/contestdetail/${contest.contestId}`}
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
                  <TableCell style={{ ...cellStyle, width: "10%" }}>
                    {contest.level}
                  </TableCell>
                  <TableCell style={{ ...cellStyle, width: "10%" }}>
                    {new Date(contest.startTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell style={{ ...cellStyle, width: "20%" }}>
                    {`${new Date(
                      contest.startTime
                    ).toLocaleTimeString()} - ${new Date(
                      contest.endTime
                    ).toLocaleTimeString()}`}
                  </TableCell>
                  <TableCell style={{ ...cellStyle, width: "15%" }}>
                    {contest.isEnded ? (
                      <Typography style={{ color: "grey" }}>Ended</Typography>
                    ) : contest.isLive ? (
                      <Typography style={{ color: "Blue" }}>
                        <SensorsIcon /> Live
                        {contest.registeredUsers.includes(userEmail) ||
                        contest.registeredUsers.includes(username) ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEnter(contest)}
                          >
                            <LoginIcon style={{ marginRight: "5px" }} />
                            Enter
                          </Button>
                        ) : (
                          <Typography style={{ color: "grey" }}>
                            Not registered
                          </Typography>
                        )}
                      </Typography>
                    ) : contest.registeredUsers.includes(userEmail) ||
                      contest.registeredUsers.includes(username) ? (
                      <div>
                        <Typography style={{ color: "green" }}>
                          Registered
                        </Typography>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "red", color: "white" }}
                          onClick={() => handleUnregister(contest.contestId)}
                        >
                          <NoAccountsIcon style={{ marginRight: "5px" }} />
                          Unregister
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "green", color: "white" }}
                        onClick={() => handleRegister(contest.contestId)}
                      >
                        <HowToRegIcon style={{ marginRight: "5px" }} />
                        Register
                      </Button>
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

export default Contests;
