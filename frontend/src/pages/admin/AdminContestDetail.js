import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
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
} from "@mui/material";
import AdminTopAppBar from "../../components/AdminTopAppBar";
import AdminSecondaryNavbar from "../../components/AdminSecondaryNavbar";
import axios from "axios";

function AdminContestDetail() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionTitle: "",
    question: "",
    answer: "",
    difficulty: "",
  });

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/contest/${contestId}`
        );
        setContest(data);
        // Fetch questions details for each questionId in contest.questionSet
        const questionDetails = await Promise.all(
          data.questionSet.map((questionId) =>
            axios
              .get(`http://localhost:8000/question/questions/${questionId}`)
              .then((res) => res.data)
          )
        );
        setQuestions(questionDetails);
      } catch (error) {
        console.error("Error fetching contest details:", error);
      }
    };
    fetchContestDetails();
  }, [contestId]);

  const handleAddQuestionToContest = async () => {
    try {
      const questionResponse = await axios.post(
        "http://localhost:8000/question/questions",
        { ...newQuestion }
      );
      const createdQuestion = questionResponse.data;

      const updateContestResponse = await axios.put(
        `http://localhost:8000/contest/addQuestion/${contestId}`,
        {
          questionId: createdQuestion.questionId,
        }
      );

      setQuestions([...questions, createdQuestion]);
      setContest({
        ...contest,
        questionSet: [...contest.questionSet, createdQuestion],
      });

      setOpen(false);
      setNewQuestion({
        questionTitle: "",
        question: "",
        answer: "",
        difficulty: "",
      });
    } catch (error) {
      console.error("Failed to add question to contest", error);
    }
  };

  const handlePublishContest = async () => {
    try {
      await axios.put(`http://localhost:8000/contest${contestId}`, {
        isPublished: true,
      });
      navigate("/admincontests");
    } catch (error) {
      console.error("Failed to publish contest", error);
    }
  };

  if (!contest) {
    return <div>Loading...</div>;
  }

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
      <div style={{ margin: "0 5%" }}>
        <Typography
          variant="h4"
          style={{ fontWeight: "bold", marginBottom: "10px" }}
        >
          {contest.contestName}
        </Typography>
        <Typography
          variant="body1"
          style={{ whiteSpace: "pre-line", marginBottom: "10px" }}
        >
          {contest.description}
        </Typography>
        <Typography
          variant="body2"
          style={{ whiteSpace: "pre-line", marginBottom: "10px" }}
        >
          Level: {contest.level}
        </Typography>
        <Typography
          variant="body2"
          style={{ whiteSpace: "pre-line", marginBottom: "10px" }}
        >
          Date: {new Date(contest.date).toLocaleDateString()}
        </Typography>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "80%" }}
                >
                  Problem
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "20%" }}
                  align="center"
                >
                  Difficulty
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
                    style={{ ...cellStyle, width: "80%" }}
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
                    style={{ ...cellStyle, width: "20%" }}
                    align="center"
                  >
                    {question.difficulty}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add Question
        </Button>
        {/* <List>
          {questions.map((question, index) => (
            <ListItem key={index}>
              <ListItemText primary={question.questionTitle} />
            </ListItem>
          ))}
        </List> */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePublishContest}
        >
          Publish Contest
        </Button>
        {/* Add Question Dialog */}
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
              value={newQuestion.questionTitle}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  questionTitle: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              id="question"
              label="Question"
              type="text"
              fullWidth
              multiline
              minRows={3}
              value={newQuestion.question}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, question: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="answer"
              label="Answer"
              type="text"
              fullWidth
              multiline
              minRows={2}
              value={newQuestion.answer}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, answer: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-label"
                id="difficulty"
                value={newQuestion.difficulty}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, difficulty: e.target.value })
                }
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
            <Button onClick={handleAddQuestionToContest}>Add</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminContestDetail;
