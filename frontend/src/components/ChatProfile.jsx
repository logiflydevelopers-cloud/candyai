import { useRef } from "react";
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
              const playPromise = videoRef.current?.play();

              if (playPromise !== undefined) {
                playPromise.catch(() => { });
              }
            } else {
              if (!videoRef.current?.paused) {
                videoRef.current?.pause();
              }
            }

          }}

        >

          {media.map((item, index) => (

            <SwiperSlide key={index}>

              {item.type === "image" && (
                <img
                  src={`http://localhost:5000/uploads/${item.src}`}
                  className="profile-media-img"
                  alt={`${character.name} media`}
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
                  src={`http://localhost:5000/uploads/${item.src}`}
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
            <img src={age} alt="age icon" />
            <div>
              <span>AGE</span>
              <p>{character.age}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={body} alt="body icon" />
            <div>
              <span>BODY</span>
              <p>{character.body}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={ethnicity} alt="ethnicity icon" />
            <div>
              <span>ETHNICITY</span>
              <p>{character.ethnicity}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={language} alt="language icon" />
            <div>
              <span>LANGUAGE</span>
              <p>{character.language}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={relationship} alt="relationship icon" />
            <div>
              <span>RELATIONSHIP</span>
              <p>{character.relationship}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={Occupation} alt="occupation icon" />
            <div>
              <span>OCCUPATION</span>
              <p>{character.occupation}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={hobby} alt="hobby icon" />
            <div>
              <span>HOBBIES</span>
              <p>{character.hobbies}</p>
            </div>
          </div>

          <div className="about-item">
            <img src={personality} alt="personality icon" />
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