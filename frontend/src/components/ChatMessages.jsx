import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

// import { FiImage } from "react-icons/fi";
// import { HiOutlineVideoCamera } from "react-icons/hi";
// import { IoSparklesOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { FaLock } from "react-icons/fa";

function ChatMessages({ character, messages, setMessages }) {

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [suggestion, setSuggestion] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mediaType, setMediaType] = useState(null);

    const bottomRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    const formatTime = (time) => {

        const date = new Date(time);

        let hours = date.getHours();
        let minutes = date.getMinutes();

        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours ? hours : 12;

        minutes = minutes < 10 ? "0" + minutes : minutes;

        return `${hours}:${minutes} ${ampm}`;
    };

    const startLoading = (type, callback) => {

        setMediaType(type);
        setGenerating(true);
        setProgress(0);

        let count = 0;

        const interval = setInterval(() => {

            count += Math.floor(Math.random() * 12) + 5; // 🔥 random smooth jump

            if (count >= 100) count = 100;

            setProgress(count);

            if (count === 100) {

                clearInterval(interval);

                setTimeout(() => {
                    setGenerating(false);
                    callback();
                }, 400);

            }

        }, 500);

    };

    const sendImage = async () => {

        const userMessage = {
            sender: "user",
            type: "text",
            text: "📸 Send me an image",
            createdAt: new Date()
        }

        setMessages(prev => [...prev, userMessage])

        startLoading("image", async () => {

            const res = await API.post("/chat/image-message", {
                characterId: character._id
            })

            setMessages(prev => [
                ...prev,
                res.data.botMessage
            ])

            setSuggestion("video")

        })

    }

    const sendVideo = async () => {

        const userMessage = {
            sender: "user",
            type: "text",
            text: "🎥 Send me a video",
            createdAt: new Date()
        }

        setMessages(prev => [...prev, userMessage])

        startLoading("video", async () => {

            const res = await API.post("/chat/video-message", {
                characterId: character._id
            })

            setMessages(prev => [
                ...prev,
                res.data.botMessage
            ])

            setSuggestion("naughty")

        })

    }

    const sendNaughtyVideo = async () => {

        localStorage.setItem(`naughty_${character._id}`, "true");
        setSuggestion(null);

        const userMessage = {
            sender: "user",
            type: "text",
            text: "🔥 Send me a naughty video",
            createdAt: new Date()
        }

        setMessages(prev => [...prev, userMessage])


        startLoading("video", async () => {

            const res = await API.post("/chat/naughty-video-message", {
                characterId: character._id
            })

            setMessages(prev => [
                ...prev,
                res.data.botMessage
            ])

        })

    }

    const textareaRef = useRef(null);

    const handleInput = (e) => {

        setText(e.target.value);

        const el = textareaRef.current;

        el.style.height = "auto";

        const maxHeight = 72; // 3 lines

        if (el.scrollHeight > maxHeight) {

            el.style.height = maxHeight + "px";
            el.style.overflowY = "auto";

        } else {

            el.style.height = el.scrollHeight + "px";
            el.style.overflowY = "hidden";

        }

    };

    const sendMessage = async () => {

        if (!text.trim() || loading) return;

        const userMessage = {
            sender: "user",
            type: "text",
            text,
            createdAt: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        const question = text;

        setText("");
        setLoading(true);
        setTyping(true);

        try {

            const res = await API.post("/chat/message", {
                characterId: character._id,
                question
            });

            const naughtyDone = localStorage.getItem(`naughty_${character._id}`);

            if (!naughtyDone) {
                setSuggestion(res.data.suggestion);
            }

            setTyping(false);

            const botMessage = {
                sender: "bot",
                text: res.data.reply,
                createdAt: new Date()
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (err) {

            setTyping(false);

            setMessages(prev => [
                ...prev,
                {
                    sender: "bot",
                    text: "⚠️ AI server not responding",
                    createdAt: new Date()
                }
            ]);

        }

        setLoading(false);
    };

    useEffect(() => {

        const loadSuggestion = async () => {

            // check naughty already sent
            const naughtyDone = localStorage.getItem(`naughty_${character._id}`);

            if (naughtyDone) {
                setSuggestion(null);
                return;
            }

            const res = await API.get(`/chat/open/${character._id}`);

            setTimeout(() => {
                setSuggestion(res.data.suggestion);
            }, 5000);

        };

        loadSuggestion();

    }, [character]);

    return (

        <div className="chat-box">

            {/* messages */}

            <div className="chat-messages">

                {messages.map((msg, i) => (

                    <div key={i} className={`message-wrapper ${msg.sender}`}>

                        {/* TEXT MESSAGE */}
                        {(!msg.type || msg.type === "text") && (
                            <div className={`message-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        )}

                        {/* IMAGE MESSAGE */}
                        {msg.type === "image" && (
                            <div className="image-message">

                                <img
                                    src={`http://localhost:5000/uploads/${msg.media}`}
                                    className="chat-image"
                                    alt="chat media"
                                />

                                <div className={`message-bubble ${msg.sender}`}>
                                    <div className="image-text">
                                        {msg.text}
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* VIDEO MESSAGE */}
                        {msg.type === "video" && (
                            <div className="video-message">

                                <video
                                    controls
                                    controlsList="nodownload"
                                    disablePictureInPicture
                                    onContextMenu={(e) => e.preventDefault()}
                                    className="chat-video"
                                >
                                    <source src={`http://localhost:5000/uploads/${msg.media}`} />
                                </video>

                                <div className={`message-bubble ${msg.sender}`}>
                                    <div className="video-text">
                                        {msg.text}
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* LOCKED VIDEO MESSAGE */}

                        {msg.type === "locked" && (

                            <div className="video-message">

                                <div className="locked-wrapper">

                                    <video
                                        className="locked-video-preview"
                                        src={`http://localhost:5000/uploads/${msg.media}`}
                                        aria-label="locked video preview"
                                    />

                                    <div className="locked-overlay">

                                        <FaLock className="locked-icon" />

                                        <button
                                            className="unlock-btn"
                                            onClick={() => navigate("/plans")}
                                        >
                                            Unlock video
                                        </button>

                                    </div>

                                </div>

                                <div className={`message-bubble ${msg.sender}`}>
                                    <div className="video-text">
                                        {msg.text}
                                    </div>
                                </div>

                            </div>

                        )}

                        <div className="message-time">
                            {formatTime(msg.createdAt || msg.time)}
                        </div>

                    </div>

                ))}

                {typing && (

                    <div className="message-wrapper bot">

                        <div className="message-bubble bot typing">

                            <span></span>
                            <span></span>
                            <span></span>

                        </div>

                    </div>

                )}

                {generating && (

                    <div className="message-wrapper bot">

                        <div className="message-bubble bot media-loading advanced">

                            {/* 🔵 LEFT CIRCLE */}
                            <div
                                className="progress-circle"
                                style={{ "--p": progress }}
                            >
                                <span>{progress}%</span>
                            </div>

                            {/* 🧠 RIGHT SIDE */}
                            <div className="media-content">

                                <div className="media-title">
                                    {character.name} is sending a {mediaType}
                                </div>

                                {/* 📊 BAR */}
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>

                                <div className="media-sub">
                                    This might take a few minutes
                                </div>

                            </div>

                        </div>

                    </div>

                )}

                <div ref={bottomRef}></div>

            </div>


            {suggestion === "image" && (

                <div className="suggestion-wrapper">

                    <button
                        className="suggest-btn"
                        onClick={sendImage}
                    >
                        📸 Send me an image
                    </button>

                </div>

            )}

            {suggestion === "video" && (

                <div className="suggestion-wrapper">

                    <button
                        className="suggest-btn"
                        onClick={sendVideo}
                    >
                        🎥 Send me a video
                    </button>

                </div>

            )}

            {suggestion === "naughty" && (

                <div className="suggestion-wrapper">

                    <button
                        className="suggest-btn naughty"
                        onClick={sendNaughtyVideo}
                    >
                        🔥 Send me a naughty video
                    </button>

                </div>

            )}

            {/* INPUT */}

            <div className="chat-input-wrapper">

                <div className="chat-input-bar">

                    {/* LEFT ICONS */}

                    <div className="input-actions">

                        {/* <button className="icon-btn">
                            <FiImage />
                        </button>

                        <button className="icon-btn">
                            <HiOutlineVideoCamera />
                        </button>

                        <button className="icon-btn">
                            <IoSparklesOutline />
                        </button> */}

                    </div>

                    {/* TEXT INPUT */}

                    <textarea
                        ref={textareaRef}
                        value={text}
                        placeholder="Write a message..."
                        className="chat-textarea"
                        rows={1}
                        onChange={handleInput}
                        onKeyDown={(e) => {

                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }

                        }}
                    />

                    {/* SEND BUTTON */}

                    <button className="send-btn" onClick={sendMessage}>
                        <IoSend />
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ChatMessages;