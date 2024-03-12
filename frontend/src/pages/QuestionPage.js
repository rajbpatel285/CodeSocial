import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, TextField, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import TopAppBar from "../components/TopAppBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import axios from "axios";
import { Navigate } from "react-router-dom";

function QuestionPage() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [executionResult, setExecutionResult] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [testResult, setTestResult] = useState("");
  const [inputValues, setInputValues] = useState({});

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

  const handleInputChange = (e, inputName) => {
    setInputValues({
      ...inputValues,
      [inputName]: e.target.value,
    });
  };

  const handleTestCode = async () => {
    try {
      const inputsArray = question.inputVariableTypeData.map(
        (inputVar) => inputValues[inputVar.inputVariableName]
      );

      const response = await axios.post(
        "http://localhost:8000/question/executePython",
        {
          code: userCode,
          inputs: inputsArray,
        }
      );
      setExecutionResult(response.data.output.trim());
      setTestResult(
        response.data.output.trim() === expectedOutput.trim()
          ? "passed"
          : "failed"
      );
    } catch (error) {
      console.error(
        "Error testing code:",
        error.response ? error.response.data : error
      );
      setExecutionResult("Error executing code. Please try again.");
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
        <TextField
          label="Write Your Code here..."
          multiline
          rows={8}
          variant="outlined"
          fullWidth
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Typography
          variant="body1"
          style={{
            whiteSpace: "pre-line",
            fontWeight: "bold",
          }}
        >
          Test with Custom Input:
        </Typography>
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          {question.inputVariableTypeData.map((inputVar, index) => (
            <TextField
              key={index}
              label={inputVar.inputVariableName}
              variant="outlined"
              value={inputValues[inputVar.inputVariableName] || ""}
              onChange={(e) => handleInputChange(e, inputVar.inputVariableName)}
              style={{ marginBottom: "10px" }}
            />
          ))}
          <TextField
            label="Expected Output"
            variant="outlined"
            value={expectedOutput}
            onChange={(e) => setExpectedOutput(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTestCode}
          style={{ marginRight: "10px" }}
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
        {executionResult && (
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              Execution Result with Custom Input:
            </Typography>
            {Object.entries(inputValues).map(([key, value], index) => (
              <Typography variant="body2" key={index}>
                {key}: {value}
              </Typography>
            ))}
            <Typography variant="body2">
              Expected Output: {expectedOutput}
            </Typography>
            <Typography variant="body2">
              Returned Output: {executionResult}
            </Typography>
            {testResult &&
              (testResult === "passed" ? (
                <Typography variant="body1" color="green">
                  <CheckCircleOutlineIcon color="success" /> Passed
                </Typography>
              ) : (
                <Typography variant="body1" color="red">
                  <CancelIcon color="error" /> Failed
                </Typography>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionPage;
