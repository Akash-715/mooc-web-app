import React, { useEffect, useRef, useState } from "react";
import axios from "../utils/axiosConfig";
import { Card, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [savedCourseIds, setSavedCourseIds] = useState(new Set());
  const hasFetched = useRef(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    const payload = JSON.parse(localStorage.getItem("quizPayload"));
    if (!token || !payload) {
      setError("Missing data. Please complete the quiz or login.");
      return;
    }

    try {
      const response = await axios.post(
        "/courses/filter",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRecommendations(response.data);
      localStorage.setItem("recommendedCourses", JSON.stringify(response.data));
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to load recommendations.");
    }
  };

  const checkSavedCourses = async () => {
    try {
      const res = await axios.get("/saved-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const saved = res.data || [];
      const savedIds = new Set(saved.map((c) => c.courseId));
      setSavedCourseIds(savedIds);
    } catch (err) {
      console.warn("Could not fetch saved courses.");
    }
  };

  const saveCourse = async (courseId) => {
    const userId = localStorage.getItem("userId");
    if (!userId || !token) return alert("Please login to save courses.");

    if (savedCourseIds.has(courseId)) {
      alert("Course already saved.");
      return;
    }

    try {
      await axios.post(`/saved-courses?courseId=${courseId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedCourseIds((prev) => new Set(prev).add(courseId));
      alert("Course saved!");
    } catch (err) {
      console.error("Failed to save course", err);
      alert("Failed to save course.");
    }
  };

  const unsaveCourse = async (courseId) => {
    try {
      await axios.delete(`/saved-courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = new Set(savedCourseIds);
      updated.delete(courseId);
      setSavedCourseIds(updated);
    } catch (err) {
      console.error("Failed to unsave course", err);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchRecommendations();
      checkSavedCourses();
    }
  }, [token]);

  const handleGiveFeedback = () => {
    navigate("/feedback");
  };

  const handleRetakeQuiz = () => {
    navigate("/quiz");
  };

  const downloadCSV = () => {
    const csvHeader = "Title,Description,Platform,Duration,URL\n";
    const csvRows = recommendations.map((c) =>
      [
        `"${c.title}"`,
        `"${c.description}"`,
        c.platform,
        c.duration,
        c.url
      ].join(",")
    );
    const csvContent = csvHeader + csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recommendations.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        backgroundColor: "#f6f1e7",
        minHeight: "100vh",
        paddingTop: "2rem",
        fontFamily: "Georgia, serif",
        color: "#4b3621",
      }}
    >
      <div className="container">
        <h2 style={{ color: "#6f4e37", textAlign: "center" }}>
          Recommended Courses for You ☕
        </h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <div className="row mt-4">
          {recommendations.length === 0 ? (
            <p className="text-center text-muted">
              No available courses to recommend for now. Please come back later.
            </p>
          ) : (
            recommendations.map((course) => (
              <div key={course.id} className="col-md-4">
                <Card
                  className="mb-4 shadow-sm"
                  style={{
                    backgroundColor: "#fffaf3",
                    border: "1px solid #e0d7c6",
                    borderRadius: "12px",
                  }}
                >
                  {course.imageUrl && (
                    <Card.Img
                      variant="top"
                      src={course.imageUrl}
                      alt={course.title}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{course.title}</Card.Title>
                    <Card.Text>{course.description}</Card.Text>
                    <p>
                      <strong>Platform:</strong> {course.platform}
                    </p>
                    <p>
                      <strong>Duration:</strong> {course.duration}
                    </p>

                    <div className="d-flex flex-column gap-2 mt-3">
                      <div className="d-flex justify-content-between">
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-dark"
                        >
                          Visit Course
                        </a>

                        {savedCourseIds.has(course.id) ? (
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => unsaveCourse(course.id)}
                          >
                            Unsave
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-success"
                            onClick={() => saveCourse(course.id)}
                          >
                            Save
                          </button>
                        )}
                      </div>

                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          const shareUrl = `http://localhost:8080/courses/share/${course.id}`;
                          window.open(shareUrl, "_blank");
                        }}
                      >
                        📤 Share
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          )}
        </div>

        {recommendations.length > 0 && (
          <div className="text-center mt-4 d-flex flex-column gap-3">
            <Button
              style={{
                backgroundColor: "#6f4e37",
                border: "none",
                fontFamily: "Georgia, serif",
              }}
              onClick={handleGiveFeedback}
            >
              Give Feedback
            </Button>

            <Button variant="outline-secondary" onClick={handleRetakeQuiz}>
              🔁 Retake Quiz
            </Button>

            <Button variant="outline-dark" onClick={downloadCSV}>
              ⬇ Download as CSV
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
