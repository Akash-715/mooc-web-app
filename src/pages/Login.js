// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import bgLogin from "../assets/coffee-login-bg.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/signin", {
        loginId: email,
        password,
      });

      const { token } = res.data;
      const decoded = jwtDecode(token);
      const role = decoded.role;
      const userEmail = decoded.sub;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", userEmail);

      login({ email: userEmail }, role, token);

      if (role.toUpperCase() === "ADMIN") {
        navigate("/admin");
      } else {
        try {
          const profileStatusRes = await axios.get("/profile/status", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (profileStatusRes.data === true) {
            navigate("/user-dashboard");
          } else {
            navigate("/register");
          }
        } catch (err) {
          console.warn("Profile check failed:", err);
          navigate("/register");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      if (msg.toLowerCase().includes("not verified")) {
        alert("🔁 Email not verified. Sending OTP again...");
        try {
          await axios.post("/api/auth/request-otp", {
            email,
            purpose: "VERIFICATION",
          });
          navigate("/verify-otp", { state: { email, purpose: "VERIFICATION" } });
        } catch (otpErr) {
          console.error("Failed to resend OTP:", otpErr);
          setError("Failed to resend OTP. Please try again.");
        }
      } else {
        setError(msg);
      }
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${bgLogin})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Georgia, serif",
    color: "#4b3621",
    padding: "2rem",
  };

  const cardStyle = {
    backgroundColor: "#f8f1e7",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
    width: "100%",
    maxWidth: "500px",
  };

  const labelStyle = {
    color: "#6f4e37",
    fontWeight: "bold",
  };

  const linkStyle = {
    color: "#6f4e37",
    textDecoration: "underline",
  };

  return (
    <div style={backgroundStyle}>
      <Card className="p-4" style={cardStyle}>
        <h3 className="text-center mb-4" style={{ color: "#6f4e37" }}>
          🔐 Login
        </h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label style={labelStyle}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={labelStyle}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div style={{ textAlign: "right", marginBottom: "1rem" }}>
            <a href="/forgot-password" style={linkStyle}>
              Forgot password?
            </a>
          </div>

          <Button
            variant="dark"
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#6f4e37", border: "none" }}
          >
            Login
          </Button>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <p>
              Don&apos;t have an account? {" "}
              <a href="/signup" style={linkStyle}>
                Sign up here
              </a>
            </p>
          </div>
        </Form>
      </Card>
    </div>
  );
}
