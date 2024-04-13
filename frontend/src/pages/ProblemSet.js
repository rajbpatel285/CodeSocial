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
  TableSortLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";

function ProblemSet() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [order, setOrder] = useState("asc");
  const [filledStars, setFilledStars] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [showSolvedOnly, setShowSolvedOnly] = useState(false);

  useEffect(() => {
    fetchQuestions();
    fetchStarredQuestions();
    setShowStarredOnly(false);
    setDifficultyFilter({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    });
    fetchSolvedQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "https://codesocial-axmd.onrender.com/question/questions"
      );
      const publishedQuestions = response.data.filter(
        (question) => question.isPublished
      );
      publishedQuestions.sort((a, b) => a.difficulty - b.difficulty);
      setQuestions(publishedQuestions);
      setAllQuestions(publishedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchStarredQuestions = async () => {
    try {
      const response = await axios.get(
        `https://codesocial-axmd.onrender.com/user/starred/${userId}`
      );
      const starredQuestionIds = response.data;
      const starsState = starredQuestionIds.reduce(
        (acc, id) => ({ ...acc, [id]: true }),
        {}
      );
      setFilledStars(starsState);
    } catch (error) {
      console.error("Error fetching starred questions:", error);
    }
  };

  const handleSort = () => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    const sortedQuestions = questions.sort((a, b) => {
      return isAsc ? b.difficulty - a.difficulty : a.difficulty - b.difficulty;
    });
    setQuestions([...sortedQuestions]);
  };

  const handleStarClick = async (questionId) => {
    const isStarred = filledStars[questionId];
    const endpoint = isStarred ? "/user/unstar" : "/user/star";
    try {
      await axios.post(`https://codesocial-axmd.onrender.com${endpoint}`, {
        userId: userId,
        questionId: questionId,
      });
      setFilledStars((prev) => ({
        ...prev,
        [questionId]: !isStarred,
      }));
    } catch (error) {
      console.error("Error updating starred question:", error);
    }
  };

  const handleShowStarredOnlyChange = (event) => {
    setShowStarredOnly(event.target.checked);
  };

  const handleDifficultyChange = (level) => (event) => {
    setDifficultyFilter({ ...difficultyFilter, [level]: event.target.checked });
  };

  const applyFilters = () => {
    let filteredQuestions = allQuestions;

    if (showStarredOnly) {
      filteredQuestions = filteredQuestions.filter(
        (question) => filledStars[question.questionId]
      );
    }

    if (showSolvedOnly) {
      filteredQuestions = filteredQuestions.filter((question) =>
        solvedQuestions.includes(question.questionId)
      );
    }

    if (Object.values(difficultyFilter).some((value) => value)) {
      filteredQuestions = filteredQuestions.filter(
        (question) => difficultyFilter[question.difficulty]
      );
    }

    setQuestions(filteredQuestions);
    setFilterOpen(false);
  };

  const removeAllFilters = () => {
    setShowStarredOnly(false);
    setDifficultyFilter({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    });
    setQuestions(allQuestions);
    setFilterOpen(false);
  };

  const fetchSolvedQuestions = async () => {
    try {
      const response = await axios.get(
        `https://codesocial-axmd.onrender.com/user/profile/${userId}`
      );
      setSolvedQuestions(response.data.questionsSolved);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const questionsCount = questions.length;

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
            Question Bank
          </Typography>
          <Button variant="outlined" onClick={() => setFilterOpen(true)}>
            <FilterAltIcon />
            Filter
          </Button>
        </div>
        <Typography variant="subtitle1" style={{ marginBottom: "10px" }}>
          Displaying {questionsCount} questions
        </Typography>
        <Dialog open={filterOpen} onClose={() => setFilterOpen(false)}>
          <DialogTitle>Filters</DialogTitle>
          <DialogContent>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showStarredOnly}
                    onChange={handleShowStarredOnlyChange}
                  />
                }
                label="Show Starred Only"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showSolvedOnly}
                    onChange={(event) =>
                      setShowSolvedOnly(event.target.checked)
                    }
                  />
                }
                label="Show Solved Only"
              />
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                Difficulty
              </Typography>
              {Array.from({ length: 5 }, (_, i) => (
                <FormControlLabel
                  key={i + 1}
                  control={
                    <Checkbox
                      checked={difficultyFilter[i + 1]}
                      onChange={handleDifficultyChange(i + 1)}
                    />
                  }
                  label={`Level ${i + 1}`}
                  style={{ marginLeft: "5px" }}
                />
              ))}
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={removeAllFilters} color="primary">
              Remove All Filters
            </Button>
            <Button onClick={applyFilters} color="primary">
              Apply
            </Button>
          </DialogActions>
        </Dialog>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "70%" }}
                >
                  Question
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                  align="center"
                >
                  <TableSortLabel active direction={order} onClick={handleSort}>
                    Difficulty
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                  align="center"
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow
                  key={question.questionId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    style={{ ...cellStyle, width: "70%" }}
                    component="th"
                    scope="row"
                  >
                    <Link
                      to={`/question/${question.questionId}`}
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
                      {question.questionTitle}
                    </Link>
                    {solvedQuestions.includes(question.questionId) && (
                      <CheckCircleOutlineIcon
                        style={{
                          marginLeft: 8,
                          fontSize: "1.2rem",
                        }}
                        color="success"
                      />
                    )}
                  </TableCell>
                  <TableCell
                    style={{ ...cellStyle, width: "15%" }}
                    align="center"
                  >
                    {question.difficulty}
                  </TableCell>
                  <TableCell
                    style={{ ...cellStyle, width: "15%" }}
                    align="center"
                    onClick={() => handleStarClick(question.questionId)}
                  >
                    {filledStars[question.questionId] ? (
                      <StarIcon />
                    ) : (
                      <StarBorderIcon />
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

export default ProblemSet;
