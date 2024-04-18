import React, { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import SensorsIcon from "@mui/icons-material/Sensors";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";

function ContestDetail() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [solvedQuestions, setSolvedQuestions] = useState([]);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://codesocial-axmd.onrender.com/contest/${contestId}`
        );
        setContest(data);
        if (
          data.isEnded ||
          (data.isLive && data.registeredUsers.includes(userId))
        ) {
          const questionDetails = await Promise.all(
            data.questionSet.map((questionId) =>
              axios
                .get(
                  `https://codesocial-axmd.onrender.com/question/questions/${questionId}`
                )
                .then((res) => res.data)
            )
          );
          setQuestions(questionDetails);
        }
      } catch (error) {
        console.error("Error fetching contest details:", error);
      }
    };
    fetchContestDetails();
    fetchSolvedQuestions();
  }, [contestId]);

  const fetchSolvedQuestions = async () => {
    try {
      const response = await axios.get(
        `https://codesocial-axmd.onrender.com/user/profile/${userId}`
      );
      setSolvedQuestions(response.data.questionsSolved);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  if (!contest) {
    return <div>Loading...</div>;
  }

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
      <div style={{ margin: "0 5% 2% 5%" }}>
        <div
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: "blue",
          }}
        >
          {contest.isLive && !contest.isEnded ? (
            <>
              <SensorsIcon /> Live
            </>
          ) : null}
          {contest.isEnded ? <>Contest has ended</> : null}
        </div>
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            marginBottom: "10px",
            textAlign: "center",
            textDecoration: "underline",
          }}
        >
          {contest.contestName}
        </Typography>
        <Typography
          variant="body2"
          style={{
            whiteSpace: "pre-line",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          <b>Level:</b> {contest.level}
        </Typography>
        <Typography
          variant="body2"
          style={{
            whiteSpace: "pre-line",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          <b>Date:</b> {new Date(contest.startTime).toLocaleDateString()}
        </Typography>
        <Typography
          variant="body2"
          style={{
            whiteSpace: "pre-line",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          <b>Time:</b> {new Date(contest.startTime).toLocaleTimeString()}
          {" - "}
          {new Date(contest.endTime).toLocaleTimeString()}
        </Typography>
        <Typography
          variant="body2"
          style={{ whiteSpace: "pre-line", marginBottom: "10px" }}
        >
          {contest.description}
        </Typography>
        {contest.isEnded ||
        (contest.isLive && contest.registeredUsers.includes(userId)) ? (
          <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ ...cellStyle, fontWeight: "bold", width: "80%" }}
                  >
                    Question
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
                      {solvedQuestions.includes(question.questionId) && (
                        <CheckCircleOutlineIcon
                          style={{
                            marginLeft: 8,
                            fontSize: "1.2rem",
                          }}
                          color="success"
                        />
                      )}
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
        ) : contest.isLive && !contest.registeredUsers.includes(userId) ? (
          <Typography variant="h6" color="textSecondary" textAlign="center">
            Contest is live, but you are not registered.
          </Typography>
        ) : contest.isPublished && !contest.registeredUsers.includes(userId) ? (
          <Typography variant="h6" color="textSecondary" textAlign="center">
            Contest has not started, and you have not registered for the
            contest.
          </Typography>
        ) : (
          <Typography variant="h6" color="textSecondary" textAlign="center">
            Contest has not started. You are registered, please come back later.
          </Typography>
        )}
      </div>
    </div>
  );
}

export default ContestDetail;
