import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";

function QuestionPage() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);

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

  return (
    <div>
      <TopAppBar title="CodeSocial" />
      <SecondaryNavbar />
      <div style={{ margin: "0 5%" }}>
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
      </div>
    </div>
  );
}

export default QuestionPage;
