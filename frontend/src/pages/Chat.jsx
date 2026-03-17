import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

import { FiPhone } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";

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
  const [mobileListOpen, setMobileListOpen] = useState(!characterId);

  const loadChats = useCallback(async () => {

    try {

      const res = await API.get("/chat/list");
      const chats = res.data || [];

      setConversations(chats);

      if (!characterId && chats.length > 0) {
        navigate(`/chat/${chats[0].characterId._id}`, { replace: true });
      }

    } catch (err) {
      console.log(err);
    }

  }, [characterId, navigate]);

  const resetChat = async () => {

    try {

      await API.post(`/chat/reset/${characterId}`);

      const msgRes = await API.get(`/chat/messages/${characterId}`);
      setMessages(msgRes.data);

      setMenuOpen(false);

    } catch (err) {
      console.log(err);
    }

  };

  const deleteChat = async () => {

    try {

      await API.delete(`/chat/delete/${characterId}`);

      setMessages([]);   // ⭐ important
      setCharacter(null);

      navigate("/chat", { replace: true });

      loadChats();

    } catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {
    loadChats();
  }, [loadChats]);

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

    const loadChat = async () => {

      if (!characterId) return;

      setLoading(true);

      try {

        await API.get(`/chat/open/${characterId}`);
        loadChats();

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

  }, [characterId, loadChats]);

  return (

    <div className={`main-layout ${sidebarOpen ? "expanded" : "collapsed"}`}>

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
                          onClick={resetChat}
                        >
                          Reset chat
                        </div>

                        <div
                          className="chat-menu-item delete"
                          onClick={deleteChat}
                        >
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

  );

}

export default Chat;