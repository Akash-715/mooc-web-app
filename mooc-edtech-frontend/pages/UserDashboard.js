import React, { useEffect, useState, useRef } from "react";
import { Container, Card, Row, Col, Spinner, Alert, Button, Form } from "react-bootstrap";
import axios from "../utils/axiosConfig";
import defaultProfile from "../assets/DefaultProfile.png";

export default function UserDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [feedbackMsg] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token missing");

        const headers = { Authorization: `Bearer ${token}` };

        const { data } = await axios.get(`/dashboard`, { headers });
        setDashboard(data);
        setEditedProfile(data.profile);

        const photoRes = await fetch("http://localhost:8080/users/profile-photo", { headers });
        if (photoRes.ok) {
          const blob = await photoRes.blob();
          setProfileImageUrl(URL.createObjectURL(blob));
        }
      } catch (err) {
        setError(err?.response?.data || "Failed to load user dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleUnsave = async (courseId) => {
    try {
      await axios.delete(`/saved-courses/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDashboard((prev) => ({
        ...prev,
        savedCourses: prev.savedCourses.filter((c) => c.courseId !== courseId)
      }));
    } catch {
      alert("Failed to unsave course");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.put("/users/profile-photo", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const photoRes = await fetch("http://localhost:8080/users/profile-photo", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const blob = await photoRes.blob();
      setProfileImageUrl(URL.createObjectURL(blob));
      alert("Photo uploaded successfully!");
    } catch {
      alert("Failed to upload photo.");
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const handleEdit = () => setEditing(true);
  const handleChange = (e) => setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const payload = {
        fullName: editedProfile.fullName,
        phoneNumber: editedProfile.phoneNumber,
        educationLevel: editedProfile.educationLevel,
        preferredPlatform: editedProfile.preferredPlatform,
        primaryInterests: typeof editedProfile.primaryInterests === "string"
          ? editedProfile.primaryInterests.split(",").map((s) => s.trim())
          : editedProfile.primaryInterests,
        learningGoals: editedProfile.learningGoals,
        preferredDifficultyLevel: editedProfile.preferredDifficultyLevel,
        hobbies: typeof editedProfile.hobbies === "string"
          ? editedProfile.hobbies.split(",").map((s) => s.trim())
          : editedProfile.hobbies,
      };

      await axios.put(`/profile`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDashboard((prev) => ({ ...prev, profile: editedProfile }));
      setEditing(false);
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  if (error || !dashboard) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  const { profile, savedCourses, recommendedCourses } = dashboard;

  return (
    <Container className="my-5">
      <h2 className="mb-4">👤 User Dashboard</h2>
      {feedbackMsg && <Alert variant="success">{feedbackMsg}</Alert>}

      <div className="text-center mb-4">
        <div
          style={{
            backgroundImage: `url(${profileImageUrl || defaultProfile})`,
            width: "180px", height: "180px",
            borderRadius: "50%", backgroundSize: "cover",
            backgroundPosition: "center", border: "4px solid #6c757d",
            margin: "0 auto", boxShadow: "0 0 6px rgba(0,0,0,0.2)",
          }}
        />
        <div className="mt-2">
          <span
            className="text-primary d-block mb-2"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={triggerFileInput}
          >
            Change Profile Photo
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handlePhotoUpload}
          accept="image/png, image/jpeg"
          style={{ display: "none" }}
        />
      </div>

      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header>📋 Profile Information</Card.Header>
            <Card.Body>
              {editing ? (
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control name="fullName" value={editedProfile.fullName || ""} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control name="phoneNumber" value={editedProfile.phoneNumber || ""} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Education Level</Form.Label>
                    <Form.Select name="educationLevel" value={editedProfile.educationLevel || ""} onChange={handleChange}>
                      <option value="">-- Select --</option>
                      <option>School</option><option>Diploma</option><option>Undergraduate</option><option>Postgraduate</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Preferred Platform</Form.Label>
                    <Form.Select name="preferredPlatform" value={editedProfile.preferredPlatform || ""} onChange={handleChange}>
                      <option value="">-- Choose Platform --</option>
                      <option>Coursera</option><option>Udemy</option><option>edX</option><option>Infosys Springboard</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Primary Interests</Form.Label>
                    <Form.Control name="primaryInterests" value={editedProfile.primaryInterests || ""} onChange={handleChange} placeholder="e.g. AI, Web Development" />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Learning Goals</Form.Label>
                    <Form.Control as="textarea" rows={2} name="learningGoals" value={editedProfile.learningGoals || ""} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Preferred Difficulty</Form.Label>
                    <Form.Select name="preferredDifficultyLevel" value={editedProfile.preferredDifficultyLevel || ""} onChange={handleChange}>
                      <option value="">-- Choose --</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Hobbies</Form.Label>
                    <Form.Control name="hobbies" value={editedProfile.hobbies || ""} onChange={handleChange} placeholder="e.g. Reading, Gaming" />
                  </Form.Group>
                  <Button variant="warning" onClick={handleSave}>Save</Button>
                </Form>
              ) : (
                <>
                  <p><strong>Full Name:</strong> {profile.fullName}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phoneNumber}</p>
                  <p><strong>Education Level:</strong> {profile.educationLevel}</p>
                  <p><strong>Preferred Platform:</strong> {profile.preferredPlatform}</p>
                  <p><strong>Primary Interests:</strong> {(profile.primaryInterests || []).join(", ")}</p>
                  <p><strong>Learning Goals:</strong> {profile.learningGoals}</p>
                  <p><strong>Difficulty:</strong> {profile.preferredDifficultyLevel}</p>
                  <p><strong>Hobbies:</strong> {(profile.hobbies || []).join(", ")}</p>
                  <Button variant="warning" onClick={handleEdit}>Edit Profile</Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header>📚 Saved Courses</Card.Header>
            <Card.Body>
              {savedCourses.length === 0 ? (
                <p>No saved courses found.</p>
              ) : (
                savedCourses.map((c,idx) => (
                  <Card key={c.courseId||idx} className="mb-3">
                    <Card.Body>
                      <h5>{c.title}</h5>
                      <p>{c.description}</p>
                      <div className="d-flex justify-content-between">
                        <a href={c.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">Visit Course</a>
                        <Button variant="outline-danger" size="sm" onClick={() => handleUnsave(c.courseId)}>Unsave</Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header>🎯 Recommended Courses</Card.Header>
            <Card.Body>
              {recommendedCourses.length === 0 ? (
                <p>No recommendations available.</p>
              ) : (
                recommendedCourses.map((course,idx) => (
                  <Card key={course.id||idx} className="mb-3">
                    <Card.Body>
                      <h5>{course.title}</h5>
                      <p>{course.description}</p>
                      <a href={course.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success">Visit Course</a>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
