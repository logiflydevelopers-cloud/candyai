import { useEffect } from "react";

function ProtectedRoute({ children, setAuthModal }) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setAuthModal("login");
    }
  }, [token, setAuthModal]);

  if (!token) return null;

  return children;
}

export default ProtectedRoute;
