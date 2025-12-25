import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Recommendations from './pages/Recommendations';
import Navbar from './components/Navbar';
import Feedback from './pages/Feedback';
import Quiz from './pages/Quiz';
import AdminDashboard from './pages/AdminDashboard';
import SavedCourses from './pages/SavedCourses';
import UserDashboard from './pages/UserDashboard';
import Chatbot from './components/Chatbot';
import DomainPage from "./pages/DomainPage";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import VerifyOtp from './pages/Verify-otp';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/protectedRoute';
import Logout from './pages/logout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CourseDescp from './pages/CourseDescp';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />

          <div className="main-content flex-grow-1">
            <Routes>
              {/* Public route - accessible by anyone */}
              <Route path="/" element={<Home />} />
              <Route path="/coursedescp" element={<CourseDescp />} />
              <Route path="/coursedescp/:courseId" element={<CourseDescp />} />

              <Route
                path="/register"
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <Register />
                  </ProtectedRoute>
                }
              />

              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/quiz" element={<Quiz />} />
              
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/saved" element={<SavedCourses />} />
              <Route path="/domain/:domainId" element={<DomainPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<h2>❌ Unauthorized</h2>} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>

          <footer className="bg-dark text-white text-center py-3">
            <p className="mb-0">
              © {new Date().getFullYear()} MOOC Course Recommender. All rights reserved.
            </p>
          </footer>
        </div>
      </Router>

      <Chatbot />
    </AuthProvider>
  );
}

export default App;