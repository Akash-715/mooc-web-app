import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import coffeebgImage from "../assets/coffee-feedback-bg.png";

export default function Feedback() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("recommendedCourses");
    if (stored) {
      const courses = JSON.parse(stored);
      setRecommendedCourses(courses);
      setFeedbacks(courses.map(() => ({ rating: "", comments: "", enrolled: false })));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = [...feedbacks];
    updated[currentStep][name] = type === "checkbox" ? checked : value;
    setFeedbacks(updated);
  };

  const handleNext = () => {
    if (!feedbacks[currentStep].rating) {
      alert("Please provide a rating before continuing.");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const payload = {
      courseFeedbacks: recommendedCourses.map((course, index) => ({
        courseId: course.id,
        rating: parseInt(feedbacks[index].rating),
        enrolled: feedbacks[index].enrolled,
        comments: feedbacks[index].comments || "",
      })),
    };

    try {
      const res = await fetch("http://localhost:8080/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        console.error("Failed to submit feedback");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  if (recommendedCourses.length === 0) {
    return (
      <div className="text-center mt-5">
        <h4>No recommended courses found.</h4>
        <p>Please complete the quiz first.</p>
      </div>
    );
  }

  const backgroundStyle = {
    backgroundImage: `url(${coffeebgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    paddingTop: "5rem",
    paddingBottom: "5rem",
    fontFamily: "Georgia, serif",
    color: "#4b3621",
  };

  const cardStyle = {
    backgroundColor: "#f8f1e7",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    maxWidth: "700px",
    margin: "0 auto",
  };

  const labelStyle = {
    fontWeight: "bold",
    color: "#6f4e37",
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        <Card style={cardStyle}>
          <Card.Body>
            <h2 className="text-center mb-4" style={{ color: "#6f4e37" }}>
              📣 Feedback
            </h2>

            {submitted ? (
              <Alert variant="success" className="text-center fw-semibold">
                Thank you for your feedback <br />
                Redirecting you home... 🏠
              </Alert>
            ) : (
              <Form>
                <h5 className="mb-3 text-center">
                  {recommendedCourses[currentStep].title}
                </h5>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>
                    1. How would you rate this recommendation?
                  </Form.Label>
                  <Form.Select
                    name="rating"
                    value={feedbacks[currentStep].rating}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select rating --</option>
                    <option value="5">⭐ 5 - Excellent</option>
                    <option value="4">⭐ 4 - Good</option>
                    <option value="3">⭐ 3 - Average</option>
                    <option value="2">⭐ 2 - Below Avg</option>
                    <option value="1">⭐ 1 - Poor</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="I have enrolled in this course"
                    name="enrolled"
                    checked={feedbacks[currentStep].enrolled}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={labelStyle}>
                    2. Any additional comments? (Optional)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="comments"
                    rows={3}
                    value={feedbacks[currentStep].comments}
                    onChange={handleChange}
                    placeholder="Your thoughts ☕"
                  />
                </Form.Group>

                <div className="text-center">
                  {currentStep < recommendedCourses.length - 1 ? (
                    <Button variant="dark" onClick={handleNext}>
                      Next ➡
                    </Button>
                  ) : (
                    <Button variant="dark" onClick={handleSubmit}>
                      Submit Feedback 💌
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
