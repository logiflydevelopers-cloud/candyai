import React, { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import "./Banner.css";

function Banner({ category }) {
  const [data, setData] = useState([]);
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(1);
  const [transition, setTransition] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const intervalRef = useRef(null);

  /* Detect screen resize */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!category) return;

    clearInterval(intervalRef.current);

    API.get(`/banner/${category}`).then((res) => {
      if (res.data && res.data.length > 0) {
        const banners = res.data;
        setData(banners);

        setSlides([
          banners[banners.length - 1],
          ...banners,
          banners[0],
        ]);

        setCurrent(1);
      }
    });
  }, [category]);

  /* ================= AUTO PLAY ================= */
  useEffect(() => {
    if (slides.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [slides]);

  /* ================= HANDLE LOOP ================= */
  useEffect(() => {
    if (current === slides.length - 1) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(1);
      }, 600);
    }

    if (current === 0) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(slides.length - 2);
      }, 600);
    }
  }, [current, slides]);

  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => {
        setTransition(true);
      });
    }
  }, [transition]);

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  if (slides.length === 0) return null;

  return (
    <div className="banner-slider">
      <div
        className="banner-track"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: transition ? "transform 0.6s ease" : "none",
        }}
      >
        {slides.map((item, index) => {
          const imagePath = isMobile
            ? item.mobileImage
            : item.desktopImage;

          return (
            <div className="banner-slide" key={index}>
              <img
                src={`https://candyai.onrender.com/${imagePath?.replace(
                  "uploads\\",
                  "uploads/"
                )}`}
                alt="banner"
                draggable="false"
              />
            </div>
          );
        })}
      </div>

      <button className="nav prev" onClick={prev}>❮</button>
      <button className="nav next" onClick={next}>❯</button>

      <div className="dots">
        {data.map((_, i) => (
          <span
            key={i}
            className={i + 1 === current ? "dot active" : "dot"}
            onClick={() => setCurrent(i + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;
