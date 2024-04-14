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
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import SensorsIcon from "@mui/icons-material/Sensors";
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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
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
      const response = await axios.get(
        "https://codesocial-axmd.onrender.com/contest"
      );
      const sortedContests = response.data.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
      setContests(sortedContests);
      setAllContests(sortedContests);
    } catch (error) {
      console.error("Failed to fetch contests", error);
    }
  };

  const handleCreateContest = async () => {
    const startDate = new Date(date + "T" + startTime);
    const endDate = new Date(date + "T" + endTime);
    try {
      const response = await axios.post(
        "https://codesocial-axmd.onrender.com/contest",
        {
          contestName,
          description,
          level,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        }
      );
      setAlertMessage(`Contest "${response.data.contestName}" created`);
      const timer = setTimeout(() => {
        setAlertMessage(null);
        navigate(location.pathname, { replace: true, state: {} });
      }, 4000);
      fetchContests();
      setDate("");
      setStartTime("");
      setEndTime("");
      setContestName("");
      setDescription("");
      setLevel("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create contest", error);
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
      <div style={{ margin: "0 5% 2% 5%" }}>
        <Typography
          variant="h4"
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Contests
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            style={{ marginBottom: "20px" }}
          >
            <AddIcon style={{ marginRight: "5px" }} />
            Add Contest
          </Button>
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
              label="Contest Date"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              id="startTime"
              label="Start Time"
              type="time"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              id="endTime"
              label="End Time"
              type="time"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: startTime,
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
            severity={
              alertMessage.includes("published") ||
              alertMessage.includes("created") ||
              alertMessage.includes("live")
                ? "success"
                : "error"
            }
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
                  style={{ ...cellStyle, fontWeight: "bold", width: "50%" }}
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
                  style={{ ...cellStyle, fontWeight: "bold", width: "10%" }}
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
                    style={{ ...cellStyle, width: "50%" }}
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
                  <TableCell style={{ ...cellStyle, width: "10%" }}>
                    {contest.isEnded ? (
                      <Typography style={{ color: "grey" }}>Ended</Typography>
                    ) : contest.isLive ? (
                      <Typography style={{ color: "Blue" }}>
                        <SensorsIcon /> Live
                      </Typography>
                    ) : contest.isPublished ? (
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
