import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import AdminTopAppBar from "../../components/AdminTopAppBar";
import AdminSecondaryNavbar from "../../components/AdminSecondaryNavbar";
import axios from "axios";

function AdminContestDetail() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  // State for new question form
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
        setQuestions(data.questionSet || []);
      } catch (error) {
        console.error("Error fetching contest details:", error);
      }
    };
    fetchContestDetails();
  }, [contestId]);

  const handleAddQuestionToContest = async () => {
    try {
      const { data } = await axios.post("/question", { ...newQuestion });
      // Optionally, update contest's questionSet in the backend if needed
      setQuestions([...questions, data]);
      setOpen(false);
      // Reset new question form
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

  return (
    <div>
      <AdminTopAppBar title="CodeSocial" />
      <AdminSecondaryNavbar />
      <div style={{ margin: "0 5%" }}>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          {contest.contestName}
        </Typography>
        <Typography variant="body1">{contest.description}</Typography>
        <Typography variant="body2">Level: {contest.level}</Typography>
        <Typography variant="body2">
          Date: {new Date(contest.date).toLocaleDateString()}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add Question
        </Button>
        <List>
          {questions.map((question, index) => (
            <ListItem key={index}>
              <ListItemText primary={question.questionTitle} />
            </ListItem>
          ))}
        </List>
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
            {/* Form fields for questionTitle, question, answer, difficulty */}
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
