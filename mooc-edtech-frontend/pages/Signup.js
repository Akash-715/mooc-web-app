import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";
import bgSignup from "../assets/coffee-signup-bg.png";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/signup", {
        email,
        username,
        password,
        role: "user",
        authProvider: "local"
      });

      navigate("/verify-otp", { state: { email } });

    } catch (err) {
      console.error("Signup error:", err.response?.data);
      const rawMsg = err.response?.data?.message || "";
      if (rawMsg.includes("password") && rawMsg.includes("Pattern")) {
        setError(
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
        );
      } else {
        setError(rawMsg || "Signup failed");
      }
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${bgSignup})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    paddingTop: "5rem",
    paddingBottom: "5rem",
    fontFamily: "Georgia, serif",
    color: "#4b3621"
  };

  const cardStyle = {
    backgroundColor: "#fef7f1",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    border: "none"
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "500px", ...cardStyle }}>
          <h3 className="text-center mb-4" style={{ color: "#6f4e37" }}>📨 Signup</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100">
              Signup & Get OTP
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
}