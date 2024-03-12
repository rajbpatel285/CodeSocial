import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AdminTopAppBar from "../../components/AdminTopAppBar";
import AdminSecondaryNavbar from "../../components/AdminSecondaryNavbar";
import axios from "axios";

function AdminQuestionPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [open, setOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [inputVariableTypeData, setInputVariableTypeData] = useState([
    { inputVariableName: "", inputVariableType: "" },
  ]);
  const [testCases, setTestCases] = useState([{ inputs: [], output: "" }]);

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

  const handleOpenDialog = () => {
    setOpen(true);
    setQuestionTitle(question.questionTitle);
    setQuestionText(question.question);
    setInput(question.input);
    setOutput(question.output);
    setDifficulty(question.difficulty);
    setInputVariableTypeData(question.inputVariableTypeData);
    setTestCases(question.testCases);
  };

  const handleUpdateQuestion = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/question/questions/${questionId}`,
        {
          questionTitle,
          question: questionText,
          inputVariableTypeData,
          testCases,
          difficulty,
        }
      );
      setQuestion(response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/question/questions/${questionId}`
      );
      navigate(-1);
    } catch (error) {
      console.error("Error deleting question:", error);
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
          {question.questionTitle}
        </Typography>
        <Typography
          variant="body2"
          style={{ marginBottom: "10px", textAlign: "center" }}
        >
          <b>Difficulty:</b> {question.difficulty}
        </Typography>
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
          Test Cases:
        </Typography>
        {question.testCases.map((testCase, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <Typography variant="body2" style={{ fontWeight: "bold" }}>
              Case {index + 1}:
            </Typography>
            {testCase.inputs.map((input, inputIndex) => (
              <Typography key={inputIndex} variant="body2">
                {input.key}: {input.value}
              </Typography>
            ))}
            <Typography variant="body2">Output: {testCase.output}</Typography>
          </div>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          style={{ marginRight: "10px" }}
        >
          Update Question
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to delete this question?")
            ) {
              handleDeleteQuestion();
            }
          }}
        >
          Delete Question
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Update Question</DialogTitle>
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
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateQuestion}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminQuestionPage;
