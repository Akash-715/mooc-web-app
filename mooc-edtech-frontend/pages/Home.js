import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

// Style object for cards
const cardStyle = {
  backgroundColor: "#fffaf3",
  border: "1px solid #e0d7c6",
  borderRadius: "12px",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer",
};

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [savedCourseIds, setSavedCourseIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 15;
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    platform: "",
    duration: "",
    difficulty: "",
    rating: "",
  });

  useEffect(() => {
    fetchCourses();
    checkSavedCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/courses?page=0&size=200");
      const data = Array.isArray(res.data) ? res.data : res.data.content || [];
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
        fetchCourses();
        return;
      }

      const res = await axios.get(`http://localhost:8080/courses/search?q=${searchQuery}`);
      const data = Array.isArray(res.data) ? res.data : res.data.content || [];
      setCourses(data);
      setCurrentPage(1);
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

  const unsaveCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`/saved-courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = new Set(savedCourseIds);
      updated.delete(courseId);
      setSavedCourseIds(updated);
    } catch (err) {
      console.warn("Failed to unsave course");
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesPlatform = filters.platform ? c.platform?.toLowerCase() === filters.platform.toLowerCase() : true;
    const matchesDuration = filters.duration ? c.duration?.toLowerCase() === filters.duration.toLowerCase() : true;
    const matchesDifficulty = filters.difficulty ? c.difficulty?.toLowerCase() === filters.difficulty.toLowerCase() : true;
    const matchesRating = filters.rating ? Math.floor(c.rating || 0) === parseInt(filters.rating) : true;
    return matchesPlatform && matchesDuration && matchesDifficulty && matchesRating;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

  const generatePageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 4) pageNumbers.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pageNumbers.push(i);
      }
      if (currentPage < totalPages - 3) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div
      style={{
        backgroundColor: "#f6f1e7",
        minHeight: "100vh",
        paddingTop: "2rem",
        fontFamily: "Georgia, serif",
        color: "#4b3621",
        position: "relative",
      }}
    >
      <div className="container">
        <h2 style={{ color: "#6f4e37", textAlign: "center" }}>
          Brew your perfect course — <em>Your daily dose of curated learning</em> ☕
        </h2>

        {error && <p className="text-danger">{error}</p>}

        <div className="row g-2 mb-3 align-items-center">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                if (value === "") fetchCourses();
              }}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.platform}
              onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
            >
              <option value="">Platform</option>
              <option value="Coursera">Coursera</option>
              <option value="Udemy">Udemy</option>
              <option value="edX">edX</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.duration}
              onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
            >
              <option value="">Duration</option>
  <option value="ONE_TO_THREE_MONTHS">1–3 Months</option>
  <option value="TWO_TO_FOUR_MONTHS">2–4 Months</option>
  <option value="THREE_TO_SIX_MONTHS">3–6 Months</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            >
              <option value="">Rating</option>
              <option value="5">5★</option>
              <option value="4">4★</option>
              <option value="3">3★</option>
              <option value="2">2★</option>
              <option value="1">1★</option>
            </select>
          </div>
          <div className="col-md-1 ms-auto">
  <button className="btn btn-outline-dark w-100" onClick={handleSearch}>
    Search
  </button>
</div>

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
          {currentCourses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            currentCourses.map((c) => (
              <div key={c.id} className="col-md-4">
                <div
                  className="card mb-4 shadow-sm"
                  style={cardStyle}
                  onClick={() => navigate("/coursedescp", { state: { course: c } })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <img
                    src={c.imageUrl}
                    className="card-img-top"
                    alt={c.title}
                    style={{
                      height: "200px",
                      width: "100%",
                      objectFit: "contain",
                      backgroundColor: "#fff",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                  />
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Course
                        </a>
                        {savedCourseIds.has(c.id) ? (
                          <button
                            className="btn btn-outline-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              unsaveCourse(c.id);
                            }}
                          >
                            Unsave
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-success"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveCourse(c.id);
                            }}
                          >
                            Save
                          </button>
                        )}
                      </div>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          const shareUrl = `${window.location.origin}/coursedescp/${c.id}`;
                          navigator.clipboard.writeText(shareUrl)
                            .then(() => alert("Link copied to clipboard!"))
                            .catch(() => alert("Failed to copy link."));
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

        <div className="d-flex justify-content-center mt-4 mb-5 flex-wrap gap-2">
          {generatePageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2 fw-bold">...</span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`btn ${page === currentPage ? "btn-dark" : "btn-outline-dark"}`}
              >
                {page}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
