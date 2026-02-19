import React, { useState, useRef } from "react";
import API from "../../api/axios";
import "./Auth.css";

function ForgotPassword({ close }) {

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef([]);

  /* =========================
     STEP 1 → SEND OTP
  =========================*/
  const sendOtp = async () => {
    try {
      setLoading(true);
      const res = await API.post("/auth/send-otp", { email });
      setMessage(res.data.message);
      setError("");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STEP 2 → VERIFY OTP
  =========================*/
  const verifyOtp = () => {
    if (otp.length !== 6) {
      return setError("Enter valid 6 digit OTP");
    }
    setError("");
    setStep(3);
  };

  /* =========================
     STEP 3 → RESET PASSWORD
  =========================*/
  const resetPassword = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword
      });

      setMessage(res.data.message);
      setError("");

      // 🔥 AUTO LOGIN AFTER RESET
      const loginRes = await API.post("/auth/login", {
        email,
        password: newPassword
      });

      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      setTimeout(() => {
        close();
        window.location.reload();
      }, 1200);

    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     OTP INPUT HANDLER
  =========================*/
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("");
    setOtp(updatedOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal small">

        <div className="close-btn" onClick={close}>✕</div>

        <div className="auth-right full">
          <h2>Reset Password</h2>

          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? "active" : ""}`}></div>
            <div className={`step-dot ${step >= 2 ? "active" : ""}`}></div>
            <div className={`step-dot ${step >= 3 ? "active" : ""}`}></div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                className="auth-input"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button className="auth-btn" onClick={sendOtp}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="otp-container">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    maxLength="1"
                    className="otp-box"
                    ref={(el) => (otpRefs.current[i] = el)}
                    onChange={(e) =>
                      handleOtpChange(e.target.value, i)
                    }
                  />
                ))}
              </div>

              <button className="auth-btn" onClick={verifyOtp}>
                Verify OTP
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <input
                className="auth-input"
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button className="auth-btn" onClick={resetPassword}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
