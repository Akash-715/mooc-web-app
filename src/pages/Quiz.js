import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, ProgressBar } from "react-bootstrap";
import bgImage from "../assets/coffee-quiz-bg.png";

export default function Quiz() {
  const navigate = useNavigate();
  const [level, setLevel] = useState(1);
  const [answers, setAnswers] = useState({
    interest: [],
    learningStyle: "",
    courseLength: "",
    preferredPlatforms: [],
    difficulty: "",
    goal: "",
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("Please log in to access the quiz.");
      navigate("/login");
    }
  }, []);

  const groupedTags = {
    "Front-End Development": ["HTML5", "CSS3", "JavaScript", "Web Design", "Angular"],
    "Back-End & Programming": ["Java", "OOP", "Programming"],
    "Data Science & AI": ["AI", "ML", "Statistics", "Quantitative"],
    "Cybersecurity & Blockchain": ["Security", "Cryptocurrency", "Blockchain"],
    "UI/UX & Design": ["UIUX", "3D Modeling", "Blender", "Animation"],
    "Soft Skills & Career": ["Psychology", "Well-Being", "Mindfulness", "Career", "Writing Skills", "Leadership"],
    "Academics & Research": ["Research", "Qualitative", "Planning"],
    "Philosophy & Ethics": ["Philosophy", "Critical Thinking", "Ethics"],
    "Web Development": ["Web Development", "Full Stack", "React", "Node.js"],
  };

  const platforms = ["Coursera", "Udemy", "edX", "freeCodeCamp", "FutureLearn"];

  const durations = [
    { label: "1–4 weeks", value: "ONE_TO_FOUR_WEEKS" },
    { label: "1–3 months", value: "ONE_TO_THREE_MONTHS" },
    { label: "2–4 months", value: "TWO_TO_FOUR_MONTHS" },
    { label: "3–6 months", value: "THREE_TO_SIX_MONTHS" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "interest") {
      const selected = new Set(answers.interest);
      const mappedTags = groupedTags[value];
      mappedTags.forEach((tag) => selected.add(tag));
      setAnswers({ ...answers, interest: Array.from(selected) });
    } else if (name === "preferredPlatforms") {
      const selected = new Set(answers.preferredPlatforms);
      if (checked) selected.add(value);
      else selected.delete(value);
      setAnswers({ ...answers, preferredPlatforms: Array.from(selected) });
    } else {
      setAnswers({ ...answers, [name]: value });
    }
  };

  const handleNext = () => {
    if (level < 3) {
      setLevel(level + 1);
    } else {
      const payload = {
        tags: answers.interest.flatMap((group) => groupedTags[group] || []),
        platforms: answers.preferredPlatforms,
        difficulty: answers.difficulty,
        duration: answers.courseLength,
        goal: answers.goal,
      };

      localStorage.setItem("quizPayload", JSON.stringify(payload));
      navigate("/recommendations");
    }
  };

  const handleBack = () => {
    if (level > 1) {
      setLevel(level - 1);
    }
  };

  const progress = level * 33;

  const isCurrentLevelValid = () => {
    if (level === 1) return answers.interest.length > 0 && answers.learningStyle;
    if (level === 2) return answers.courseLength && answers.preferredPlatforms.length > 0;
    if (level === 3) return answers.difficulty && answers.goal.trim().length > 0;
    return false;
  };

  const backgroundStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "2rem 4vw",
    fontFamily: "Georgia, serif",
    color: "#4b3621",
  };

  const cardStyle = {
    backgroundColor: "#f8f1e7",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
    width: "100%",
    maxWidth: "500px",
    padding: "1.5rem 2rem",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const labelStyle = {
    fontWeight: "bold",
    color: "#6f4e37",
  };

  const progressBarStyle = {
    height: "10px",
    backgroundColor: "#d3b8a3",
  };

  const progressVariant = "#6f4e37";

  return (
    <div style={backgroundStyle}>
      <Card style={cardStyle}>
        <Card.Body>
          <h2 className="text-center mb-3" style={{ color: "#6f4e37" }}>
            🧠 Interest Quiz – Level {level}
          </h2>

          <ProgressBar
            now={progress}
            label=""
            className="mb-4"
            style={progressBarStyle}
            variant="custom"
            striped
            animated
          >
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: progressVariant,
                height: "100%",
                borderRadius: "10px",
              }}
            ></div>
          </ProgressBar>

          <Form>
            {level === 1 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Which domain interests you the most?</Form.Label>
                  {Object.keys(groupedTags).map((group) => (
                    <Form.Check
                      key={group}
                      type="checkbox"
                      name="interest"
                      value={group}
                      label={group}
                      onChange={handleChange}
                    />
                  ))}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>What's your preferred learning style?</Form.Label>
                  <Form.Check type="radio" label="Hands-on Projects" name="learningStyle" value="project" onChange={handleChange} required />
                  <Form.Check type="radio" label="Videos & Visuals" name="learningStyle" value="video" onChange={handleChange} required />
                  <Form.Check type="radio" label="Reading & Theory" name="learningStyle" value="theory" onChange={handleChange} required />
                </Form.Group>
              </>
            )}

            {level === 2 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>What course duration works best for you?</Form.Label>
                  <Form.Select name="courseLength" value={answers.courseLength} onChange={handleChange} required>
                    <option value="">-- Select --</option>
                    {durations.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Preferred platform(s)?</Form.Label>
                  {platforms.map((platform) => (
                    <Form.Check
                      key={platform}
                      type="checkbox"
                      name="preferredPlatforms"
                      value={platform}
                      label={platform}
                      onChange={handleChange}
                    />
                  ))}
                </Form.Group>
              </>
            )}

            {level === 3 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>What is your skill level?</Form.Label>
                  <Form.Select name="difficulty" value={answers.difficulty} onChange={handleChange} required>
                    <option value="">-- Select --</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>What’s your goal?</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="goal"
                    placeholder="e.g., Get an internship, build a project, upskill for job"
                    value={answers.goal}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </>
            )}

            <div className="d-flex justify-content-between mt-3">
              {level > 1 ? (
                <Button variant="outline-secondary" onClick={handleBack}>
                  ← Go Back
                </Button>
              ) : (
                <div></div>
              )}
              <Button
                variant="dark"
                onClick={handleNext}
                disabled={!isCurrentLevelValid()}
                style={{
                  backgroundColor: "#6f4e37",
                  border: "none",
                  width: "60%",
                }}
              >
                {level < 3 ? "Next →" : "Get Recommendations"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
