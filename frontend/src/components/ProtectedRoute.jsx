import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function ProtectedRoute({ children, setAuthModal, requirePaid = false }) {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkPlan = async () => {
      try {
        const res = await API.get("/plans/my-plan");

        // ❌ No active plan OR free plan → go to premium
        if (!res.data.active || res.data.plan?.isFreePlan) {
          navigate("/premium");
          return;
        }

        setLoading(false);

      } catch (err) {
        console.log("Plan check error:", err);
        navigate("/premium");
      }
    };

    // ❌ Not logged in
    if (!token) {
      setAuthModal("login");
      return;
    }

    // ✅ Paid route check
    if (requirePaid) {
      checkPlan();
    } else {
      setLoading(false);
    }

  }, [token, requirePaid, navigate, setAuthModal]);

  // ❌ Not logged in → render nothing
  if (!token) return null;

  // ⏳ Loading state
  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        Loading...
      </div>
    );
  }

  // ✅ All good → render page
  return children;
}

export default ProtectedRoute;