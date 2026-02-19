import React, { useState } from "react";
import API from "../api/axios";
import "./Settings.css";

function Settings() {

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const [nickname, setNickname] = useState(storedUser.nickname || "");
  const [gender, setGender] = useState(storedUser.gender || "");

  // 🔥 PASSWORD MODAL STATES
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const saveProfile = async () => {
    try {
      const res = await API.post(
        "/auth/complete-profile",
        { nickname, gender },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Profile Updated");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const changePassword = async () => {

    if (!oldPassword || !newPassword)
      return alert("All fields required");

    if (newPassword.length < 6)
      return alert("Password must be minimum 6 characters");

    try {
      await API.post(
        "/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password Updated Successfully");

      setOldPassword("");
      setNewPassword("");
      setShowPasswordModal(false);

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure to delete account?")) return;

    try {
      await API.delete("/auth/delete-account", {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.clear();
      window.location.href = "/";

    } catch (err) {
      alert("Error deleting account");
    }
  };

  return (
    <div className="settings-page">

      <h1 className="settings-page-title">Profile Settings</h1>

      <div className="settings-profile-card">

        <div className="settings-avatar">
          {nickname?.charAt(0)?.toUpperCase()}
        </div>

        <div className="settings-profile-info">

          <div className="settings-row">

            <div className="settings-field">
              <label>Nickname</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

          </div>

          <div className="settings-row">

            <div className="settings-field">
              <label>E-mail</label>
              <input value={storedUser?.email || ""} disabled />

            </div>

            <div className="settings-field">
              <label>Password</label>

              <div className="settings-display-field">
                <span>********</span>

                <button
                  className="edit-icon-btn"
                  onClick={() => setShowPasswordModal(true)}
                >
                  ✏
                </button>
              </div>
            </div>

          </div>

          <button className="settings-save-btn" onClick={saveProfile}>
            Save Changes
          </button>

        </div>
      </div>

      {/* PLAN CARD */}
      <div className="settings-plan-card">
        <div>
          <span className="settings-plan-text">Current Plan</span>
          <span className="settings-plan-type">Free</span>
        </div>

        <button className="settings-upgrade-btn">
          Upgrade to Premium
        </button>
      </div>

      {/* LANGUAGE */}
      <div className="settings-box">
        <h3>Language</h3>
        <button className="settings-lang-btn">
          🇺🇸 English
        </button>
      </div>

      {/* NOTIFICATION */}
      <div className="settings-box">
        <h3>Automatic Notifications</h3>

        <label className="settings-checkbox">
          <input type="checkbox" defaultChecked />
          <span>
            As a user, you will receive automatic notifications from us.
          </span>
        </label>
      </div>

      {/* DANGER ZONE */}
      <div className="settings-danger-box">
        <div>
          <strong>Danger Zone</strong>
          <p>If you want to permanently delete this account and all of its data.</p>
        </div>

        <button onClick={deleteAccount}>
          Delete account
        </button>
      </div>

      {/* 🔥 PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="settings-modal-overlay">

          <div className="settings-modal">

            <button
              className="modal-close"
              onClick={() => setShowPasswordModal(false)}
            >
              ×
            </button>

            <h2>Edit Password</h2>

            <div className="modal-field">
              <input
                type={showOld ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <span onClick={() => setShowOld(!showOld)}>👁</span>
            </div>

            <div className="modal-field">
              <input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span onClick={() => setShowNew(!showNew)}>👁</span>
            </div>

            <button
              className="modal-save-btn"
              onClick={changePassword}
            >
              Save Changes
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Settings;
