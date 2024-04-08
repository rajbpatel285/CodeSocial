import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import axios from "axios";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";

function Home() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [username, setUsername] = useState("");
  const [contests, setContests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get("http://localhost:8000/contest");
        const publishedContests = response.data
          .filter((contest) => contest.isPublished)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        setContests(publishedContests);
      } catch (error) {
        console.error("Failed to fetch contests", error);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/question/questions"
        );
        const publishedQuestions = response.data
          .filter((question) => question.isPublished)
          .sort((a, b) => a.difficulty - b.difficulty)
          .slice(0, 3);
        setQuestions(publishedQuestions);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/users");
        const topUsers = response.data.slice(0, 3);
        setUsers(topUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/profile/${userId}`
        );
        setUsername(response.data.username); // Assuming the response data has a username field
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }

    fetchContests();
    fetchQuestions();
    fetchUsers();
  }, [userId]);

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
        <Typography variant="h5" style={{ marginTop: "20px" }}>
          <b>Welcome</b>,{" "}
          <Link
            to={`/userprofile/${userId}`}
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
            {username}
          </Link>
        </Typography>
        <div style={{ textAlign: "center" }}>
          <img
            src={process.env.PUBLIC_URL + "/images/poster_image.png"}
            alt="CodeSocial Home page poster"
            style={{ marginBottom: "20px" }}
          />
        </div>
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            // textAlign: "center",
          }}
        >
          Upcoming Contests
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "70%" }}
                >
                  Contest Name
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                >
                  Level
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "15%" }}
                >
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contests.map((contest) => (
                <TableRow
                  key={contest.contestId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    style={{ ...cellStyle, width: "70%" }}
                    component="th"
                    scope="row"
                  >
                    <Link
                      to={`/contestdetail/${contest.contestId}`}
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
                      {contest.contestName}
                    </Link>
                  </TableCell>
                  <TableCell style={{ ...cellStyle, width: "15%" }}>
                    {contest.level}
                  </TableCell>
                  <TableCell style={{ ...cellStyle, width: "15%" }}>
                    {new Date(contest.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/contests")}
          >
            <ReadMoreIcon style={{ marginRight: "5px" }} />
            See More
          </Button>
        </div>
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            // textAlign: "center",
          }}
        >
          Questions
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "80%" }}
                >
                  Question
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, width: "20%", fontWeight: "bold" }}
                  align="center"
                >
                  Difficulty
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.questionId}>
                  <TableCell component="th" scope="row" style={cellStyle}>
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
                  <TableCell style={cellStyle} align="center">
                    {question.difficulty}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/problemset")}
          >
            <ReadMoreIcon style={{ marginRight: "5px" }} />
            See More
          </Button>
        </div>
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            // textAlign: "center",
          }}
        >
          User Standings
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ ...cellStyle, fontWeight: "bold" }}>
                  Username
                </TableCell>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold" }}
                  align="center"
                >
                  Rating
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row" style={cellStyle}>
                    <Link
                      to={`/userprofile/${user.username}`}
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
                      {user.username}
                    </Link>
                  </TableCell>
                  <TableCell style={cellStyle} align="center">
                    {user.rating}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/standings")}
          >
            <ReadMoreIcon style={{ marginRight: "5px" }} />
            See More
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
