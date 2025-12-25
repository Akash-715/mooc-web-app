import React, { useEffect, useState, useRef } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import refreshIcon from "../assets/refresh.jpg";
import * as XLSX from "xlsx";
import defaultProfile from "../assets/DefaultProfile.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const barColors = ["#6f4e37", "#c97c5d", "#a0522d", "#deb887", "#d2691e", "#8b4513"];
const pieColors = ["#f4a261", "#2a9d8f", "#e76f51", "#e9c46a", "#264653", "#ffb4a2"];

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", url: "", platform: "", tutor: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    loadCourses();
    loadStats();
    loadUsers();
    fetchProfilePhoto();
    loadAllFeedbacks();

    const interval = setInterval(() => loadStats(), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchProfilePhoto = async () => {
    try {
      const res = await fetch("http://localhost:8080/users/profile-photo", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const blob = await res.blob();
        setProfileImageUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error("Failed to fetch profile photo");
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

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
      fetchProfilePhoto();
      alert("Photo uploaded successfully!");
    } catch {
      alert("Failed to upload photo.");
    }
  };

  const handleRefresh = async () => {
    setIsRotating(true);
    await loadStats();
    setTimeout(() => setIsRotating(false), 1000);
  };

  const loadCourses = async () => {
    try {
      const res = await axios.get("/courses?page=0&size=25");
      setCourses(Array.isArray(res.data) ? res.data : res.data.content || []);
    } catch (e) {
      setError("403 - Admin access required. Please login as admin.");
    }
  };

  const loadStats = async () => {
    try {
      const res = await axios.get("/admin/dashboard");
      setStats(res.data);
    } catch (e) {
      console.error("Stats fetch error:", e);
    }
  };
  
  const loadAllFeedbacks = async () => {
    try {
      const res = await axios.get("/feedback/all");
      setFeedbacks(res.data);
    } catch (e) {
      console.error("Failed to load all feedbacks", e);
    }
  };

  const handleFeedbackSearch = async () => {
    if (!feedbackSearch.trim()) {
      return loadAllFeedbacks();
    }
  
    const matchedCourses = courses.filter(c =>
      c.title.toLowerCase().includes(feedbackSearch.toLowerCase())
    );
  
    if (matchedCourses.length === 0) {
      setFeedbacks([]);
      return;
    }
  
    try {
      const allFeedbacks = [];
  
      for (const course of matchedCourses) {
        const res = await axios.get(`/feedback/all/${course.id}`);
        if (Array.isArray(res.data)) {
          allFeedbacks.push(
            ...res.data.map(f => ({ ...f, courseTitle: course.title }))
          );
        }
      }
  
      setFeedbacks(allFeedbacks);
    } catch (e) {
      console.error("Failed to fetch feedbacks for courses", e);
    }
  };
  

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`/admin/courses/${id}`);
      handleSearch("", true);
    } catch (e) {
      console.error(e);
    }
  };

  const addCourse = async () => {
    try {
      await axios.post("/admin/courses", form);
      setForm({ title: "", description: "", imageUrl: "", url: "", platform: "", tutor: "" });
      loadCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    let json = XLSX.utils.sheet_to_json(sheet);

    // Fix tags: parse strings like '["AI", "ML"]' into arrays if needed
    json = json.map((course, index) => {
      // Validate required fields
      const requiredFields = [
        "title", "description", "tags", "platform", "tutor",
        "difficultyLevel", "duration", "rating", "language", "url", "imageUrl"
      ];

      for (const field of requiredFields) {
        if (!course[field]) {
          throw new Error(`Missing field "${field}" in row ${index + 2}`);
        }
      }

      // If tags is a string, try to parse it to array
      if (typeof course.tags === "string") {
        try {
          const parsed = JSON.parse(course.tags);
          if (Array.isArray(parsed)) course.tags = parsed;
        } catch (err) {
          // fallback: split by comma
          course.tags = course.tags.split(",").map(t => t.trim());
        }
      }

      return course;
    });

    console.log("📤 Uploading parsed JSON to backend:", json);

    await axios.post("/admin/courses/bulk", json);

    alert("✅ Courses uploaded successfully!");
    loadCourses();
  } catch (err) {
    console.error("🚨 Bulk upload failed", err);
    alert("❌ Failed to upload bulk courses: " + (err.message || "Unknown error"));
  }
};
  const downloadTemplate = () => {
    const sample = [
      {
        title: "Sample Course",
        description: "Description",
        tags: "Put as array of tags",
        platform: "Platform",
        tutor: "Tutor",
        difficultyLevel: "BEGINNER",
        duration: "ONE_TO_FOUR_WEEKS",
        rating: 4.5,
        language: "English",
        url: "https://example.com",
        imageUrl: "https://example.com/image.png"
      }
    ];
    const worksheet = XLSX.utils.json_to_sheet(sample);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");
    XLSX.writeFile(workbook, "bulk_courses_template.xlsx");
  };

  const handleSearch = async (query = searchQuery, isReset = false) => {
    try {
      if (!query.trim()) {
        loadCourses();
        return;
      }
      const res = await axios.get(`/courses/search?q=${query}&page=0&size=10`);
      const data = Array.isArray(res.data) ? res.data : res.data.content || [];
      setCourses(data);
    } catch (err) {
      setError("Search failed.");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      const filtered = res.data.filter(u => u.username !== "mrD" && u.role !== "ADMIN");
      setUsers(filtered);
    } catch (e) {
      console.error("User fetch error", e);
    }
  };

  const handleUserDelete = async (username) => {
    try {
      await axios.delete(`/admin/users?username=${username}`);
      loadUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const coffeeStyles = {
    backgroundColor: "#f8f1e7",
    color: "#4b3621",
    fontFamily: "Georgia, serif",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const inputStyle = {
    backgroundColor: "#fff8f2",
    border: "1px solid #d9c4a3",
    color: "#4b3621",
  };

  const headingStyle = {
    color: "#6f4e37",
  };

  return (
    <div className="container mt-4" style={coffeeStyles}>
      <div className="d-flex align-items-start mb-4">
        <div className="me-4">
          <div
            style={{
              backgroundImage: `url(${profileImageUrl || defaultProfile})`,
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "3px solid #6c757d",
              boxShadow: "0 0 4px rgba(0,0,0,0.2)",
            }}
          />
          <div>
            <span
              className="text-primary"
              style={{ cursor: "pointer", textDecoration: "underline",paddingLeft: "75px" }}
              onClick={triggerFileInput}
            >
              Change Photo
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div>
          <h2 style={headingStyle}>Admin Dashboard</h2>
          {error && <p className="text-danger">{error}</p>}
          {stats && (
            <div className="mb-4">
              <h5 style={headingStyle}>Summary</h5>
              <ul>
                <li>Admin Name: {stats.adminName}</li>
                <li>Admin Email: {stats.adminEmail}</li>
                <li>Total Users: {stats.totalUsers}</li>
                <li>Total Courses: {stats.totalCourses}</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {stats?.platformDistribution && (
  <div className="mb-5 mt-4 d-flex flex-column flex-md-row">
    <div style={{ flex: 1 }}>
      <h5 style={headingStyle}>Platform Distribution (Courses) <img
    src={refreshIcon}
    alt="Refresh"
    onClick={handleRefresh}
    style={{
      width: "24px",
      height: "24px",
      cursor: "pointer",
      transform: isRotating ? "rotate(360deg)" : "rotate(0deg)",
      transition: "transform 1s linear"
    }}
  /></h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={Object.entries(stats.platformDistribution).map(([platform, count]) => ({
            platform,
            count,
          }))}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            {barColors.map((color, index) => (
              <linearGradient key={index} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.3} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count">
            {Object.entries(stats.platformDistribution).map(([platform], index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#barGradient-${index % barColors.length})`}
                stroke="#4b3621"
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div style={{ marginLeft: "2rem", minWidth: "150px", flexShrink: 0 }}>
      <h6 style={headingStyle}>Legend</h6>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {Object.entries(stats.platformDistribution).map(([platform], index) => (
          <li key={index}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: barColors[index % barColors.length],
                marginRight: "8px",
              }}
            />
            {platform}
          </li>
        ))}
      </ul>
    </div>
  </div>
)}


{stats?.interestAreaPopularity && (
  <div className="mb-5 mt-4 d-flex flex-column flex-md-row">
    <div style={{ flex: 1 }}>
      <h5 style={headingStyle}>Interest Area Popularity (Users)</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={Object.entries(stats.interestAreaPopularity).map(([name, value]) => ({
              name,
              value,
            }))}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {Object.entries(stats.interestAreaPopularity).map(([_, __], index) => (
              <Cell
                key={`cell-${index}`}
                fill={pieColors[index % pieColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div style={{ marginLeft: "2rem", minWidth: "150px", flexShrink: 0 }}>
      <h6 style={headingStyle}>Legend</h6>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {Object.entries(stats.interestAreaPopularity).map(([tag], index) => (
          <li key={index}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: pieColors[index % pieColors.length],
                marginRight: "8px",
              }}
            />
            {tag}
          </li>
        ))}
      </ul>
    </div>
  </div>
)}


      <div className="mb-4">
        <h5 style={headingStyle}>Add New Course</h5>
        <input className="form-control mb-2" placeholder="Title" style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="form-control mb-2" placeholder="Description" style={inputStyle} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="form-control mb-2" placeholder="Platform" style={inputStyle} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} />
        <input className="form-control mb-2" placeholder="Tutor" style={inputStyle} value={form.tutor} onChange={(e) => setForm({ ...form, tutor: e.target.value })} />
        <input className="form-control mb-2" placeholder="Image URL" style={inputStyle} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <input className="form-control mb-2" placeholder="Course URL" style={inputStyle} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <button className="btn btn-success" onClick={addCourse}>Add Course</button>
      </div>

      <div className="mb-4">
        <h5 style={headingStyle}>📥 Bulk Course Upload</h5>
        <div className="d-flex gap-3">
          <input type="file" accept=".xlsx,.xls" onChange={handleBulkUpload} className="form-control" />
          <button className="btn btn-outline-secondary" onClick={downloadTemplate}>Download Excel Template</button>
        </div>
      </div>

      <h4 style={headingStyle}>Manage Courses</h4>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value.trim()) handleSearch("", true);
          }}
        />
        <button className="btn btn-outline-dark" onClick={() => handleSearch()}>Search</button>
      </div>

      <ul className="list-group mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
  {courses.length === 0 ? (
    <p>No courses available.</p>
  ) : (
    courses.map((course) => (
      <li key={course.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: "#fffdf7" }}>
        <span>{course.title}</span>
        <button className="btn btn-danger btn-sm" onClick={() => deleteCourse(course.id)}>Delete</button>
      </li>
    ))
  )}
</ul>


      <h4 style={headingStyle}>Manage Users</h4>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
      </div>
      <ul className="list-group mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
  {filteredUsers.length === 0 ? (
    <p>No users found.</p>
  ) : (
    filteredUsers.map((user) => (
      <li key={user.username} className="list-group-item d-flex justify-content-between align-items-center">
        <span>{user.username} ({user.email})</span>
        <button className="btn btn-danger btn-sm" onClick={() => handleUserDelete(user.username)}>Delete</button>
      </li>
    ))
  )}
</ul>


{/* ✅ Outside of users list */}
<h4 style={headingStyle}>View Course Feedback</h4>
<div className="input-group mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search course for feedback..."
    value={feedbackSearch}
    onChange={(e) => setFeedbackSearch(e.target.value)}
  />
  <button className="btn btn-outline-dark" onClick={handleFeedbackSearch}>Search</button>
</div>
<div style={{ maxHeight: "300px", overflowY: "auto" }}>
  <ul className="list-group mb-4">
    {feedbacks.length === 0 ? (
      <li className="list-group-item">No feedback found.</li>
    ) : (
      feedbacks.map((f, idx) => (
        <li key={idx} className="list-group-item">
          <strong>Course:</strong> {courses.find(c => c.id === f.courseId)?.title || f.courseId}<br />
          <strong>Rating:</strong> {f.rating} <br />
          <strong>Comment:</strong> {f.comment} <br />
        </li>
      ))
    )}
  </ul>
</div>


    </div>
  );
}