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

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const isDataFilled = email && password && username;

    const isPasswordsMatch = confirmPassword && password === confirmPassword;

    setIsButtonDisabled(
      !(isDataFilled && (isPasswordsMatch || !confirmPassword))
    );

    setPasswordError(
      confirmPassword && !isPasswordsMatch ? "Passwords do not match" : ""
    );
  }, [email, password, confirmPassword, username]);

  async function submit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/auth/signup", {
        email,
        username,
        password,
      });

      if (response.data === "exist") {
        setErrorMessage("User already exists");
      } else if (response.data === "notexist") {
        localStorage.setItem("userId", email);
        navigate("/home", { state: { id: email } });
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
          Sign Up
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={isButtonDisabled}
          >
            Sign up
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
          Have an account?
        </Typography>
        <MuiLink
          component={Link}
          to="/login"
          variant="body2"
          sx={{
            display: "block",
            textAlign: "center",
            textDecoration: "none",
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Sign In
        </MuiLink>
      </Box>
    </Container>
  );
}

export default Signup;
