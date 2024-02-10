import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
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
  Paper,
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
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/question/questions"
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
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
          answer,
          difficulty: parseInt(difficulty, 10),
        }
      );
      setQuestions([...questions, response.data]);
      setOpen(false);
      setQuestionTitle("");
      setQuestionText("");
      setAnswer("");
      setDifficulty("");
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  return (
    <div>
      <AdminTopAppBar title="CodeSocial" />
      <AdminSecondaryNavbar />
      <div style={{ margin: "0 10%" }}>
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
        <Paper
          style={{ maxHeight: 500, overflow: "auto", marginBottom: "20px" }}
        >
          {questions.map((question, index) => (
            <div
              key={question.questionId}
              style={{
                padding: "10px",
                borderBottom:
                  index !== questions.length - 1 ? "1px solid #ccc" : "",
              }}
            >
              <Typography variant="h6">{question.questionTitle}</Typography>
              <Typography variant="body1" style={{ margin: "10px 0" }}>
                {question.question}
              </Typography>
              <Typography variant="body2">Answer: {question.answer}</Typography>
              <Typography variant="body2">
                Difficulty: {question.difficulty}
              </Typography>
            </div>
          ))}
        </Paper>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add a New Question</DialogTitle>
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
              label="Question"
              type="text"
              fullWidth
              multiline
              minRows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <TextField
              margin="dense"
              id="answer"
              label="Answer"
              type="text"
              fullWidth
              multiline
              minRows={2}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <FormControl fullWidth style={{ marginTop: "20px" }}>
              <InputLabel id="difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-label"
                id="difficulty"
                value={difficulty}
                label="Difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
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
