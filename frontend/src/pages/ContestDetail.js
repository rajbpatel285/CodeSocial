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
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";

function ContestDetail() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/contest/${contestId}`
        );
        setContest(data);
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
          <b>Date:</b> {new Date(contest.date).toLocaleDateString()}
        </Typography>
        <Typography
          variant="body2"
          style={{ whiteSpace: "pre-line", marginBottom: "10px" }}
        >
          {contest.description}
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
      </div>
    </div>
  );
}

export default ContestDetail;
