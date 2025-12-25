import { jwtDecode } from "jwt-decode";

export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; // current time in seconds
    return decoded.exp < now;
  } catch (e) {
    console.error("Invalid token", e);
    return true;
  }
};
