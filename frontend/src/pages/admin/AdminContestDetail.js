import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
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
  DialogContentText,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
    inputVariableTypeData: [{ inputVariableName: "", inputVariableType: "" }],
    difficulty: "",
    testCases: [{ inputs: [], output: "" }],
    isPublished: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateContest, setUpdateContest] = useState({
    contestName: "",
    description: "",
    level: "",
    date: "",
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchContestDetails();
    if (location.state && location.state.message) {
      setAlertMessage(location.state.message);
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [contestId]);

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
        inputVariableTypeData: [
          { inputVariableName: "", inputVariableType: "" },
        ],
        difficulty: "",
        testCases: [{ inputs: [], output: "" }],
      });
    } catch (error) {
      console.error("Failed to add question to contest", error);
    }
  };

  const handleInputVariableTypeDataChange = (index, field, value) => {
    setNewQuestion((prevNewQuestion) => {
      const updatedInputVariableTypeData = [
        ...prevNewQuestion.inputVariableTypeData,
      ];

      updatedInputVariableTypeData[index] = {
        ...updatedInputVariableTypeData[index],
        [field]: value,
      };

      return {
        ...prevNewQuestion,
        inputVariableTypeData: updatedInputVariableTypeData,
      };
    });
  };

  const addInputVariableTypeDataField = () => {
    setNewQuestion((prevNewQuestion) => ({
      ...prevNewQuestion,
      inputVariableTypeData: [
        ...prevNewQuestion.inputVariableTypeData,
        { inputVariableName: "", inputVariableType: "" },
      ],
    }));
  };

  const removeInputVariableTypeDataField = (index) => {
    setNewQuestion((prevNewQuestion) => ({
      ...prevNewQuestion,
      inputVariableTypeData: prevNewQuestion.inputVariableTypeData.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleTestCaseInputChange = (
    testIndex,
    inputIndex,
    field,
    newValue
  ) => {
    setNewQuestion((prev) => ({
      ...prev,
      testCases: prev.testCases.map((testCase, idx) =>
        idx === testIndex
          ? {
              ...testCase,
              inputs: testCase.inputs.map((input, i) =>
                i === inputIndex
                  ? {
                      ...input,
                      [field]: newValue,
                    }
                  : input
              ),
            }
          : testCase
      ),
    }));
  };

  const handleTestCaseOutputChange = (testIndex, newValue) => {
    setNewQuestion((prev) => ({
      ...prev,
      testCases: prev.testCases.map((testCase, idx) =>
        idx === testIndex
          ? {
              ...testCase,
              output: newValue,
            }
          : testCase
      ),
    }));
  };

  const addTestCase = () => {
    setNewQuestion((prev) => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        {
          inputs: prev.inputVariableTypeData.map((variable) => ({
            key: variable.inputVariableName,
            value: "",
          })),
          output: "",
        },
      ],
    }));
  };

  const removeTestCase = (testIndex) => {
    setNewQuestion((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, idx) => idx !== testIndex),
    }));
  };

  const handleUpdateContest = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/contest/${contestId}`,
        updateContest
      );
      setUpdateDialogOpen(false);
      fetchContestDetails();
      setAlertMessage(
        `Contest "${response.data.contest.contestName}" updated successfully`
      );
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
    } catch (error) {
      console.error("Failed to update contest", error);
    }
  };

  const handleOpenUpdateDialog = () => {
    setUpdateDialogOpen(true);
    setUpdateContest({
      contestName: contest.contestName,
      description: contest.description,
      level: contest.level,
      date: contest.date.slice(0, 10),
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateContest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePublishContest = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/contest/${contestId}/publish`
      );
      navigate("/admincontests", {
        replace: true,
        state: {
          message: `Contest "${response.data.contest.contestName}" ${
            response.data.message.includes("published")
              ? "published"
              : "withdrawn"
          }`,
        },
      });
    } catch (error) {
      console.error("Failed to publish contest", error);
    }
  };

  const handleDeleteContest = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/contest/${contestId}`
      );
      navigate("/admincontests", {
        replace: true,
        state: {
          message: `Contest "${response.data.contest.contestName}" deleted`,
        },
      });
    } catch (error) {
      console.error("Failed to delete contest", error);
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
      <div style={{ margin: "0 5% 2% 5%" }}>
        {alertMessage && (
          <Alert
            severity={alertMessage.includes("deleted") ? "error" : "success"}
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
          variant="body"
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
          style={{ marginRight: "10px" }}
        >
          Add Question
        </Button>
        <Button
          variant="contained"
          onClick={handlePublishContest}
          sx={{
            backgroundColor: contest.isPublished ? "#d32f2f" : "#2e7d32",
            "&:hover": {
              backgroundColor: contest.isPublished ? "#9a0007" : "#1b5e20",
            },
          }}
          style={{ marginRight: "10px" }}
        >
          {contest.isPublished ? "Withdraw Contest" : "Publish Contest"}
        </Button>
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
              label="Question Statement"
              type="text"
              fullWidth
              multiline
              minRows={3}
              value={newQuestion.question}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, question: e.target.value })
              }
            />
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <b>Input Variables: </b>
            </Typography>
            {newQuestion.inputVariableTypeData.map((test, index) => (
              <div
                key={index}
                style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
              >
                <TextField
                  label="Input Variable Name"
                  type="text"
                  fullWidth
                  margin="dense"
                  value={test.inputVariableName}
                  onChange={(e) =>
                    handleInputVariableTypeDataChange(
                      index,
                      "inputVariableName",
                      e.target.value
                    )
                  }
                  style={{ flex: 1 }}
                />

                <FormControl fullWidth margin="dense" style={{ flex: 1 }}>
                  <InputLabel id="input-variable-type-label">
                    Input Variable Type
                  </InputLabel>
                  <Select
                    labelId="input-variable-type-label"
                    id="inputVariableType"
                    value={test.inputVariableType}
                    onChange={(e) =>
                      handleInputVariableTypeDataChange(
                        index,
                        "inputVariableType",
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value={"Integer"}>Integer</MenuItem>
                    <MenuItem value={"Array"}>Array</MenuItem>
                    <MenuItem value={"String"}>String</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  onClick={() => removeInputVariableTypeDataField(index)}
                  size="small"
                >
                  <CloseIcon />
                </Button>
              </div>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={addInputVariableTypeDataField}
              style={{ marginBottom: "20px" }}
            >
              Add Test Input Variable
            </Button>

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
              </Select>
            </FormControl>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <b>Test Cases: </b>
            </Typography>
            {newQuestion.testCases.map((testCase, testIndex) => (
              <div
                key={testIndex}
                style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
              >
                {testCase.inputs.map((input, inputIndex) => (
                  <TextField
                    key={inputIndex}
                    label={input.key}
                    type="text"
                    margin="dense"
                    value={input.value}
                    onChange={(e) =>
                      handleTestCaseInputChange(
                        testIndex,
                        inputIndex,
                        "value",
                        e.target.value
                      )
                    }
                    style={{ marginRight: 8 }}
                  />
                ))}
                <TextField
                  label="Output"
                  type="text"
                  margin="dense"
                  value={testCase.output}
                  onChange={(e) =>
                    handleTestCaseOutputChange(testIndex, e.target.value)
                  }
                  style={{ marginRight: 8 }}
                />
                <Button onClick={() => removeTestCase(testIndex)}>
                  <CloseIcon />
                </Button>
              </div>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={addTestCase}
              style={{ marginBottom: "20px" }}
            >
              Add Test Case
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddQuestionToContest}>Add</Button>
          </DialogActions>
        </Dialog>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setDeleteDialogOpen(true)}
          style={{ marginRight: "10px" }}
        >
          Delete Contest
        </Button>
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Contest</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this contest? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteContest} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenUpdateDialog}
          style={{ marginRight: "10px" }}
        >
          Update Contest
        </Button>
        <Dialog
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
        >
          <DialogTitle>Update Contest</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="contestName"
              label="Contest Name"
              type="text"
              fullWidth
              value={updateContest.contestName}
              onChange={handleUpdateChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={updateContest.description}
              onChange={handleUpdateChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="level-label">Level</InputLabel>
              <Select
                labelId="level-label"
                name="level"
                id="level"
                value={updateContest.level}
                onChange={handleUpdateChange}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="date"
              label="Date"
              type="date"
              fullWidth
              value={updateContest.date}
              onChange={handleUpdateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateContest}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminContestDetail;
