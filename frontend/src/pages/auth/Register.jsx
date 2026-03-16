import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../../api/axios";
import "./Auth.css";
import loginImage from "../../image/login.png";
import googleLogo from "../../image/google-auth.png";

function Register({ close, openLogin }) {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.includes("@"))
      return setError("Invalid Email");

    if (form.password.length < 6)
      return setError("Password must be minimum 6 characters");

    try {
      setLoading(true);

      await API.post("/auth/register", form);

      alert("Registration Successful ✅ Please login");

      close();
      openLogin();

    } catch (err) {

      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration Failed");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">

        <div className="close-btn" onClick={close}>✕</div>

        <div className="auth-left">
          <img src={loginImage} alt="register" />
        </div>

        <div className="auth-right">

          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>

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

            {error && <p className="error">{error}</p>}

            <button className="auth-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Free Account"}
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
            Already have an account?
            <span onClick={() => {
              close();
              openLogin();
            }}>
              {" "}Sign in
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;
