import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../../api/axios";
import "./Auth.css";
import loginImage from "../../image/login.png";
import googleLogo from "../../image/google-auth.png";

function Login({ openRegister, close, openForgot }) {

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.includes("@"))
      return setError("Please enter valid email");

    if (form.password.length < 6)
      return setError("Password must be minimum 6 characters");

    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      close();

      // 🔥 Check if profile incomplete
      if (!res.data.user.nickname || !res.data.user.isAdultConfirmed) {
        window.dispatchEvent(new Event("openPersonalize"));
      }



    } catch (err) {

      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://candyai.onrender.com/api/auth/google";
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">

        <div className="close-btn" onClick={close}>✕</div>

        {/* LEFT IMAGE */}
        <div className="auth-left">
          <img src={loginImage} alt="login" />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <h2>Sign in</h2>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: "right", marginBottom: "10px" }}>
              <span
                style={{ cursor: "pointer", color: "#ff4d6d", fontSize: "14px" }}
                onClick={() => {
                  close();
                  openForgot();
                }}
              >
                Forgot Password?
              </span>
            </div>

            {error && <p className="error">{error}</p>}

            <button className="auth-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <div className="auth-divider">
            <div className="divider-line left"></div>
            <span>or sign in with</span>
            <div className="divider-line right"></div>
          </div>

          <button
            className="social-btn google-btn"
            onClick={handleGoogleLogin}
          >
            <img src={googleLogo} alt="google" className="google-icon" />
            <span>Continue with Google</span>
          </button>

          <div className="auth-footer">
            Don’t have an account?
            <span onClick={openRegister}> Sign up</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
