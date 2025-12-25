import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axiosConfig";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    educationLevel: "",
    primaryInterests: "",
    preferredPlatform: "",
    learningGoals: "",
    preferredDifficultyLevel: "",
    hobbies: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (role === "admin") {
      navigate("/admin");
    }
  }, [user, role, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem("email");

      const payload = {
        fullName: formData.fullName,
        email,
        phoneNumber: formData.phoneNumber,
        educationLevel: formData.educationLevel,
        preferredPlatform: formData.preferredPlatform,
        primaryInterests: formData.primaryInterests
          .split(",")
          .map((s) => s.trim()),
        learningGoals: formData.learningGoals,
        preferredDifficultyLevel: formData.preferredDifficultyLevel,
        hobbies: formData.hobbies.split(",").map((s) => s.trim()),
      };

      console.log("🚀 Sending profile to backend:", payload);

      await axios.post(`/profile`, payload);

      alert("Registration submitted successfully!");
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      alert(
        "Registration failed: " +
          (err.response?.data?.message || "Please try again")
      );
    }
  };

  return (
    <Container
      className="register-container my-5"
      style={{
        backgroundColor: "#f8f1e7",
        borderRadius: "12px",
        padding: "2rem",
        fontFamily: "Georgia, serif",
        color: "#4b3621",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <h2 className="text-center mb-3" style={{ color: "#6f4e37" }}>
        Student Registration
      </h2>
      <p className="text-muted fst-italic mb-4">
        Fields marked with <span className="text-danger">*</span> are mandatory.
      </p>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Full Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{ borderColor: "#6f4e37" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Phone Number <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                style={{ borderColor: "#6f4e37" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Education Level <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                required
                style={{ borderColor: "#6f4e37" }}
              >
                <option value="">-- Select --</option>
                <option value="School">School</option>
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Preferred Platform <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="preferredPlatform"
                value={formData.preferredPlatform}
                onChange={handleChange}
                required
                style={{ borderColor: "#6f4e37" }}
              >
                <option value="">-- Choose Platform --</option>
                <option value="Coursera">Coursera</option>
                <option value="Udemy">Udemy</option>
                <option value="edX">edX</option>
                <option value="Infosys Springboard">Infosys Springboard</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Primary Interests <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="primaryInterests"
                value={formData.primaryInterests}
                onChange={handleChange}
                placeholder="e.g. AI, Web Development"
                required
                style={{ borderColor: "#6f4e37" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Learning Goals <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="learningGoals"
                value={formData.learningGoals}
                onChange={handleChange}
                required
                style={{ borderColor: "#6f4e37" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Preferred Difficulty Level <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="preferredDifficultyLevel"
                value={formData.preferredDifficultyLevel}
                onChange={handleChange}
                required
                style={{ borderColor: "#6f4e37" }}
              >
                <option value="">-- Choose --</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hobbies (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                placeholder="e.g. Reading, Music, Gaming"
                style={{ borderColor: "#6f4e37" }}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button type="submit" variant="dark">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
}
