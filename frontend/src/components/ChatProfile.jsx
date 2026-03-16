import { useState, useRef } from "react";
import { IoChevronBack } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import age from "../image/age.svg";
import body from "../image/body.svg";
import ethnicity from "../image/ethnicity.svg";
import language from "../image/language-01.svg";
import relationship from "../image/roleplay.svg";
import Occupation from "../image/occupation.svg";
import hobby from "../image/hobbies.svg";
import personality from "../image/personality.svg";


function ChatProfile({ character, onBack }) {

  const [activeSlide, setActiveSlide] = useState(0);
  const videoRef = useRef(null);

  if (!character) return null;

  const media = [
    { type: "image", src: character.images?.[0] },
    { type: "video", src: character.video },
    { type: "image", src: character.images?.[1] }
  ].filter(m => m.src);

  return (
    <div className="profile-wrapper">

      <div className="profile-media">

        {/* MOBILE BACK */}
        <div className="mobile-profile-header">
          <button className="mobile-back-btn" onClick={onBack}>
            <IoChevronBack /> Back
          </button>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          loop={true}
          pagination={{ clickable: true }}

          onSlideChange={(swiper) => {

            const slide = media[swiper.activeIndex];

            if (slide?.type === "video") {
              videoRef.current?.play();
            } else {
              videoRef.current?.pause();
            }

            setActiveSlide(swiper.activeIndex);
          }}

        >

          {media.map((item, index) => (

            <SwiperSlide key={index}>

              {item.type === "image" && (
                <img
                  src={`https://candyai.onrender.com/uploads/${item.src}`}
                  className="profile-media-img"
                  alt=""
                />
              )}

              {item.type === "video" && (
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  autoPlay
                  loop
                  preload="metadata"
                  className="profile-media-img"
                  src={`https://candyai.onrender.com/uploads/${item.src}`}
                />
              )}

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

      {/* INFO */}

      <div className="profile-content">

        <h2 className="profile-name">{character.name}</h2>

        <p className="profile-description">
          {character.description}
        </p>

        {/* <button className="call-btn">
          📞 Call Me
        </button>

        <button className="generate-btn">
          Generate Image
        </button> */}

      </div>

      <div className="profile-details-border"></div>

      {/* ABOUT */}

      <div className="profile-about">

        <h3>About me</h3>

        <div className="about-grid">

          <div className="about-item">
            <img src={age} />
            <div>
              <span>AGE</span>
              <p>{character.age}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={body} />
            <div>
              <span>BODY</span>
              <p>{character.body}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={ethnicity} />
            <div>
              <span>ETHNICITY</span>
              <p>{character.ethnicity}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={language} />
            <div>
              <span>LANGUAGE</span>
              <p>{character.language}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={relationship} />
            <div>
              <span>RELATIONSHIP</span>
              <p>{character.relationship}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={Occupation} />
            <div>
              <span>OCCUPATION</span>
              <p>{character.occupation}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={hobby} />
            <div>
              <span>HOBBIES</span>
              <p>{character.hobbies}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={personality} />
            <div>
              <span>PERSONALITY</span>
              <p>{character.personality}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ChatProfile;