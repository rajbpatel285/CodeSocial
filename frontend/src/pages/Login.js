import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  Alert,
} from "@mui/material";

function Login() {
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    // Enable the button if both fields have a value
    const isDataValid = emailOrUsername && password;
    setIsButtonDisabled(!isDataValid);
  }, [emailOrUsername, password]);

  async function submit(e) {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        emailOrUsername,
        password,
      });

      if (response.data === "exist") {
        localStorage.setItem("userId", emailOrUsername); // Store the login identifier in local storage
        navigate("/home", { state: { id: emailOrUsername } });
      } else {
        if (response.data === "incorrect password") {
          setErrorMessage("Password is incorrect");
        } else if (response.data === "notexist") {
          setErrorMessage("User not found");
        }
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error(error);
    }
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: "10%",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Box
        sx={{
          width: "400px",
          padding: "20px",
          border: 1,
          borderColor: "grey.300",
          borderRadius: "4px",
          background: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ textAlign: "center", mb: 3 }}
        >
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={submit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="emailOrUsername"
            label="Email Address or Username"
            name="emailOrUsername"
            autoComplete="emailOrUsername"
            autoFocus
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={isButtonDisabled}
          >
            Sign In
          </Button>
          {errorMessage && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Don't have an account?
        </Typography>
        <MuiLink
          component={Link}
          to="/signup"
          variant="body2"
          sx={{
            display: "block",
            textAlign: "center",
            textDecoration: "none",
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Sign Up
        </MuiLink>
      </Box>
    </Container>
  );
}

export default Login;