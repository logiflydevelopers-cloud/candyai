import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

import Guys from "./pages/Guys";
import Girls from "./pages/Girls";
import Anime from "./pages/Anime";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PersonalizeModal from "./pages/auth/PersonalizeModal";

import Chat from "./pages/Chat";
import Collection from "./pages/Collection";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleSuccess from "./pages/auth/GoogleSuccess";
import Settings from "./pages/Settings";

// Generate Pages
import GenerateGirls from "./pages/generate/GenerateGirls";
import GenerateGuys from "./pages/generate/GenerateGuys";
import GenerateAnime from "./pages/generate/GenerateAnime";

// Create Character Pages
import CreateGirls from "./pages/createCharacter/CreateGirls";
import CreateGuys from "./pages/createCharacter/CreateGuys";
import CreateAnime from "./pages/createCharacter/CreateAnime";

import LegalInformation from "./pages/legal/LegalInformation";
import TermsOfService from "./pages/legal/TermsOfService";
import CookiesNotice from "./pages/legal/CookiesNotice";
import UnderagePolicy from "./pages/legal/UnderagePolicy";
import ContentRemovalPolicy from "./pages/legal/ContentRemovalPolicy";
import BlockedContentPolicy from "./pages/legal/BlockedContentPolicy";
import DMCAPolicy from "./pages/legal/DMCAPolicy";
import ComplaintPolicy from "./pages/legal/ComplaintPolicy";
import Exemption2257 from "./pages/legal/Exemption2257";
import CommunityGuidelines from "./pages/legal/CommunityGuidelines";




import "./App.css";

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 768
  );

  const [disableTransition, setDisableTransition] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [showPersonalize, setShowPersonalize] = useState(false);

  /* ===============================
     LOGIN OPEN EVENT
  =================================*/
  useEffect(() => {
    const openLogin = () => setAuthModal("login");
    window.addEventListener("openLogin", openLogin);
    return () => window.removeEventListener("openLogin", openLogin);
  }, []);

  /* ===============================
     PERSONALIZE OPEN EVENT
  =================================*/
  useEffect(() => {
    const openPersonalize = () => setShowPersonalize(true);
    window.addEventListener("openPersonalize", openPersonalize);
    return () => window.removeEventListener("openPersonalize", openPersonalize);
  }, []);

  /* ===============================
     AUTO OPEN PERSONALIZE AFTER LOGIN
  =================================*/
  useEffect(() => {
    const token = localStorage.getItem("token");
    let user = null;

    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined") {
        user = JSON.parse(stored);
      }
    } catch (e) {
      localStorage.removeItem("user");
    }


    if (
      token &&
      user &&
      (!user.nickname || !user.isAdultConfirmed)
    ) {
      setShowPersonalize(true);
    }
  }, []);


  /* ===============================
     HANDLE RESIZE
  =================================*/
  useEffect(() => {
    const handleResize = () => {

      setDisableTransition(true);

      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }

      setTimeout(() => {
        setDisableTransition(false);
      }, 50);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===============================
     LOCK BODY SCROLL
  =================================*/
  useEffect(() => {
    document.body.style.overflow =
      authModal || showPersonalize ? "hidden" : "auto";
  }, [authModal, showPersonalize]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <Router>

      <div className={authModal || showPersonalize ? "app-blur" : ""}>
        <Navbar
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          setAuthModal={setAuthModal}
        />

        <Sidebar
          open={sidebarOpen}
          disableTransition={disableTransition}
        />
      </div>

      <div
        className={`main-content ${authModal || showPersonalize ? "app-blur" : ""
          } ${sidebarOpen && window.innerWidth <= 768
            ? "blur-bg"
            : ""
          }`}
      >
        <Routes>
          <Route path="/" element={<Girls sidebarOpen={sidebarOpen} />} />
          <Route path="/girls" element={<Girls sidebarOpen={sidebarOpen} />} />
          <Route path="/anime" element={<Anime sidebarOpen={sidebarOpen} />} />
          <Route path="/guys" element={<Guys sidebarOpen={sidebarOpen} />} />



          <Route path="/google-success" element={<GoogleSuccess />} />

          <Route
            path="/chat"
            element={
              <ProtectedRoute setAuthModal={setAuthModal}>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/collection"
            element={
              <ProtectedRoute setAuthModal={setAuthModal}>
                <Collection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute setAuthModal={setAuthModal}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* ===== GENERATE IMAGE ===== */}
          <Route path="/generate/girls" element={<GenerateGirls />} />
          <Route path="/generate/guys" element={<GenerateGuys />} />
          <Route path="/generate/anime" element={<GenerateAnime />} />

          {/* ===== CREATE CHARACTER ===== */}
          <Route path="/create-character/girls" element={<CreateGirls />} />
          <Route path="/create-character/guys" element={<CreateGuys />} />
          <Route path="/create-character/anime" element={<CreateAnime />} />

          <Route
            path="/legal"
            element={<LegalInformation sidebarOpen={sidebarOpen} />}
          />

          <Route
            path="/legal/terms-of-service"
            element={<TermsOfService sidebarOpen={sidebarOpen} />}
          />

          <Route
            path="/legal/cookies-notice"
            element={<CookiesNotice sidebarOpen={sidebarOpen} />}
          />

          <Route
            path="/legal/underage-policy"
            element={<UnderagePolicy sidebarOpen={sidebarOpen} />}
          />

          <Route
            path="/legal/content-removal-policy"
            element={<ContentRemovalPolicy sidebarOpen={sidebarOpen} />}
          />

          <Route
            path="/legal/blocked-content-policy"
            element={<BlockedContentPolicy sidebarOpen={sidebarOpen} />}
          />

          <Route
            path="/legal/dmca-policy"
            element={<DMCAPolicy sidebarOpen={sidebarOpen} />}
          />

          <Route
            path="/legal/complaint-policy"
            element={<ComplaintPolicy sidebarOpen={sidebarOpen} />}
          />

          <Route
            path="/legal/2257-exemption"
            element={<Exemption2257 sidebarOpen={sidebarOpen} />}
          />

          <Route
            path="/legal/community-guidelines"
            element={<CommunityGuidelines sidebarOpen={sidebarOpen} />}
          />


        </Routes>
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div
          className="mobile-overlay"
          onClick={toggleSidebar}
        />
      )}

      {/* LOGIN MODAL */}
      {authModal === "login" && (
        <Login
          close={() => setAuthModal(null)}
          openRegister={() => setAuthModal("register")}
          openForgot={() => setAuthModal("forgot")}
        />
      )}

      {/* REGISTER MODAL */}
      {authModal === "register" && (
        <Register
          close={() => setAuthModal(null)}
          openLogin={() => setAuthModal("login")}
        />
      )}

      {/* FORGOT PASSWORD */}
      {authModal === "forgot" && (
        <ForgotPassword
          close={() => setAuthModal("login")}
        />
      )}

      {/* 🔥 PERSONALIZE MODAL */}
      {showPersonalize && (
        <PersonalizeModal
          close={() => setShowPersonalize(false)}
        />
      )}

    </Router>
  );
}

export default App;
