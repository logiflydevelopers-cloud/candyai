import React, { useEffect, useState, useRef, useCallback } from "react";
import API from "../api/axios";
import "./Stories.css";

const BASE_URL = "https://candyai.onrender.com/uploads/";

function Stories({ category }) {
  const [stories, setStories] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef(null);
  const videoRef = useRef(null);

  /* ================= TIME FORMAT ================= */
  const getTimeAgo = (date) => {
    if (!date) return "";

    const seconds = Math.floor(
      (Date.now() - new Date(date).getTime()) / 1000
    );

    if (seconds < 60) return "just now";

    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `about ${minutes} minute${minutes > 1 ? "s" : ""}`;
    }

    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `about ${hours} hour${hours > 1 ? "s" : ""}`;
    }

    const days = Math.floor(seconds / 86400);
    return `about ${days} day${days > 1 ? "s" : ""}`;
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!category) return;

    API.get(`/story?category=${category}`).then((res) => {
      const seen = JSON.parse(localStorage.getItem("seenStories")) || [];

      const formatted = res.data.map((s) => ({
        ...s,
        stories: s.stories || [],
        seen: seen.includes(s._id),
      }));

      const sorted = [
        ...formatted.filter((s) => !s.seen),
        ...formatted.filter((s) => s.seen),
      ];

      setStories(sorted);
    });
  }, [category]);

  /* ================= CLEAR TIMER ================= */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /* ================= CLOSE STORY ================= */
  const closeStory = useCallback(() => {
    clearTimer();
    setActiveUser(null);
    setActiveIndex(0);
    setProgress(0);
  }, [clearTimer]);

  /* ================= MARK AS SEEN ================= */
  const markAsSeen = useCallback((userId) => {
    const seen = JSON.parse(localStorage.getItem("seenStories")) || [];

    if (!seen.includes(userId)) {
      seen.push(userId);
      localStorage.setItem("seenStories", JSON.stringify(seen));
    }

    setStories((prev) => {
      const updated = prev.map((s) =>
        s._id === userId ? { ...s, seen: true } : s
      );

      return [
        ...updated.filter((s) => !s.seen),
        ...updated.filter((s) => s.seen),
      ];
    });
  }, []);

  /* ================= NEXT STORY ================= */
  const nextStory = useCallback(() => {
    if (activeUser === null) return;

    const currentUser = stories[activeUser];
    if (!currentUser) return;

    if (activeIndex < currentUser.stories.length - 1) {
      setActiveIndex((prev) => prev + 1);
      return;
    }

    markAsSeen(currentUser._id);

    if (activeUser < stories.length - 1) {
      setActiveUser((prev) => prev + 1);
      setActiveIndex(0);
      return;
    }

    closeStory();
  }, [activeUser, activeIndex, stories, markAsSeen, closeStory]);

  /* ================= PREV STORY ================= */
  const prevStory = useCallback(() => {
    if (activeUser === null) return;

    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      return;
    }

    if (activeUser > 0) {
      const prevUser = activeUser - 1;
      setActiveUser(prevUser);
      setActiveIndex(stories[prevUser]?.stories.length - 1 || 0);
    }
  }, [activeUser, activeIndex, stories]);

  /* ================= IMAGE PROGRESS ================= */
  useEffect(() => {
    if (activeUser === null) return;

    clearTimer();
    setProgress(0);

    const current = stories[activeUser]?.stories?.[activeIndex];
    if (!current) return;

    if (current.type === "image") {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + 0.5;
        });
      }, 30);
    }

    return () => clearTimer();
  }, [activeUser, activeIndex, stories, nextStory, clearTimer]);

  /* ================= VIDEO PROGRESS ================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        setProgress(percent);
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    video.onended = nextStory;

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, [activeUser, activeIndex, nextStory]);

  /* ================= OPEN STORY ================= */
  const openStory = (index) => {
    if (!stories[index]?.stories?.length) return;
    setActiveUser(index);
    setActiveIndex(0);
  };

  /* ================= CLICK NAV ================= */
  const handleClick = (e) => {
    const width = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;

    if (clickX < width / 2) prevStory();
    else nextStory();
  };

  return (
    <>
      {/* PROFILE ROW */}
      <div className="ig-row">
        {stories.map((story, index) => (
          <div
            key={story._id}
            className={`ig-item ${story.seen ? "seen" : ""}`}
            onClick={() => openStory(index)}
          >
            <div className="ig-ring">
              <img src={BASE_URL + story.profileImage} alt="" />
            </div>
            <span>{story.characterName}</span>
          </div>
        ))}
      </div>

      {/* STORY VIEWER */}
      {activeUser !== null && stories[activeUser] && (
        <div className="ig-modal">
          <div className="ig-view" onClick={handleClick}>
            
            {/* PROGRESS */}
            <div className="ig-progress">
              {stories[activeUser]?.stories?.map((_, i) => (
                <div key={i} className="ig-bar">
                  <div
                    className="ig-bar-fill"
                    style={{
                      width:
                        i === activeIndex
                          ? `${progress}%`
                          : i < activeIndex
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* HEADER */}
            <div className="ig-top">
              <img
                src={BASE_URL + stories[activeUser]?.profileImage}
                alt=""
              />
              <div className="ig-user-info">
                <span className="username">
                  {stories[activeUser]?.characterName}
                </span>
                <span className="time">
                  {getTimeAgo(
                    stories[activeUser]?.stories?.[activeIndex]?.createdAt
                  )}
                </span>
              </div>
            </div>

            {/* MEDIA */}
            {stories[activeUser]?.stories?.[activeIndex]?.type === "image" ? (
              <img
                className="ig-media"
                src={
                  BASE_URL +
                  stories[activeUser].stories[activeIndex].mediaUrl
                }
                alt=""
              />
            ) : (
              <video
                ref={videoRef}
                className="ig-media"
                src={
                  BASE_URL +
                  stories[activeUser].stories[activeIndex].mediaUrl
                }
                autoPlay
                playsInline
              />
            )}

            <button
              className="ig-close"
              onClick={(e) => {
                e.stopPropagation();
                closeStory();
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Stories;
