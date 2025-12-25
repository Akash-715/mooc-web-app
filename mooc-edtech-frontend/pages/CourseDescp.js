import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axiosConfig";
import coffeeBg from "../assets/coffee-cd-bg.jpg";

export default function CourseDescp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId } = useParams(); // From URL
  const { course } = location.state || {};

  const [courseDetails, setCourseDetails] = useState(course || null);
  const [isSaved, setIsSaved] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const idToUse = course?.id || courseId;
    if (idToUse) {
      fetchCourseDetails(idToUse);
      checkIfSaved(idToUse);
      fetchFeedbacks(idToUse);
    }
  }, [course?.id, courseId]);

  const fetchCourseDetails = async (id) => {
    try {
      const res = await axios.get(`/courses/${id}`);
      const result = res.data;
      if (result && result.id) {
        setCourseDetails(result);
      } else if (result && result.course) {
        setCourseDetails(result.course);
      }
    } catch (err) {
      console.error("Error fetching course details:", err);
    }
  };

  const checkIfSaved = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !courseId) return;

      const res = await axios.get("/saved-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const savedCourses = res.data || [];
      const savedIds = new Set(savedCourses.map((c) => c.courseId));
      setIsSaved(savedIds.has(courseId));
    } catch (err) {
      console.warn("Could not fetch saved courses.");
    }
  };

  const fetchFeedbacks = async (courseId) => {
    try {
      const res = await axios.get(`/feedback/all/${courseId}`);
      setFeedbacks(res.data || []);
    } catch (err) {
      console.warn("Could not fetch course feedbacks.");
    }
  };

  const saveCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId || !token) return alert("Please login to save courses");

      if (isSaved) {
        alert("Course already saved.");
        return;
      }

      await axios.post(
        `/saved-courses?courseId=${courseDetails.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Course saved successfully!");
      setIsSaved(true);
    } catch (err) {
      alert("Failed to save course");
      console.error(err);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/coursedescp/${courseDetails.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link."));
  };

  if (!courseDetails)
    return <p style={{ textAlign: "center" }}>No course selected.</p>;

  return (
    <div
      style={{
        backgroundImage: `url(${coffeeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Georgia, serif",
        color: "#3e2f1c",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#fffaf3",
          border: "1px solid #d8cfc0",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#6f4e37" }}>{courseDetails.title}</h2>
        <img
          src={courseDetails.imageUrl}
          alt={courseDetails.title}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        />
        <p><strong>Description:</strong> {courseDetails?.description || "N/A"}</p>
{courseDetails?.platform && (
  <p><strong>Platform:</strong> {courseDetails.platform}</p>
)}
{courseDetails?.tutor && (
  <p><strong>Tutor:</strong> {courseDetails.tutor}</p>
)}
{courseDetails?.duration && (
  <p><strong>Duration:</strong> {courseDetails.duration}</p>
)}
{courseDetails?.difficultyLevel && (
  <p><strong>Difficulty Level:</strong> {courseDetails.difficultyLevel}</p>
)}


        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "1rem",
          }}
        >
          <a
            href={courseDetails.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6f4e37",
              color: "#fffaf3",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Go to Course →
          </a>

          <button
            onClick={saveCourse}
            disabled={isSaved}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: isSaved ? "#b0a292" : "#4b3621",
              color: "#fffaf3",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: isSaved ? "not-allowed" : "pointer",
            }}
          >
            {isSaved ? "Saved" : "Save"}
          </button>

          <button
            onClick={handleShare}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#5e493a",
              color: "#fffaf3",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            📤 Share
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#a18976",
              color: "#fffaf3",
              borderRadius: "6px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            ← Back to Home
          </button>
        </div>

        {/* ✅ Feedback Section */}
        {feedbacks.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h4 style={{ color: "#6f4e37", marginBottom: "1rem" }}>
              User Feedback
            </h4>
            {feedbacks.map((fb, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#f3ece3",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <p>
                  <strong>Rating:</strong> {fb.recommendationRating} ⭐
                </p>
                {fb.comments && (
                  <p>
                    <strong>Comment:</strong> {fb.comments}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}