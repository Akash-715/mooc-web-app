// components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); // fallback if context lags

  const handleLogout = () => {
    logout(); // clears context
    localStorage.clear(); // clears token and everything
    navigate("/"); // go to home after logout
  };

  // Coffee-themed inline styles
  const styles = {
    navbar: {
      backgroundColor: "#6f4e37", // rich coffee brown
    },
    brand: {
      color: "#f8f1e7", // creamy text
      fontFamily: "Georgia, serif",
      fontWeight: "bold",
      letterSpacing: "1px",
      fontSize: "1.5rem",
      textDecoration: "none",
    },
    navLink: {
      color: "#fceee3",
      marginLeft: "10px",
      marginRight: "10px",
      fontWeight: 500,
      transition: "all 0.3s ease",
    },
    navLinkHover: {
      backgroundColor: "#4b3621",
      color: "#ffffff",
      borderRadius: "5px",
    },
    button: {
      color: "#fceee3",
      background: "none",
      border: "none",
      fontWeight: 500,
      cursor: "pointer",
    },
  };

  return (
    <nav className="navbar navbar-expand-lg px-4 shadow-sm" style={styles.navbar}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" style={styles.brand}>
          Courspresso
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {/* Always show Home */}
            <li className="nav-item">
              <Link className="nav-link" to="/" style={styles.navLink}>
                Home
              </Link>
            </li>

            {/* If NOT logged in */}
            {!user && (
              <li className="nav-item">
                <Link className="nav-link" to="/login" style={styles.navLink}>
                  Login
                </Link>
              </li>
            )}

            {/* If logged in as USER */}
            {user && role?.toLowerCase() === "user" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/user-dashboard" style={styles.navLink}>
                    User Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout} style={styles.button}>
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* If logged in as ADMIN */}
            {user && role?.toLowerCase() === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin" style={styles.navLink}>
                    Admin Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout} style={styles.button}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}