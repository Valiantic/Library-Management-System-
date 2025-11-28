import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "./Loading";

export default function AdminProtectedRoute({ children }) {
  const { token, user, userLoading } = useContext(AuthContext);

  // Show loading while fetching user data
  if (userLoading) {
    return <Loading />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/home" replace />;
  }

  if (!user) {
    return <Loading />;
  }

  return children;
}
