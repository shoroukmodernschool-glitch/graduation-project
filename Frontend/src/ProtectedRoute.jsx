import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ⏳ استنى لما Firebase يرد
  if (loading) return <div>Loading...</div>;

  // ❌ مش مسجل
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ مسجل
  return children;
}