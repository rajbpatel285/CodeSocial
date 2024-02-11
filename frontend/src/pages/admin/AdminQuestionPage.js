import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
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
} from "@mui/material";
import AdminTopAppBar from "../../components/AdminTopAppBar";
import AdminSecondaryNavbar from "../../components/AdminSecondaryNavbar";
import axios from "axios";

function AdminQuestionPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [open, setOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/question/questions/${questionId}`
      );
      setQuestion(response.data);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
    setQuestionTitle(question.questionTitle);
    setQuestionText(question.question);
    setAnswer(question.answer);
    setDifficulty(question.difficulty);
  };

  const handleUpdateQuestion = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/question/questions/${questionId}`,
        {
          questionTitle,
          question: questionText,
          answer,
          difficulty,
        }
      );
      setQuestion(response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/question/questions/${questionId}`
      );
      navigate("/adminproblemset"); // Adjust the navigate path as needed
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  if (!userId || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <AdminTopAppBar title="CodeSocial" />
      <AdminSecondaryNavbar />
      <div style={{ margin: "0 5%" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          style={{ marginRight: "10px" }}
        >
          Update Question
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to delete this question?")
            ) {
              handleDeleteQuestion();
            }
          }}
        >
          Delete Question
        </Button>
        <Typography
          variant="h4"
          style={{
            marginBottom: "20px",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          {question.questionTitle}
        </Typography>
        <Typography variant="body2" style={{ marginBottom: "20px" }}>
          Difficulty: {question.difficulty}
        </Typography>
        <Typography
          variant="body1"
          style={{ whiteSpace: "pre-line", marginBottom: "20px" }}
        >
          {question.question}
        </Typography>
        <Typography
          variant="body1"
          style={{ whiteSpace: "pre-line", marginBottom: "20px" }}
        >
          Answer: {question.answer}
        </Typography>
        {/* Update Question Dialog */}
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
              id="answer"
              label="Answer"
              type="text"
              fullWidth
              multiline
              rows={2}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
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
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateQuestion}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminQuestionPage;
