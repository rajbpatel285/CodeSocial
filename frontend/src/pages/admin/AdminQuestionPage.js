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
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
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
    setInput(question.input);
    setOutput(question.output);
    setDifficulty(question.difficulty);
  };

  const handleUpdateQuestion = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/question/questions/${questionId}`,
        {
          questionTitle,
          question: questionText,
          input,
          output,
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
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            marginBottom: "10px",
            textAlign: "center",
            textDecoration: "underline",
          }}
        >
          {question.questionTitle}
        </Typography>
        <Typography
          variant="body2"
          style={{ marginBottom: "10px", textAlign: "center" }}
        >
          <b>Difficulty:</b> {question.difficulty}
        </Typography>
        <Typography
          variant="body2"
          style={{ whiteSpace: "pre-line", marginBottom: "10px" }}
        >
          {question.question}
        </Typography>
        <Typography
          variant="body1"
          style={{
            whiteSpace: "pre-line",
            fontWeight: "bold",
          }}
        >
          Input
        </Typography>
        <Typography
          variant="body2"
          style={{ whiteSpace: "pre-line", marginBottom: "10px" }}
        >
          {question.input}
        </Typography>
        <Typography
          variant="body1"
          style={{
            whiteSpace: "pre-line",
            fontWeight: "bold",
          }}
        >
          Output
        </Typography>
        <Typography
          variant="body2"
          style={{ whiteSpace: "pre-line", marginBottom: "20px" }}
        >
          {question.output}
        </Typography>
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
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateQuestion}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminQuestionPage;
