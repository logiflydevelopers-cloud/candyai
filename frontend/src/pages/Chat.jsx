import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { FiPhone } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";

import API from "../api/axios";

import ChatList from "../components/ChatList";
import ChatMessages from "../components/ChatMessages";
import ChatProfile from "../components/ChatProfile";

import "./Chat.css";

function Chat({ sidebarOpen }) {

  const { characterId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [character, setCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileOpen, setProfileOpen] = useState(window.innerWidth > 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(() => {
    if (window.innerWidth <= 768) {
      return !window.location.pathname.includes("/chat/");
    }
    return false;
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadChats = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await API.get("/chat/list");
      setConversations(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleResetConfirm = async () => {
    try {
      await API.post(`/chat/reset/${characterId}`);

      const msgRes = await API.get(`/chat/messages/${characterId}`);
      setMessages(msgRes.data);

      setShowResetConfirm(false);

    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/chat/delete/${characterId}`);

      const res = await API.get("/chat/list");
      const chats = res.data || [];

      setConversations(chats);

      if (chats.length > 0) {
        navigate(`/chat/${chats[0].characterId._id}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }

      setShowDeleteConfirm(false);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });

      setTimeout(() => {
        window.dispatchEvent(new Event("openLogin"));
      }, 200);
    }
  }, [navigate]);

  useEffect(() => {
    loadChats();
  }, [characterId]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setMobileListOpen(!characterId);
    }
  }, [characterId]);

  useEffect(() => {
    const init = async () => {

      const token = localStorage.getItem("token");
      if (!token) return;

      if (!characterId) {
        try {
          const res = await API.get("/chat/list");
          const chats = res.data || [];

          if (chats.length > 0) {
            navigate(`/chat/${chats[0].characterId._id}`, { replace: true });
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    init();
  }, [characterId, navigate]);

  useEffect(() => {
    setMessages([]);
    setCharacter(null);
  }, [characterId]);

  useEffect(() => {

    if (window.innerWidth <= 768) {
      setProfileOpen(false);
    }

  }, [characterId]);

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) return;

    const loadChat = async () => {
      if (!characterId) return;

      setLoading(true);

      try {
        await API.get(`/chat/open/${characterId}`);
        await loadChats();

        const [charRes, msgRes] = await Promise.all([
          API.get(`/characters/${characterId}`),
          API.get(`/chat/messages/${characterId}`)
        ]);

        setCharacter(charRes.data);
        setMessages(msgRes.data);

      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    loadChat();

  }, [characterId]);

  return (
    <>
      <div className={`main-layout chat-page ${sidebarOpen ? "expanded" : "collapsed"}`}>

        <div className="chat-layout">

          {/* LEFT SIDEBAR */}

          <ChatList
            conversations={conversations}
            navigate={navigate}
            active={characterId}
            refresh={loadChats}
            mobileOpen={mobileListOpen}
            closeMobile={() => setMobileListOpen(false)}
          />

          {/* CHAT MAIN */}

          <div className="chat-main">

            {loading ? (

              <div className="empty-chat">
                Loading chat...
              </div>

            ) : character && (

              <>

                {/* HEADER */}

                <div className="chat-header">

                  <div className="chat-user">

                    {/* MOBILE BACK */}
                    <IoArrowBack
                      className="mobile-back"
                      onClick={() => {

                        setProfileOpen(false);
                        setMobileListOpen(true);

                      }}
                    />

                    <img
                      src={`https://candyai.onrender.com/uploads/${character.images[0]}`}
                      alt={character.name || "avatar"}
                      onClick={() => {

                        if (window.innerWidth <= 768) {
                          setProfileOpen(true);
                          setMobileListOpen(false);
                        } else {
                          setProfileOpen(!profileOpen);
                        }

                      }}
                    />

                    <span>{character.name}</span>

                  </div>

                  <div className="chat-header-actions">

                    <FiPhone />

                    <div className="menu-wrapper">

                      <HiOutlineDotsVertical
                        onClick={() => setMenuOpen(!menuOpen)}
                      />

                      {menuOpen && (

                        <div className="chat-menu">

                          <div
                            className="chat-menu-item"
                            onClick={() => {
                              setMenuOpen(false);
                              setShowResetConfirm(true);
                            }}
                          >
                            <HiOutlineRefresh />
                            Reset chat
                          </div>

                          <div
                            className="chat-menu-item delete"
                            onClick={() => {
                              setMenuOpen(false);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <FiTrash2 />
                            Delete chat
                          </div>

                        </div>

                      )}

                    </div>

                    <HiOutlineMenuAlt2
                      onClick={() => setProfileOpen(!profileOpen)}
                    />

                  </div>

                </div>

                {/* BODY */}

                <div className="chat-body">

                  <div className="chat-left">

                    <ChatMessages
                      messages={messages}
                      character={character}
                      setMessages={setMessages}
                    />

                  </div>

                  <div className={`chat-details ${profileOpen ? "open" : ""}`}>
                    <ChatProfile
                      character={character}
                      onBack={() => setProfileOpen(false)}
                    />
                  </div>

                </div>

              </>

            )}

          </div>

        </div>

      </div>
      {
        showResetConfirm && (
          <div className="reset-overlay">
            <div className="reset-modal">

              <button
                className="reset-close"
                onClick={() => setShowResetConfirm(false)}
              >
                ✕
              </button>

              <h2>Reset chat?</h2>

              <p>
                This will start a new conversation. Your current chat history will be cleared.
              </p>

              <div className="reset-actions">
                <button
                  className="reset-cancel"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </button>

                <button
                  className="reset-confirm"
                  onClick={handleResetConfirm}
                >
                  Yes, Reset
                </button>
              </div>

            </div>
          </div>
        )
      }

      {
        showDeleteConfirm && (
          <div className="reset-overlay">
            <div className="reset-modal">

              <button
                className="reset-close"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ✕
              </button>

              <h2>Delete chat?</h2>

              <p>
                Are you sure you want to delete this chat? All messages will be lost.
              </p>

              <div className="reset-actions">
                <button
                  className="reset-cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>

                <button
                  className="reset-confirm"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        )
      }

    </>
  );

}

export default Chat;