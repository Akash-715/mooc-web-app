import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";

export default function SavedCourses() {
  const [courses, setCourses] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) fetchSaved();
  }, [userId]);

  const fetchSaved = async () => {
    try {
      const res = await axios.get(`/saved-courses/${userId}`);
      setCourses(res.data);
    } catch (err) {
      console.error("Error loading saved courses", err);
    }
  };

  const containerStyle = {
    backgroundColor: "#f8f1e7",           // light coffee background
    color: "#4b3621",                     // dark coffee text
    minHeight: "100vh",
    padding: "3rem",
    fontFamily: "Georgia, serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "12px",
  };

  const listStyle = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "1rem 1.5rem",
    listStyleType: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const listItemStyle = {
    padding: "0.5rem 0",
    borderBottom: "1px solid #ddd",
    fontWeight: "500",
  };

  return (
    <div className="container" style={containerStyle}>
      <h2 className="text-center mb-4" style={{ color: "#6f4e37" }}>☕ Saved Courses</h2>
      {courses.length === 0 ? (
        <p className="text-muted text-center fst-italic">No courses saved yet.</p>
      ) : (
        <ul style={listStyle}>
          {courses.map((course) => (
            <li key={course.id} style={listItemStyle}>{course.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}