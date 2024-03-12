import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
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
  TableSortLabel,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AdminTopAppBar from "../../components/AdminTopAppBar";
import AdminSecondaryNavbar from "../../components/AdminSecondaryNavbar";
import axios from "axios";

function AdminProblemSet() {
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [order, setOrder] = useState("asc");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [inputVariableTypeData, setInputVariableTypeData] = useState([
    { inputVariableName: "", inputVariableType: "" },
  ]);
  const [testCases, setTestCases] = useState([{ inputs: [], output: "" }]);

  useEffect(() => {
    fetchQuestions();
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

  const handleSort = () => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    const sortedQuestions = questions.sort((a, b) => {
      return isAsc ? b.difficulty - a.difficulty : a.difficulty - b.difficulty;
    });
    setQuestions([...sortedQuestions]);
  };

  if (!userId || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/question/questions",
        {
          questionTitle,
          question: questionText,
          inputVariableTypeData,
          testCases,
          difficulty: difficulty,
          isPublished: true,
        }
      );
      setQuestions([...questions, response.data]);
      setOpen(false);
      setQuestionTitle("");
      setQuestionText("");
      setDifficulty("");
      setInputVariableTypeData([
        { inputVariableName: "", inputVariableType: "" },
      ]);
      setTestCases([{ inputs: [], output: "" }]);
      setAlertMessage(
        `Question "${response.data.questionTitle}" added successfully`
      );
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      console.error("Error adding question:", error);
      setAlertMessage("Failed to add question");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };

  const handleInputVariableTypeDataChange = (index, field) => (event) => {
    const newInputVariableTypeData = [...inputVariableTypeData];
    newInputVariableTypeData[index][field] = event.target.value;
    setInputVariableTypeData(newInputVariableTypeData);
  };

  const addInputVariableTypeDataField = () => {
    setInputVariableTypeData([
      ...inputVariableTypeData,
      { inputVariableName: "", inputVariableType: "" },
    ]);
  };

  const removeInputVariableTypeDataField = (index) => {
    const newInputVariableTypeData = inputVariableTypeData.filter(
      (_, i) => i !== index
    );
    setInputVariableTypeData(newInputVariableTypeData);
  };

  const handleTestCaseOutputChange = (testIndex, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[testIndex].output = value;
    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    const newTestCase = {
      inputs: inputVariableTypeData.map((variable) => ({
        key: variable.inputVariableName,
        value: "",
      })),
      output: "",
    };
    setTestCases([...testCases, newTestCase]);
  };

  const handleTestCaseInputChange = (
    testIndex,
    inputIndex,
    keyOrValue,
    newValue
  ) => {
    const updatedTestCases = [...testCases];
    if (keyOrValue === "value") {
      updatedTestCases[testIndex].inputs[inputIndex].value = newValue;
    } else {
      updatedTestCases[testIndex].inputs[inputIndex].key = newValue;
    }
    setTestCases(updatedTestCases);
  };

  const removeTestCase = (testIndex) => {
    const updatedTestCases = testCases.filter(
      (_, index) => index !== testIndex
    );
    setTestCases(updatedTestCases);
  };

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
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Problem Set
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          style={{ marginBottom: "20px" }}
        >
          Add Question
        </Button>
        {showAlert && (
          <Alert
            onClose={() => setShowAlert(false)}
            severity={alertMessage.includes("added") ? "success" : "error"}
            style={{ marginBottom: "20px" }}
          >
            {alertMessage}
          </Alert>
        )}
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ ...cellStyle, fontWeight: "bold", width: "85%" }}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow
                  key={question.questionId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    style={{ ...cellStyle, width: "85%" }}
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
                    style={{ ...cellStyle, width: "15%" }}
                    align="center"
                  >
                    {question.difficulty}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              id="question"
              label="Question Statement"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <b>Input Variables: </b>
            </Typography>
            {inputVariableTypeData.map((test, index) => (
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
                  onChange={handleInputVariableTypeDataChange(
                    index,
                    "inputVariableName"
                  )}
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
                    onChange={handleInputVariableTypeDataChange(
                      index,
                      "inputVariableType"
                    )}
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
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
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
            {testCases.map((testCase, testIndex) => (
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
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminProblemSet;
