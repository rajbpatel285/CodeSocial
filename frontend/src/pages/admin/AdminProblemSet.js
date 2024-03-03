import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
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
} from "@mui/material";
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
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    fetchQuestions();
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
          input,
          output,
          difficulty: parseInt(difficulty, 10),
          isPublished: true,
        }
      );
      setQuestions([...questions, response.data]);
      setOpen(false);
      setQuestionTitle("");
      setQuestionText("");
      setInput("");
      setOutput("");
      setDifficulty("");
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

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
          Problem Set
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          style={{ marginBottom: "20px" }}
        >
          Add Question
        </Button>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "85%" }}
                >
                  Problem
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
          <DialogTitle>Update Question</DialogTitle>
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
              label="Question Text"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <TextField
              margin="dense"
              id="input"
              label="Input"
              type="text"
              fullWidth
              multiline
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <TextField
              margin="dense"
              id="output"
              label="Output"
              type="text"
              fullWidth
              multiline
              rows={2}
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
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
