import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  const [customTestResult, setCustomTestResult] = useState("");
  const [submitTestResult, setSubmitTestResult] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [programmingLanguage, setProgrammingLanguage] = useState("");

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
    const apiEndpoint =
      programmingLanguage === "python" ? "executePython" : "executeJava";

    try {
      const inputsArray = question.inputVariableTypeData.map(
        (inputVar) => inputValues[inputVar.inputVariableName]
      );

      const response = await axios.post(
        `http://localhost:8000/question/${apiEndpoint}`,
        {
          code: userCode,
          inputs: inputsArray,
        }
      );
      setExecutionResult(response.data.output.trim());
      setCustomTestResult(
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

  const handleSubmit = async () => {
    const apiEndpoint =
      programmingLanguage === "python" ? "executePython" : "executeJava";
    let allPassed = true;
    const results = [];

    for (const testCase of question.testCases) {
      const inputsArray = testCase.inputs.map((input) => input.value);
      try {
        const response = await axios.post(
          `http://localhost:8000/question/${apiEndpoint}`,
          {
            code: userCode,
            inputs: inputsArray,
          }
        );
        const passed = response.data.output.trim() === testCase.output.trim();
        results.push({
          ...testCase,
          passed,
          returnedOutput: response.data.output.trim(),
        });
        allPassed &= passed;
      } catch (error) {
        console.error("Error testing code:", error);
        allPassed = false;
        results.push({
          ...testCase,
          passed: false,
          returnedOutput: "Error executing code. Please try again.",
        });
      }
    }

    setTestCaseResults(results);
    setExpanded(false);
    setSubmitTestResult(allPassed ? "passed" : "failed");
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
        <FormControl style={{ marginBottom: "20px", width: "20%" }}>
          <InputLabel id="programming-language-label">
            Programming Language
          </InputLabel>
          <Select
            labelId="programming-language-label"
            id="programmingLanguage"
            value={programmingLanguage}
            label="Programming Language"
            onChange={(e) => setProgrammingLanguage(e.target.value)}
          >
            <MenuItem value={"python"}>Python</MenuItem>
            <MenuItem value={"java"}>Java</MenuItem>
          </Select>
        </FormControl>
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
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              Test with Custom Input
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              {question.inputVariableTypeData.map((inputVar, index) => (
                <TextField
                  key={index}
                  label={inputVar.inputVariableName}
                  variant="outlined"
                  value={inputValues[inputVar.inputVariableName] || ""}
                  onChange={(e) =>
                    handleInputChange(e, inputVar.inputVariableName)
                  }
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
              style={{ marginTop: "10px" }}
              disabled={!programmingLanguage}
            >
              Test{" "}
              {programmingLanguage === "python"
                ? "Python Code"
                : programmingLanguage === "java"
                ? "Java Code"
                : ""}
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
                {customTestResult &&
                  (customTestResult === "passed" ? (
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
          </AccordionDetails>
        </Accordion>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: "10px" }}
          disabled={!programmingLanguage}
        >
          Submit{" "}
          {programmingLanguage === "python"
            ? "Python Code"
            : programmingLanguage === "java"
            ? "Java Code"
            : ""}
        </Button>
        {submitTestResult && (
          <div style={{ marginTop: "20px" }}>
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              Execution Result:
              {submitTestResult &&
                (submitTestResult === "passed" ? (
                  <Typography variant="body1" color="green">
                    <CheckCircleOutlineIcon color="success" /> Passed
                  </Typography>
                ) : (
                  <Typography variant="body1" color="red">
                    <CancelIcon color="error" /> Failed
                  </Typography>
                ))}
            </Typography>
            <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
              {testCaseResults.map((result, index) => (
                <div
                  key={index}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Test Case {index + 1}
                  </Typography>
                  <div>
                    <Typography variant="body2">
                      {result.inputs
                        .map((input) => `${input.key}: ${input.value}`)
                        .join(", ")}
                    </Typography>
                    <Typography variant="body2">
                      Expected Output: {result.output}
                    </Typography>
                    <Typography variant="body2">
                      Returned Output: {result.returnedOutput}
                    </Typography>
                    {result.passed ? (
                      <Typography variant="body1" color="green">
                        <CheckCircleOutlineIcon color="success" /> Passed
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="red">
                        <CancelIcon color="error" /> Failed
                      </Typography>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionPage;
