import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // ❌ لو مفيش توكن → يرجعه للوجين
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ لو فيه توكن → يدخل عادي
  return children;
}