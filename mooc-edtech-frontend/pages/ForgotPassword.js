import React, { useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import coffeeBg from "../assets/coffee-forgotpwd-bg.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/request-otp", { email });
      navigate("/verify-otp", { state: { email, purpose: "PASSWORD_RESET" } });
    } catch (err) {
      setMessage("Failed to send OTP. Please check your email.");
    }
  };

  return (
    <div
  style={{
    backgroundImage: `url(${coffeeBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "flex-end",      // right-align
    alignItems: "flex-end",          // bottom-align
    paddingRight: "20vw",             // space from right edge
    paddingBottom: "40vh",            // space from bottom edge
    fontFamily: "Georgia, serif",
  }}
>


      <form
        onSubmit={handleRequestOtp}
        style={{
          backgroundColor: "rgba(255, 248, 240, 0.95)",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "300px",
        }}
      >
        <h3 style={{ color: "#5C4033", textAlign: "center" }}>☕ Forgot Password</h3>
        <input
          type="email"
          placeholder="Enter registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "0.6rem",
            borderRadius: "6px",
            border: "1px solid #bfa88f",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#6f4e37",
            color: "#fff",
            border: "none",
            padding: "0.6rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Send OTP
        </button>
        <p style={{ color: "#8B4513", textAlign: "center" }}>{message}</p>
      </form>
    </div>
  );
}