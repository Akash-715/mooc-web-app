import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import coffeeBg from "../assets/coffee-resetpwd-bg.jpg";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { token, email } = location.state || {};

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/auth/reset-password",
        { email, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert("Failed to reset password.");
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
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "30vh", 
        fontFamily: "Georgia, serif", // optional: add any coffee-style font
      }}
    >
      <form
        onSubmit={handleReset}
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
        <h3 style={{ color: "#5C4033", textAlign: "center" }}>🔐 Reset Password</h3>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          Reset
        </button>
      </form>
    </div>
  );
}