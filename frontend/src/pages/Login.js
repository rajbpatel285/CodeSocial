import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });

      if (response.data === "exist") {
        navigate("/home", { state: { id: email } });
      } else if (response.data === "incorrect password") {
        alert("Password is incorrect");
      } else if (response.data === "notexist") {
        alert("User has not signed up");
      }
    } catch (error) {
      alert("Wrong details");
      console.error(error);
    }
  }

  const styles = {
    container: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      height: "100vh",
      paddingRight: "10%",
      background: "#f0f2f5", // This should be the background of your login page
    },
    formContainer: {
      width: "400px",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      background: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      fontSize: "24px",
      marginBottom: "20px",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      boxSizing: "border-box",
      border: "1px solid #ccc", // Added border
      borderRadius: "4px",
    },
    submitButton: {
      width: "100%",
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px 20px",
      margin: "10px 0",
      cursor: "pointer",
      border: "none",
      borderRadius: "5px",
    },
    orText: {
      textAlign: "center",
      fontSize: "16px",
      margin: "10px 0",
    },
    signupLink: {
      display: "block",
      textAlign: "center",
      textDecoration: "none",
      color: "#3498db",
      fontWeight: "bold",
      marginTop: "15px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.heading}>Login</h1>
        <form onSubmit={submit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>
            Sign in
          </button>
        </form>
        <p style={styles.orText}>OR</p>
        <Link to="/signup" style={styles.signupLink}>
          Signup
        </Link>
      </div>
    </div>
  );
}

export default Login;
