import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
} from "@mui/material";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/auth/signup", {
        email,
        password,
      });

      if (response.data === "exist") {
        alert("User already exists");
      } else if (response.data === "notexist") {
        localStorage.setItem("userId", email);
        navigate("/home", { state: { id: email } });
      }
    } catch (error) {
      alert("Wrong details");
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign up
          </Button>
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
            // mt: 2,
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
