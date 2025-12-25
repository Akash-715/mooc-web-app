// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired } from "../utils/checkToken";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null); // ✅ Store token in state

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");
    const savedRole = localStorage.getItem("role");

    if (savedToken && userEmail && savedRole && !isTokenExpired()) {
      setToken(savedToken);
      setUser({ email: userEmail });
      setRole(savedRole);
    } else {
      localStorage.clear();
    }
  }, []);

  const login = (userData, role, tokenFromServer) => {
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("role", role);
    localStorage.setItem("token", tokenFromServer); // ✅ Save token from server

    setUser(userData);
    setRole(role);
    setToken(tokenFromServer); // ✅ Update state
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
