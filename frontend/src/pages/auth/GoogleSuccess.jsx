import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleSuccess() {

  const navigate = useNavigate();

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (token && userParam) {

      const user = JSON.parse(decodeURIComponent(userParam));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 Open personalize only if incomplete
      if (!user.nickname || !user.isAdultConfirmed) {
        window.dispatchEvent(new Event("openPersonalize"));
      } else {
        navigate("/");
      }
    }

  }, [navigate]);

  return <p>Logging you in...</p>;
}

export default GoogleSuccess;
