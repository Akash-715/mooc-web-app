// src/pages/VerifyOtp.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";
import bgOtp from "../assets/coffee-otp-bg.png";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;
  const purpose = location.state?.purpose || "VERIFICATION"; // Default to VERIFICATION

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/verify-otp", {
        email,
        otp,
        purpose
      });

      if (purpose === "PASSWORD_RESET") {
        // Navigate to reset password page with token
        navigate("/reset-password", {
          state: {
            token: res.data.token,
            email,
          },
        });
      } else {
        alert("OTP verified! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${bgOtp})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    paddingTop: "80px",
    paddingBottom: "80px",
  };

  const cardStyle = {
    backgroundColor: "#fdf6ee",
    border: "1px solid #d3bfa3",
    borderRadius: "12px",
    color: "#4b3621",
    fontFamily: "Georgia, serif",
  };

  const headingStyle = {
    color: "#6f4e37",
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "500px", ...cardStyle }}>
          <h3 className="text-center mb-4" style={headingStyle}>🔑 Verify OTP</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleVerify}>
            <Form.Group className="mb-3">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
