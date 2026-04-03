import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import {
  FiMenu,
  FiChevronDown,
  FiSettings,
  FiLogOut
} from "react-icons/fi";
import { FaGem } from "react-icons/fa";
import Girls from "../image/Girls.svg";
import Anime from "../image/Anime.svg";
import Guys from "../image/Guys.svg";
import TokenIcon from "../image/TokenIcon.svg";

function Navbar({ toggleSidebar, sidebarOpen, setAuthModal }) {

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userPlan, setUserPlan] = useState(null);

  const [activeCategory, setActiveCategory] = useState(() => {
    return localStorage.getItem("activeCategory") || "girls";
  });

  const profileRef = useRef();
  const categoryRef = useRef();

  /* ================= USER ================= */

  let user = null;

  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      user = JSON.parse(stored);
    }
  } catch (err) {
    localStorage.removeItem("user");
  }

  const displayName = user?.nickname || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    // ✅ STEP 1: initial load (login પછી પણ run થશે)
    fetchUserPlan();

    // ✅ STEP 2: realtime update listener
    const update = (e) => {
      if (e.detail) {
        setUserPlan(e.detail);
        localStorage.setItem("userPlan", JSON.stringify(e.detail));
      } else {
        fetchUserPlan();
      }
    };

    window.addEventListener("planUpdated", update);

    return () => window.removeEventListener("planUpdated", update);
  }, []);

  const fetchUserPlan = async () => {
    try {
      // ✅ instant UI
      const cached = localStorage.getItem("userPlan");
      if (cached) {
        setUserPlan(JSON.parse(cached));
      }

      // ✅ API call
      const res = await fetch("https://candyai.onrender.com/api/plans/my-plan", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      if (data.active) {
        setUserPlan(data.plan);

        // ✅ cache update
        localStorage.setItem("userPlan", JSON.stringify(data.plan));
      } else {
        setUserPlan(null);
        localStorage.removeItem("userPlan");
      }

    } catch {
      setUserPlan(null);
    }
  };

  /* ================= OUTSIDE CLICK ================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= CATEGORY SELECT ================= */

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    localStorage.setItem("activeCategory", category);
    setCategoryOpen(false);
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/girls");
    window.dispatchEvent(new Event("openLogin"));
  };

  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="left">

        <div
          className="hamburger"
          onClick={() => {
            toggleSidebar();
            setCategoryOpen(false);
          }}
        >
          <FiMenu />
        </div>

        {/* LOGO */}
        <NavLink
          to="/"
          className="logo-header"
          onClick={() => handleCategorySelect("girls")}
        >
          candy<span>.ai</span>
        </NavLink>


        {/* MOBILE CATEGORY (ICON ONLY) */}
        <div
          className="mobile-category-icon"
          onClick={() => setCategoryOpen(!categoryOpen)}
          ref={categoryRef}
        >
          {activeCategory === "girls" && <img src={Girls} alt="Girls" className="anime-icon" />}
          {activeCategory === "guys" && <img src={Guys} alt="Guys" className="anime-icon" />}
          {activeCategory === "anime" && <img src={Anime} alt="Anime" className="anime-icon" />}

          <FiChevronDown className={categoryOpen ? "rotate" : ""} />

          <div className={`mobile-category-dropdown ${categoryOpen ? "show" : ""}`}>

            <NavLink
              to="/girls"
              className={activeCategory === "girls" ? "active" : ""}
              onClick={() => handleCategorySelect("girls")}
            >
              <img src={Girls} alt="Girls" className="anime-icon" /> Girls
            </NavLink>

            <NavLink
              to="/anime"
              className={activeCategory === "anime" ? "active" : ""}
              onClick={() => handleCategorySelect("anime")}
            >
              <img src={Anime} alt="Anime" className="anime-icon" />  Anime
            </NavLink>

            <NavLink
              to="/guys"
              className={activeCategory === "guys" ? "active" : ""}
              onClick={() => handleCategorySelect("guys")}
            >
              <img src={Guys} alt="Guys" className="anime-icon" /> Guys
            </NavLink>

          </div>
        </div>

        {/* DESKTOP MENU */}
        <div className="menu">

          <NavLink
            to="/girls"
            className={activeCategory === "girls" ? "active" : ""}
            onClick={() => handleCategorySelect("girls")}
          >
            <img src={Girls} alt="Girls" className="anime-icon" /> Girls
          </NavLink>

          <NavLink
            to="/anime"
            className={activeCategory === "anime" ? "active" : ""}
            onClick={() => handleCategorySelect("anime")}
          >
            <img src={Anime} alt="Anime" className="anime-icon" />  Anime
          </NavLink>

          <NavLink
            to="/guys"
            className={activeCategory === "guys" ? "active" : ""}
            onClick={() => handleCategorySelect("guys")}
          >
            <img src={Guys} alt="Guys" className="anime-icon" /> Guys
          </NavLink>

        </div>

      </div>

      {/* RIGHT */}
      <div className="right">

        {!user ? (
          <>
            <button
              className="primary-btn"
              onClick={() => setAuthModal("register")}
            >
              Create Account
            </button>

            <button
              className="outline-btn"
              onClick={() => setAuthModal("login")}
            >
              Login
            </button>
          </>
        ) : (
          <div className="profile-container" ref={profileRef}>

            <div
              onClick={() => navigate(userPlan ? "/tokens" : "/subscription")}
            >
              {userPlan && !userPlan.isFreePlan ? (

                <>
                  {/* 💻 DESKTOP */}
                  <div className="navbar-token-box desktop-only">
                    <img src={TokenIcon} alt="token" className="token-img" />
                    <span className="token-text">
                      Tokens {userPlan?.tokens?.total || userPlan?.planTokens || 0}
                    </span>
                    <span className="token-plus">+</span>
                  </div>

                  {/* 📱 MOBILE */}
                  <div className="navbar-token-mobile mobile-only">
                    <img src={TokenIcon} alt="token" className="token-img" />
                    <span className="token-text">
                      {userPlan?.tokens?.total || userPlan?.planTokens || 0}
                    </span>
                    <span className="token-plus">+</span>
                  </div>
                </>

              ) : (

                <div className="premium-btn-navbar">
                  <FaGem />
                  Premium 70% OFF
                </div>

              )}
            </div>

            <div
              className="profile-box"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="avatar">{firstLetter}</div>
              <span>My Profile</span>
              <FiChevronDown className={profileOpen ? "rotate" : ""} />
            </div>

            <div className={`profile-dropdown ${profileOpen ? "show" : ""}`}>

              <div
                className="dropdown-item"
                onClick={() => {
                  navigate("/subscription");
                  setProfileOpen(false);
                }}
              >
                <FaGem /> Subscription
              </div>

              <div
                className="dropdown-item"
                onClick={() => {
                  navigate("/settings");
                  setProfileOpen(false);
                }}
              >
                <FiSettings /> Settings
              </div>

              <div
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <FiLogOut /> Logout
              </div>

            </div>

          </div>
        )}

      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div
          className="mobile-overlay"
          onClick={toggleSidebar}
        />
      )}

    </div>
  );
}

export default Navbar;
