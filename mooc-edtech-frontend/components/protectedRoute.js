import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role } = useAuth();

  if (user === undefined || role === undefined) {
    // Loading or not initialized
    return null; // Or a loader if you want
  }

  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role.toUpperCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
