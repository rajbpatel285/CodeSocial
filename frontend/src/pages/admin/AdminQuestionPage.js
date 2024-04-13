import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [difficulty, setDifficulty] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(
        `https://codesocial-axmd.onrender.com/question/questions/${questionId}`
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
    setDifficulty(question.difficulty);
    setTestCases(question.testCases);
  };

  const handleUpdateQuestion = async () => {
    try {
      const response = await axios.put(
        `https://codesocial-axmd.onrender.com/question/questions/${questionId}`,
        {
          questionTitle,
          question: questionText,
          testCases,
          difficulty,
        }
      );
      setQuestion(response.data);
      setOpen(false);
      setAlertMessage(
        `Question "${response.data.questionTitle}" updated successfully`
      );
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 4000);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      const response = await axios.delete(
        `https://codesocial-axmd.onrender.com/question/questions/${questionId}`
      );
      navigate(-1, {
        replace: true,
        state: {
          message: `Question "${response.data.questionDeleted.questionTitle}" deleted`,
        },
      });
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = testCases.map((testCase, i) => {
      if (i === index) {
        return { ...testCase, [field]: value };
      }
      return testCase;
    });
    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const removeTestCase = (testIndex) => {
    const updatedTestCases = testCases.filter(
      (_, index) => index !== testIndex
    );
    setTestCases(updatedTestCases);
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
      <div style={{ margin: "0 5% 2% 5%" }}>
        {alertMessage && (
          <Alert
            severity="success"
            onClose={() => setAlertMessage(null)}
            sx={{ marginBottom: "20px" }}
          >
            {alertMessage}
          </Alert>
        )}
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
          Test Cases:
        </Typography>
        {question.testCases.map((testCase, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <Typography variant="body2" style={{ fontWeight: "bold" }}>
              Case {index + 1}:
            </Typography>
            <Typography variant="body2">Input:</Typography>
            <Typography
              component="pre"
              variant="body2"
              style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            >
              {testCase.input}
            </Typography>
            <Typography variant="body2">Output:</Typography>
            <Typography
              component="pre"
              variant="body2"
              style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            >
              {testCase.output}
            </Typography>
          </div>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          style={{ marginRight: "10px" }}
        >
          <ChangeCircleIcon style={{ marginRight: "5px" }} />
          Update Question
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <DeleteIcon style={{ marginRight: "5px" }} />
          Delete Question
        </Button>
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Contest</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteQuestion} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
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
                  margin="dense"
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
                  margin="dense"
                />
                <Button onClick={() => removeTestCase(index)}>
                  <CloseIcon />
                </Button>
              </div>
            ))}
            <Button
              onClick={addTestCase}
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
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
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateQuestion}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminQuestionPage;
