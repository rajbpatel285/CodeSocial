import React, { useState, useEffect } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AdminTopAppBar from "../../components/AdminTopAppBar";
import AdminSecondaryNavbar from "../../components/AdminSecondaryNavbar";
import axios from "axios";

function AdminProblemSet() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [order, setOrder] = useState("asc");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const location = useLocation();
  const [allQuestions, setAllQuestions] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  useEffect(() => {
    fetchQuestions();
    setDifficultyFilter({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    });
    if (location.state && location.state.message) {
      setAlertMessage(location.state.message);
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/question/questions"
      );
      const publishedQuestions = response.data.filter(
        (question) => question.isPublished
      );
      setQuestions(publishedQuestions);
      setAllQuestions(publishedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
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

  if (!userId || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/question/questions",
        {
          questionTitle,
          question: questionText,
          testCases,
          difficulty: difficulty,
          isPublished: true,
        }
      );
      setQuestions([...questions, response.data]);
      setOpen(false);
      setQuestionTitle("");
      setQuestionText("");
      setDifficulty("");
      setTestCases([{ inputs: "", output: "" }]);
      setAlertMessage(`Question "${response.data.questionTitle}" added `);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
    } catch (error) {
      console.error("Error adding question:", error);
      setAlertMessage("Failed to add question");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = testCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const removeTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleDifficultyChange = (level) => (event) => {
    setDifficultyFilter({ ...difficultyFilter, [level]: event.target.checked });
  };

  const applyFilters = () => {
    let filteredQuestions = allQuestions;

    if (Object.values(difficultyFilter).some((value) => value)) {
      filteredQuestions = filteredQuestions.filter(
        (question) => difficultyFilter[question.difficulty]
      );
    }

    setQuestions(filteredQuestions);
    setFilterOpen(false);
  };

  const removeAllFilters = () => {
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

  const questionsCount = questions.length;

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
          Question Bank
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
            onClick={handleClickOpen}
            style={{ marginBottom: "10px" }}
          >
            Add Question
          </Button>
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
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ marginTop: "20px" }}
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
        {showAlert && (
          <Alert
            onClose={() => setShowAlert(false)}
            severity={alertMessage.includes("added") ? "success" : "error"}
            style={{ marginBottom: "20px" }}
          >
            {alertMessage}
          </Alert>
        )}
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "85%" }}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow
                  key={question.questionId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    style={{ ...cellStyle, width: "85%" }}
                    component="th"
                    scope="row"
                  >
                    <Link
                      to={`/adminquestion/${question.questionId}`}
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
                  </TableCell>
                  <TableCell
                    style={{ ...cellStyle, width: "15%" }}
                    align="center"
                  >
                    {question.difficulty}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add a New Question</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="questionTitle"
              label="Question Title"
              type="text"
              fullWidth
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              id="question"
              label="Question Statement"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <b>Test Cases: </b>
            </Typography>
            {testCases.map((testCase, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <TextField
                  label="Test Case Input"
                  multiline
                  rows={3}
                  value={testCase.input}
                  onChange={(e) =>
                    handleTestCaseChange(index, "input", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Test Case Output"
                  multiline
                  rows={3}
                  value={testCase.output}
                  onChange={(e) =>
                    handleTestCaseChange(index, "output", e.target.value)
                  }
                  fullWidth
                />
                <Button onClick={() => removeTestCase(index)}>
                  <CloseIcon />
                </Button>
              </div>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={addTestCase}
              style={{ marginBottom: "10px" }}
            >
              Add Test Case
            </Button>
            <FormControl fullWidth margin="dense">
              <InputLabel id="difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-label"
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminProblemSet;
