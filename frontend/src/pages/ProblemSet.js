import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";

function ProblemSet() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [questions, setQuestions] = useState([]);
  const [order, setOrder] = useState("asc");
  const [filledStars, setFilledStars] = useState({});

  useEffect(() => {
    fetchQuestions();
    fetchStarredQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/question/questions"
      );
      const publishedQuestions = response.data.filter(
        (question) => question.isPublished
      );
      setQuestions(publishedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchStarredQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/user/starred/${userId}`
      );
      const starredQuestionIds = response.data;
      const starsState = starredQuestionIds.reduce(
        (acc, id) => ({ ...acc, [id]: true }),
        {}
      );
      setFilledStars(starsState);
    } catch (error) {
      console.error("Error fetching starred questions:", error);
    }
  };

  const handleSort = () => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    const sortedQuestions = questions.sort((a, b) => {
      return isAsc ? b.difficulty - a.difficulty : a.difficulty - b.difficulty;
    });
    setQuestions([...sortedQuestions]);
  };

  const handleStarClick = async (questionId) => {
    const isStarred = filledStars[questionId];
    const endpoint = isStarred ? "/user/unstar" : "/user/star";
    try {
      await axios.post(`http://localhost:8000${endpoint}`, {
        userId: userId,
        questionId: questionId,
      });
      setFilledStars((prev) => ({
        ...prev,
        [questionId]: !isStarred,
      }));
    } catch (error) {
      console.error("Error updating starred question:", error);
    }
  };

  if (!userId || isAdmin) {
    return <Navigate to="/" replace />;
  }

  const cellStyle = {
    border: "3px solid rgba(224, 224, 224, 1)",
  };

  return (
    <div>
      <TopAppBar title="CodeSocial" />
      <SecondaryNavbar />
      <div style={{ margin: "0 5%" }}>
        <Typography
          variant="h4"
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Problem Set
        </Typography>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "70%" }}
                >
                  Problem
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                  align="center"
                >
                  <TableSortLabel active direction={order} onClick={handleSort}>
                    Difficulty
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                  align="center"
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow
                  key={question.questionId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    style={{ ...cellStyle, width: "70%" }}
                    component="th"
                    scope="row"
                  >
                    <Link
                      to={`/question/${question.questionId}`}
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
                    style={{ ...cellStyle, width: "15%" }}
                    align="center"
                  >
                    {question.difficulty}
                  </TableCell>
                  <TableCell
                    style={{ ...cellStyle, width: "15%" }}
                    align="center"
                    onClick={() => handleStarClick(question.questionId)}
                  >
                    {filledStars[question.questionId] ? (
                      <StarIcon />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ProblemSet;
