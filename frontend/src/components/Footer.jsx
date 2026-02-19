import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import visa from "../image/visa.svg";
import master from "../image/master.svg";

function Footer() {

  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-col brand">
          <h2 className="logo" onClick={() => navigate("/")}>
            candy<span>.ai</span><sup className="sup-footer">®</sup>
          </h2>

          <p className="desc">
            Candy AI powers immersive experiences that feel real,
            allowing users to generate images and create AI characters.
          </p>

          <div className="contact">
            <p><strong>Contacts:</strong></p>
            <p>
              EverAI Limited, Nr. C107181 56 Central Business Centre,
              Triq Is-Soll, Santa Venera SVR 1833, Malta
            </p>
          </div>

          <p className="copyright">
            © 2026 Candy.ai. All Rights Reserved —
            <span onClick={() => navigate("/sitemap")}> Sitemap</span>
          </p>
        </div>

        {/* Features */}
        <div className="footer-col">
          <h4>Features</h4>
          <ul>
            <li onClick={() => navigate("/generate/girls")}>Generate Image</li>
            <li onClick={() => navigate("/chat")}>Chat</li>
            <li onClick={() => navigate("/create-character/girls")}>Create Character</li>
            <li onClick={() => navigate("/collection")}>Gallery</li>
            <li onClick={() => navigate("/my-ai")}>My AI</li>
          </ul>
        </div>

        {/* Popular */}
        <div className="footer-col">
          <h4>Popular</h4>
          <ul>
            <li onClick={() => navigate("/")}>Candy AI</li>
            <li onClick={() => navigate("/girls")}>AI Girlfriend</li>
            <li onClick={() => navigate("/anime")}>AI Anime</li>
            <li onClick={() => navigate("/guys")}>AI Boyfriend</li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-col">
          <h4>Legal & Support</h4>
          <ul>
            <li onClick={() => navigate("/legal")}>Terms and Policies</li>
            <li onClick={() => navigate("/help-center")}>Help Center</li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li onClick={() => navigate("/careers")}>We're hiring</li>
          </ul>

          <div className="social">
            <FaDiscord />
            <FaXTwitter />
          </div>

          <div className="payments">
            <img src={visa} alt="visa" />
            <img src={master} alt="mastercard" />
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
