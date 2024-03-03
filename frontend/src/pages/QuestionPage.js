import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, TextField, Button } from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";
import { Navigate } from "react-router-dom";

function QuestionPage() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
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

  if (!question) {
    return <div>Loading...</div>;
  }

  if (!userId || isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <TopAppBar title="CodeSocial" />
      <SecondaryNavbar />
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
        <div style={{ marginBottom: "10px" }}>
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
            {question.answer}
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
            {question.answer}
          </Typography>
          <TextField
            label="Add Your Code here..."
            multiline
            rows={8}
            variant="outlined"
            fullWidth
            style={{ marginBottom: "5px" }}
          />
          <Button
            variant="contained"
            color="primary"
            // onClick={handleTestCode}
          >
            Test
          </Button>
          <Button
            variant="contained"
            color="primary"
            // onClick={handleTestCode}
            style={{ marginLeft: "5px" }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuestionPage;
