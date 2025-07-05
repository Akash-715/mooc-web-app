import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Card, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { saveCourse } from "../utils/courseStorage";
import "./Recommendations.css";

export default function Recommendations() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const quizData = JSON.parse(localStorage.getItem("quizAnswers"));
        if (!quizData) {
          alert("No quiz answers found. Please take the quiz.");
          navigate("/quiz");
          return;
        }

        const payload = {
          tags: [quizData.interest],
          platforms: [quizData.preferredPlatform],
          difficulty: quizData.difficulty.toUpperCase(),
          duration: mapCourseLengthToEnum(quizData.courseLength),
        };

        const token = localStorage.getItem("token");
const response = await axios.post("/courses/filter", payload, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

        setCourses(response.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        alert("Failed to load course recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [navigate]);

  const mapCourseLengthToEnum = (length) => {
    if (length === "short") return "ONE_TO_FOUR_WEEKS";
    if (length === "medium") return "FOUR_TO_EIGHT_WEEKS";
    return "EIGHT_PLUS_WEEKS";
  };

  const filteredCourses = courses.filter(course => {
    const platformMatch = platformFilter ? course.platform === platformFilter : true;
    const difficultyMatch = difficultyFilter ? course.difficulty === difficultyFilter : true;
    return platformMatch && difficultyMatch;
  });

  const downloadCourses = (courses) => {
    const header = "Title,Platform,Duration,Difficulty,Tags\n";
    const content = courses.map(course =>
      "${course.title}","${course.platform}","${course.duration}","${course.difficulty}","${course.tags.join(" | ")}"
    ).join("\n");

    const blob = new Blob([header + content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "recommended_courses.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Container
        className="text-center mt-5"
        style={{
          backgroundImage: 'url("/assets/coffee-recommendation-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          color: "#4b3621",
          fontFamily: "Georgia, serif"
        }}
      >
        <Spinner animation="border" variant="dark" />
        <p>Loading recommendations...</p>
      </Container>
    );
  }

  return (
    <Container
      className="mt-5 recommendations"
      style={{
        backgroundImage: 'url("/assets/coffee-recommendation-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingBottom: "5rem",
        color: "#4b3621",
        fontFamily: "Georgia, serif"
      }}
    >
      <h2 className="text-center mb-4" style={{ color: "#6f4e37" }}>
        🎯 Recommended Courses
      </h2>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            style={{ backgroundColor: "#f8f1e7", borderColor: "#6f4e37", color: "#4b3621" }}
          >
            <option value="">Filter by Platform</option>
            <option value="Coursera">Coursera</option>
            <option value="Udemy">Udemy</option>
            <option value="edX">edX</option>
            <option value="Infosys Springboard">Infosys Springboard</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            style={{ backgroundColor: "#f8f1e7", borderColor: "#6f4e37", color: "#4b3621" }}
          >
            <option value="">Filter by Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {filteredCourses.map((course, index) => (
          <Col md={6} lg={4} key={index} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="course-card h-100"
                style={{
                  backgroundColor: "#f8f1e7",
                  color: "#4b3621",
                  border: "1px solid #6f4e37",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)"
                }}
              >
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {course.platform} • {course.duration}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Difficulty:</strong> {course.difficulty}
                    <br />
                    <strong>Tags:</strong> {course.tags.join(", ")}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="dark" href={course.link} target="_blank">
                      Enroll Now
                    </Button>
                    <Button
                      variant="outline-dark"
                      onClick={() => {
                        saveCourse(course);
                        alert("💾 Saved to your profile!");
                      }}
                    >
                      💾 Save
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {filteredCourses.length > 0 && (
        <div className="text-center mt-5 d-flex flex-wrap justify-content-center gap-3">
          <Button
            variant="outline-dark"
            size="lg"
            onClick={() => navigate("/feedback")}
          >
            💬 Give Feedback
          </Button>
          <Button
            variant="dark"
            size="lg"
            onClick={() => navigate("/quiz")}
          >
            🔁 Retake Quiz
          </Button>
          <Button
            variant="outline-secondary"
            size="lg"
            onClick={() => downloadCourses(filteredCourses)}
          >
            📄 Download CSV
          </Button>
        </div>
      )}
    </Container>
  );
}