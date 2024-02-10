import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import AdminTopAppBar from "../../components/AdminTopAppBar";
import AdminSecondaryNavbar from "../../components/AdminSecondaryNavbar";
import axios from "axios";
import { Navigate } from "react-router-dom";

function AdminQuestionPage() {
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

export default AdminQuestionPage;
