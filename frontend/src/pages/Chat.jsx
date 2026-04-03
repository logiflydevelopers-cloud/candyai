import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Room } from "livekit-client";

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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [showCallConfirm, setShowCallConfirm] = useState(false);
  const [showMicPopup, setShowMicPopup] = useState(false);
  const [showCallingUI, setShowCallingUI] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [callStatus, setCallStatus] = useState("Ringing...");

  const [mobileListOpen, setMobileListOpen] = useState(() => {
    return window.innerWidth <= 768; // mobile → open list by default
  });

  const loadChats = async () => {
    const token = localStorage.getItem("token");
    if (!token) return [];

    try {
      const res = await API.get("/chat/list");
      const chats = res.data || [];
      setConversations(chats);
      return chats;
    } catch (err) {
      console.log(err);
      return [];
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

  // ================== CALL FLOW ==================

  const handleStartCall = async () => {
    setShowCallConfirm(false);

    try {
      await startLiveCall();
    } catch {
      setShowMicPopup(true);
    }
  };

  const roomRef = useRef(null);

  const connectToLivekit = async (token, url) => {
    let interval;
    let audioContext;

    let mediaRecorder;
    let audioChunks = [];

    try {
      const room = new Room();
      room.on("connected", () => {
        console.log("✅ CONNECTED TO LIVEKIT");
        setCallStatus("Connected");
      });

      room.on("participantConnected", (participant) => {
        console.log("🔥 AI JOINED:", participant.identity);
        setCallStatus("Connected");
      });

      room.on("trackSubscribed", (track, pub, participant) => {
        console.log("🎧 TRACK RECEIVED:", track.kind);

        if (track.kind === "audio") {
          const audio = track.attach();
          audio.autoplay = true;
          audio.style.display = "none"; // hide

          document.body.appendChild(audio);

          console.log("🔊 AI AUDIO PLAYING");
          setCallStatus("Connected");
        }
      });

      roomRef.current = room;

      room.on("disconnected", () => {


        setShowCallingUI(false);
        setShowReviewPopup(true);
        setTimeout(() => {
          clearInterval(interval);

          if (audioContext) {
            audioContext.close();
          }


          document.querySelectorAll("audio").forEach(a => a.remove());
        }, 500);

        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, {
              type: "audio/webm",
            });

            console.log("🎧 Audio file ready:", audioBlob);

            const file = new File([audioBlob], "voice.webm", {
              type: "audio/webm",
            });

            await uploadAudio(file);
          };
        }
      });

      await room.connect(url, token);
      setCallStatus("Connected");

      await room.localParticipant.setMicrophoneEnabled(true);


      console.log(
        "🎤 Mic enabled:",
        room.localParticipant.isMicrophoneEnabled
      );

      // 🎤 Get LiveKit mic track
      await new Promise(res => setTimeout(res, 1000));

      const pub = room.localParticipant
        .getTrackPublications()
        .find(p => p.kind === "audio");

      if (pub?.track?.mediaStreamTrack) {
        const stream = new MediaStream([pub.track.mediaStreamTrack]);

        // 🎙 Recorder
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.start(1000);
        console.log("🎙 Recording started (FINAL)");

        // 🔊 MIC VOLUME CHECK
        audioContext = new AudioContext();

        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        interval = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);

          const volume = dataArray.reduce((a, b) => a + b, 0);

          console.log("🎤 LIVEKIT MIC:", volume);
        }, 500);

      } else {
        console.error("❌ No mic track found");
      }

    } catch (err) {
      console.log(err);
    }
  };


  const uploadAudio = async (file) => {
    try {
      const formData = new FormData();
      formData.append("audio", file);

      const res = await API.post("/call/upload/audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Audio uploaded:", res.data);
    } catch (err) {
      console.log("❌ Upload error:", err);
    }
  };

  const startLiveCall = async () => {
    try {

      const res = await API.post("/call/start", {
        characterId,
      });

      const { token, url } = res.data;

      console.log("TOKEN:", token);
      console.log("URL:", url);

      // 🚨 SAFETY CHECK
      if (!token || !url) {
        console.error("Missing token/url", res.data);
        return;
      }

      setShowCallingUI(true);
      setCallStatus("Connecting...");

      await connectToLivekit(token, url);

    } catch (err) {
      console.log("Start call error:", err);
    }
  };

  const handleEndCall = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }

    setCallStatus("Ringing...");
    setShowCallingUI(false);
    setShowReviewPopup(true);
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
      if (characterId) {
        setMobileListOpen(false); // open chat
      } else {
        setMobileListOpen(true); // show list
      }
    }
  }, [characterId]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      // mobile → stay on /chat
      return;
    }

    // desktop → auto open first chat
    if (!characterId) {
      loadChats().then((chats) => {
        if (chats?.length > 0) {
          navigate(`/chat/${chats[0].characterId._id}`, { replace: true });
        }
      });
    }
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
              <div className="loading-wrapper">
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

                        // 🔥 important → remove id from URL
                        navigate("/chat", { replace: true });
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

                    <FiPhone onClick={() => {
                      console.log("CLICK WORKING");
                      setShowCallConfirm(true);
                    }} />

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

      {showCallConfirm && (
        <div className="call-overlay">
          <div className="call-modal">

            <button
              className="close-btn"
              onClick={() => setShowCallConfirm(false)}
            >
              ✕
            </button>

            <h2>Confirm Your Call</h2>

            <label className="checkbox">
              <input type="checkbox" />
              Don’t show this message again
            </label>

            <button className="call-btn" onClick={handleStartCall}>
              📞 Call Me
            </button>

            <p className="call-price">3 tk/min (beta price)</p>

            <p className="call-tip">
              Tips: Speak clearly and loudly. Feedback helps us improve.
            </p>

          </div>
        </div>
      )}


      {showMicPopup && (
        <div className="call-overlay">
          <div className="call-modal">

            <h3>Please enable your microphone</h3>

            <button
              className="call-btn"
              onClick={() => {
                setShowMicPopup(false);
                handleStartCall();
              }}
            >
              Retry
            </button>

          </div>
        </div>
      )}

      {showCallingUI && character && (
        <div className="call-overlay">
          <div className="calling-ui">

            <img
              src={`https://candyai.onrender.com/uploads/${character.images[0]}`}
              alt=""
              className="call-avatar"
            />

            <h2>{character.name}</h2>
            <p className="ringing">{callStatus}</p>

            <button className="end-call" onClick={handleEndCall}>
              📞 End Call
            </button>

          </div>
        </div>
      )}


      {showReviewPopup && (
        <div className="call-overlay">
          <div className="call-modal">

            <h2>Rate the Call</h2>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i}>⭐</span>
              ))}
            </div>

            <textarea placeholder="Tell us why..." />

            <div className="review-actions">
              <button onClick={() => setShowReviewPopup(false)}>
                Cancel
              </button>

              <button className="send-btn">
                Send
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );

}

export default Chat;