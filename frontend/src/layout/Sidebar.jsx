import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiChevronDown, FiSettings, FiLogOut } from "react-icons/fi";
import "./Sidebar.css";

// ICONS
import HomeIcon from "../image/Home.svg";
import DiscoverIcon from "../image/Discover.svg";
import ChatIcon from "../image/Chat.svg";
import CollectionIcon from "../image/Collection.svg";
import GenerateIcon from "../image/Generate Image.svg";
import CreateIcon from "../image/Create Character.svg";
import MyAiIcon from "../image/My AI.svg";
import PremiumIcon from "../image/Premium.svg";
import LanguageIcon from "../image/Language.svg";

function Sidebar({ open, disableTransition }) {

  const navigate = useNavigate();
  const location = useLocation();
  const isPremiumActive = location.pathname === "/premium";
  const [profileOpen, setProfileOpen] = useState(false);

  // 🔥 Detect Active Category from URL
  const getActiveCategory = () => {
    if (location.pathname.includes("guys")) return "guys";
    if (location.pathname.includes("anime")) return "anime";
    return "girls"; // default
  };

  const activeCategory = getActiveCategory();

  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      user = JSON.parse(stored);
    }
  } catch {
    localStorage.removeItem("user");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.dispatchEvent(new Event("openLogin"));
  };

  const menuItems = [
    { name: "Home", icon: HomeIcon, path: "/" },
    { name: "Discover", icon: DiscoverIcon, path: "/discover" },
    { name: "Chat", icon: ChatIcon, path: "/chat" },
    { name: "Collection", icon: CollectionIcon, path: "/collection" },

    // 🔥 Dynamic Category Based Links
    {
      name: "Generate Image",
      icon: GenerateIcon,
      path: `/generate/${activeCategory}`
    },

    {
      name: "Create Character",
      icon: CreateIcon,
      path: `/create-character/${activeCategory}`
    },

    { name: "My AI", icon: MyAiIcon, path: "/my-ai" },
  ];

  return (
    <div
      className={`sidebar ${open ? "expanded" : "collapsed"} ${disableTransition ? "no-transition" : ""
        }`}
    >

      {/* PROFILE */}
      {user && (
        <>
          <div
            className="sidebar-profile-header"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="sidebar-avatar">
              {user.nickname?.charAt(0).toUpperCase()}
            </div>

            {open && (
              <>
                <span className="sidebar-profile-name">My Profile</span>
                <FiChevronDown
                  className={`chevron ${profileOpen ? "rotate" : ""}`}
                />
              </>
            )}
          </div>

          <div
            className={`sidebar-profile-dropdown ${profileOpen ? "open" : ""
              }`}
          >
            <div
              className="sidebar-sub-item"
              onClick={() => navigate("/subscription")}
            >
              Subscription
            </div>

            <div
              className="sidebar-sub-item"
              onClick={() => navigate("/settings")}
            >
              <FiSettings /> Settings
            </div>

            <div
              className="sidebar-sub-item logout"
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </div>
          </div>

          <div className="sidebar-divider"></div>
        </>
      )}

      {/* MENU */}
      {menuItems.map((item, index) => {

        let isActive = false;

        if (item.path === "/") {
          const homePaths = ["/", "/girls", "/anime", "/guys"];
          isActive = homePaths.includes(location.pathname);
        } else {
          isActive = location.pathname.startsWith(item.path);
        }


        return (
          <div
            key={index}
            className={`sidebar-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <img src={item.icon} alt="" className="sidebar-icon" />
            {open && <span className="text">{item.name}</span>}
          </div>
        );
      })}


      {/* PREMIUM */}
      <div
        className={`sidebar-item premium-btn-sidebar ${isPremiumActive ? "active-premium" : ""}`}
        onClick={() => navigate("/premium")}
      >
        <img src={PremiumIcon} alt="" className="sidebar-icon" />
        {open && (
          <>
            <span className="text premium-text">Premium</span>
            <span className="premium-badge">70% OFF</span>
          </>
        )}
      </div>

      <div className="sidebar-bottom">
      </div>
      <div className="sidebar-item">
        <img src={LanguageIcon} alt="" className="sidebar-icon" />
        {open && <span className="text">English</span>}
      </div>
    </div>
  );
}

export default Sidebar;
