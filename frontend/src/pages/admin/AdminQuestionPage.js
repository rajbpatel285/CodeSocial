import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { Navigate } from "react-router-dom";
import DialogContentText from "@mui/material/DialogContentText";

function AdminQuestionPage() {
  const { questionId } = useParams();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState(null);
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
    setQuestionTitle(question.questionTitle);
    setQuestionText(question.question);
    setAnswer(question.answer);
    setDifficulty(question.difficulty);
    setOpen(true);
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
          style={{ marginBottom: "20px" }}
        >
          Update Question
        </Button>
        <Typography
          variant="h4"
          style={{ fontWeight: "bold", marginBottom: "10px" }}
        >
          {question.questionTitle}
        </Typography>
        <Typography variant="body2" style={{ marginBottom: "20px" }}>
          Difficulty: {question.difficulty}
        </Typography>
        <div style={{ marginBottom: "20px" }}>
          <Typography
            variant="body1"
            style={{ whiteSpace: "pre-line", marginBottom: "20px" }}
          >
            {question.question}
          </Typography>
          <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
            {question.answer}
          </Typography>
        </div>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Update Question</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Update the details for the question here.
            </DialogContentText>
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
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
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
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateQuestion}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminQuestionPage;
