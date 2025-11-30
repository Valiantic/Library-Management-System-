import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, user } = useContext(AuthContext);

  // While session is loading (user === undefined), wait.
  if (token === undefined) return null;

  // If NOT logged in → redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== "student") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
