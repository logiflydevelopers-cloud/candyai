import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FaPause } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import "./Discover.css";

function Discover() {

    const navigate = useNavigate();

    const [characters, setCharacters] = useState([]);
    const [likedCharacters, setLikedCharacters] = useState({});
    const [pausedIndex, setPausedIndex] = useState(null);
    const [loadingIndex, setLoadingIndex] = useState(null);

    const videoRefs = useRef([]);
    const containerRef = useRef();

    const token = localStorage.getItem("token");

    /* FETCH CHARACTERS */

    useEffect(() => {

        API.get("/characters").then((res) => {

            const discoverCharacters = res.data.filter(
                (c) => c.discover === true
            );

            setCharacters(discoverCharacters);

        });

    }, []);

    /* AUTO PLAY VIDEO ON SCROLL */

    useEffect(() => {

        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    const video = entry.target;

                    if (entry.isIntersecting) {
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }

                });

            },

            { threshold: 0.8 }

        );

        videoRefs.current.forEach((v) => v && observer.observe(v));

        return () => observer.disconnect();

    }, [characters]);

    /* GUEST LIMIT */

    const handleScroll = () => {

        if (token) return;

        const container = containerRef.current;

        const index = Math.round(
            container.scrollTop / window.innerHeight
        );

        if (index >= 5) {

            window.dispatchEvent(new Event("openLogin"));

        }

    };

    /* VIDEO PLAY / PAUSE */

    const toggleVideo = (index) => {

        const video = videoRefs.current[index];

        if (!video) return;

        if (video.paused) {

            video.play();
            setPausedIndex(null);

        } else {

            video.pause();
            setPausedIndex(index);

        }

    };

    /* LIKE */

    const handleLike = async (id, index) => {

        if (!token) {
            window.dispatchEvent(new Event("openLogin"));
            return;
        }

        try {

            const res = await API.put(`/characters/like/${id}`);

            setCharacters((prev) => {

                const updated = [...prev];
                updated[index].likes = res.data.likes;

                return updated;

            });

            setLikedCharacters((prev) => ({
                ...prev,
                [id]: true
            }));

        } catch (err) {

            console.log("LIKE ERROR:", err);

        }

    };

    return (

        <div
            className="discover-page"
            ref={containerRef}
            onScroll={handleScroll}
        >

            {characters.map((char, index) => (

                <div key={char._id} className="reel-row">

                    <div className="reel-card">

                        {/* BACK BUTTON */}
                        <div
                            className="discover-mobile-back"
                            onClick={() => navigate("/")}
                        >
                            ❮
                        </div>

                        {/* VIDEO */}
                        <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            src={`http://localhost:5000/uploads/${char.video}`}
                            className="reel-video"
                            loop
                            muted
                            playsInline
                            onClick={() => toggleVideo(index)}
                            onWaiting={() => setLoadingIndex(index)}
                            onPlaying={() => setLoadingIndex(null)}
                        />

                        {/* LOADING */}
                        {loadingIndex === index && (
                            <div className="video-loader">
                                <div className="spinner"></div>
                            </div>
                        )}

                        {/* PAUSE ICON */}
                        {pausedIndex === index && (
                            <div className="pause-overlay">
                                <FaPause />
                            </div>
                        )}

                        {/* LIKE SECTION (MOVE INSIDE CARD) */}
                        <div className="reel-actions">

                            <AiFillHeart
                                className={`like-icon ${likedCharacters[char._id] ? "liked" : ""}`}
                                onClick={() => handleLike(char._id, index)}
                            />

                            <span className="like-count">
                                {char.likes}
                            </span>

                        </div>

                        {/* INFO */}
                        <div className="reel-info">

                            <img
                                src={`http://localhost:5000/uploads/${char.images?.[0]}`}
                                className="reel-avatar"
                                alt=""
                            />

                            <div className="reel-name">
                                {char.name}
                            </div>

                            <button
                                className="chat-btn"
                                onClick={() => {

                                    const token = localStorage.getItem("token");

                                    if (!token) {
                                        window.dispatchEvent(new Event("openLogin"));
                                        return;
                                    }

                                    navigate(`/chat/${char._id}`);

                                }}
                            >
                                Chat Now
                            </button>

                        </div>

                    </div>

                </div>

            ))}

        </div>

    );

}

export default Discover;