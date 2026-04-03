import React, { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { FiChevronDown, FiSettings, FiLogOut } from "react-icons/fi";
import { FaGem } from "react-icons/fa";
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
import TokenIcon from "../image/TokenIcon.svg";
import LanguageIcon from "../image/Language.svg";

function Sidebar({ open, disableTransition, setSidebarOpen }) {

  const navigate = useNavigate();
  const location = useLocation();
  const isPremiumActive = location.pathname === "/premium";
  const [profileOpen, setProfileOpen] = useState(false);
  const [userPlan, setUserPlan] = useState(null);

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

  useEffect(() => {
    fetchUserPlan();
  }, []);

  useEffect(() => {
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
      // ✅ STEP 1: instant UI from localStorage
      const cached = localStorage.getItem("userPlan");
      if (cached) {
        setUserPlan(JSON.parse(cached));
      }

      // ✅ STEP 2: API call
      const res = await API.get("/plans/my-plan");

      if (res.data.active) {
        setUserPlan(res.data.plan);

        // ✅ cache update
        localStorage.setItem("userPlan", JSON.stringify(res.data.plan));
      } else {
        setUserPlan(null);
        localStorage.removeItem("userPlan");
      }

    } catch (err) {
      setUserPlan(null);
    }
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
              onClick={async () => {
                try {
                  const res = await API.get("/plans/my-plan");

                  if (res.data.active && !res.data.plan?.isFreePlan) {
                    navigate("/tokens");
                  } else {
                    navigate("/premium");
                  }

                } catch {
                  navigate("/premium");
                }
              }}
            >
              <FaGem /> Subscription
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
            onClick={() => {

              if (item.name === "Chat") {

                const token = localStorage.getItem("token");

                if (!token) {
                  window.dispatchEvent(new Event("openLogin"));
                  return;
                }

                API.get("/chat/list")
                  .then(res => {
                    const chats = res.data || [];

                    if (chats.length === 0) {
                      toast.error("Please add a character to start chatting");
                      return;
                    }

                    navigate(`/chat/${chats[0].characterId._id}`);

                    // ✅ 🔥 ADD THIS
                    setSidebarOpen(false);

                  })
                  .catch(() => {
                    window.dispatchEvent(new Event("openLogin"));
                  });

                return;
              }

              navigate(item.path);

              // 🔥 AUTO CLOSE / COLLAPSE SIDEBAR
              if (window.innerWidth <= 768) {
                // 📱 Mobile → completely close
                setSidebarOpen(false);
              } else {
                // 💻 Desktop → collapse (optional)
                setSidebarOpen(false);
              }

            }}
          >
            <img src={item.icon} alt="" className="sidebar-icon" />
            {open && <span className="text">{item.name}</span>}
          </div>
        );
      })}


      {/* PREMIUM */}
      <div
        className={`sidebar-item premium-btn-sidebar ${isPremiumActive ? "active-premium" : ""}`}
        onClick={async () => {
          const token = localStorage.getItem("token");

          if (!token) {
            window.dispatchEvent(new Event("openLogin"));
            return;
          }

          try {
            const res = await API.get("/plans/my-plan");

            if (res.data.active) {
              navigate("/tokens");
            } else {
              navigate("/premium");
            }

          } catch {
            navigate("/premium");
          }

          setSidebarOpen(false);
        }}
      >
        <div className="premium-inner">

          {/* 🔥 CHANGE ICON BASED ON SIDEBAR */}
          <img
            src={userPlan && !userPlan.isFreePlan ? TokenIcon : PremiumIcon}
            alt=""
            className={`sidebar-icon ${!open ? "collapsed-icon" : ""}`}
          />

          {/* 🔥 TEXT ONLY WHEN OPEN */}
          {open && (
            <>
              {userPlan && !userPlan.isFreePlan ? (
                <>
                  <span className="text premium-text">Buy Tokens</span>
                </>
              ) : (
                <>
                  <span className="text premium-text">Premium</span>
                  <span className="premium-badge">-60%</span>
                </>
              )}
            </>
          )}

        </div>
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
