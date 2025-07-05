import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import Chatbot from "../components/Chatbot";


export default function Home() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [savedCourseIds, setSavedCourseIds] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    checkSavedCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/courses?page=0&size=20");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.content || [];
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Unable to fetch courses.");
    }
  };

  const checkSavedCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

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

  const handleSearch = async () => {
    try {
      if (!searchQuery.trim()) {
        fetchCourses(); // auto load all if cleared
        return;
      }

      const res = await axios.get(`http://localhost:8080/courses/search?q=${searchQuery}`);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.content || [];

      setCourses(data);
    } catch (err) {
      setError("Login/Signup to search courses");
    }
  };

  const saveCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!userId || !token) return alert("Please login to save courses");

      if (savedCourseIds.has(courseId)) {
        alert("Course already saved.");
        return;
      }

      await axios.post(
        `/saved-courses?courseId=${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Course saved successfully!");
      setSavedCourseIds((prev) => new Set(prev).add(courseId));
    } catch (err) {
      alert("Failed to save course");
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: "#f6f1e7", minHeight: "100vh", paddingTop: "2rem", fontFamily: "Georgia, serif", color: "#4b3621", position: "relative" }}>
      <div className="container">
        <h2 style={{ color: "#6f4e37", textAlign: "center" }}>
          Brew your perfect course — <em>Your daily dose of curated learning</em> ☕
        </h2>

        {error && <p className="text-danger">{error}</p>}

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              if (value === "") fetchCourses(); // auto-load when cleared
            }}
          />
          <button className="btn btn-outline-dark" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="my-4 text-center">
          <button
            onClick={() => navigate("/quiz")}
            style={{
              width: "100%",
              backgroundColor: "#6f4e37",
              color: "#fffaf3",
              border: "none",
              padding: "0.75rem 1rem",
              fontSize: "1.1rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontFamily: "Georgia, serif",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#5b3d2e")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#6f4e37")}
          >
            Take a Quiz 📚
          </button>
        </div>

        <h4 className="mt-4" style={{ color: "#6f4e37" }}>Courses</h4>
        <div className="row">
          {courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            courses.map((c) => (
              <div key={c.id} className="col-md-4">
                <div className="card mb-4 shadow-sm" style={{ backgroundColor: "#fffaf3", border: "1px solid #e0d7c6", borderRadius: "12px" }}>
                  <img src={c.imageUrl} className="card-img-top" alt={c.title} />
                  <div className="card-body">
                    <h5 className="card-title">{c.title}</h5>
                    <p className="card-text">{c.description}</p>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex justify-content-between">
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-dark"
                        >
                          Visit Course
                        </a>
                        <button
                          className="btn btn-outline-success"
                          onClick={() => saveCourse(c.id)}
                          disabled={savedCourseIds.has(c.id)}
                        >
                          {savedCourseIds.has(c.id) ? "Saved" : "Save"}
                        </button>
                      </div>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          const shareUrl = `http://localhost:8080/courses/share/${c.id}`;
                          window.open(shareUrl, "_blank");
                        }}
                      >
                        📤 Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 👇 Chatbot should be outside the main content */}
      <Chatbot />
    </div>
  );
}
