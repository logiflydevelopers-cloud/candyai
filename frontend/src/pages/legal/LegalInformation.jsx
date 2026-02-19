import React from "react";
import { useNavigate } from "react-router-dom";
import Home from "../Home";          // 👈 Add this
import "./Legal.css";

function LegalInformation({ sidebarOpen }) {

  const navigate = useNavigate();

  const pages = [
    { name: "Terms of Service", path: "/legal/terms-of-service" },
    { name: "Privacy Notice", path: "/legal/privacy-notice" },
    { name: "Cookies Notice", path: "/legal/cookies-notice" },
    { name: "Underage Policy", path: "/legal/underage-policy" },
    { name: "Content Removal Policy", path: "/legal/content-removal-policy" },
    { name: "Blocked Content Policy", path: "/legal/blocked-content-policy" },
    { name: "DMCA Policy", path: "/legal/dmca-policy" },
    { name: "Complaint Policy", path: "/legal/complaint-policy" },
    { name: "18 U.S.C. 2257 Exemption", path: "/legal/2257-exemption" },
    { name: "Community Guidelines", path: "/legal/community-guidelines" },
  ];

  return (
    <Home sidebarOpen={sidebarOpen}>

      <div className="legal-page">
        <h1>Legal Information</h1>

        <div className="legal-grid">
          {pages.map((item, index) => (
            <div
              key={index}
              className="legal-card"
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

    </Home>
  );
}

export default LegalInformation;
