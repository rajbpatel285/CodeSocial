import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
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

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/contest");
      const publishedContests = response.data.filter(
        (contest) => contest.isPublished
      );
      setContests(publishedContests);
      setAllContests(publishedContests);
    } catch (error) {
      console.error("Failed to fetch contests", error);
    }
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
                  style={{ ...cellStyle, fontWeight: "bold", width: "70%" }}
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
                >
                  Date
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
                    style={{ ...cellStyle, width: "70%" }}
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
                  <TableCell style={{ ...cellStyle, width: "15%" }}>
                    {contest.level}
                  </TableCell>
                  <TableCell style={{ ...cellStyle, width: "15%" }}>
                    {new Date(contest.date).toLocaleDateString()}
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
