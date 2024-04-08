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
import HowToRegIcon from "@mui/icons-material/HowToReg";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordValidationMessage, setPasswordValidationMessage] =
    useState("");

  useEffect(() => {
    const isDataFilled = email && password && username;

    const isPasswordsMatch = confirmPassword && password === confirmPassword;

    setIsButtonDisabled(
      !(isDataFilled && (isPasswordsMatch || !confirmPassword))
    );

    setPasswordError(
      confirmPassword && !isPasswordsMatch ? "Passwords do not match" : ""
    );

    validateEmail();
    validatePassword();
  }, [email, password, confirmPassword, username]);

  const validateEmail = () => {
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (password && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password)) {
      setPasswordValidationMessage(
        "Password must contain at least 8 characters, one uppercase, one number and one symbol."
      );
    } else if (password && password.length < 8) {
      setPasswordValidationMessage("Password must be at least 8 characters.");
    } else {
      setPasswordValidationMessage("");
    }
  };

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
        setErrorMessage("An account with this email already exists.");
      } else if (response.data === "username unavailable") {
        setErrorMessage("Username is already taken.");
      } else if (response.data === "notexist") {
        localStorage.setItem("userId", email);
        localStorage.setItem("isAdmin", response.data.isAdmin);
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
        justifyContent: "flex-end",
        alignItems: "center",
        height: "100vh",
        paddingRight: "10%",
        backgroundImage: `url(${
          process.env.PUBLIC_URL + "/images/login_bg_image.png"
        })`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          width: "400px",
          padding: "20px",
          borderRadius: "4px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/images/logo.png"}
          alt="CodeSocial Logo"
          style={{ maxWidth: "25%" }}
        />
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
            error={!!emailError}
            helperText={emailError}
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
            error={!!passwordValidationMessage}
            helperText={passwordValidationMessage}
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
            <HowToRegIcon style={{ marginRight: "5px" }} />
            Sign up
          </Button>
          {errorMessage && (
            <Alert severity="error" sx={{ width: "85%", mx: 2 }}>
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
          to="/"
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
