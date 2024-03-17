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
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const fetchContests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/contest");
      setContests(response.data);
      setAllContests(response.data);
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
      setAlertMessage(`Contest "${response.data.contestName}" created`);
      const timer = setTimeout(() => {
        setAlertMessage(null);
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
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

  const handleDifficultyChange = (level) => (event) => {
    setDifficultyFilter({ ...difficultyFilter, [level]: event.target.checked });
  };

  const handleDateChange = (type) => (date) => {
    setDateRange({ ...dateRange, [type]: date });
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
        const contestDate = new Date(contest.date);
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
            severity={
              alertMessage.includes("published") ||
              alertMessage.includes("created")
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
