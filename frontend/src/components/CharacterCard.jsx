import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import "./CharacterCard.css";

import { FaHeart } from "react-icons/fa";
import { IoChatbubble, IoLocationSharp } from "react-icons/io5";
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaFire, FaStar } from "react-icons/fa";
import { MdNewReleases } from "react-icons/md";
import { GiCrown } from "react-icons/gi";

function CharacterCard({ mainCategory }) {

  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const labelConfig = {
    new: {
      text: "NEW",
      class: "label-new",
      icon: <MdNewReleases />
    },
    hot: {
      text: "HOT",
      class: "label-hot",
      icon: <FaFire />
    },
    popular: {
      text: "POPULAR",
      class: "label-popular",
      icon: <FaStar />
    },
    premium: {
      text: "PREMIUM",
      class: "label-premium",
      icon: <GiCrown />
    }
  };

  const sliderRef = useRef(null);

  const girlsCategories = [
    "All",
    "Latina",
    "Asian",
    "Caucasian",
    "Arab",
    "Blond",
    "Brunette",
    "Redhead",
    "Milf",
    "18-21"
  ];

  const guysCategories = [
    "All",
    "Athletic",
    "Muscular",
    "Bearded",
    "Tattoo",
    "Businessman",
    "Student",
    "Bad Boy"
  ];

  const animeCategories = [
    "All",
    "Waifu",
    "School Girl",
    "Cat Girl",
    "Elf",
    "Demon",
    "Princess",
    "Fantasy"
  ];

  const path = location.pathname.toLowerCase();

  let currentCategory = "girls";

  if (path.includes("guys")) currentCategory = "guys";
  if (path.includes("anime")) currentCategory = "anime";

  let categories = girlsCategories;

  if (currentCategory === "guys") {
    categories = guysCategories;
  }

  if (currentCategory === "anime") {
    categories = animeCategories;
  }

  const scrollLeft = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: -250,
      behavior: "smooth"
    });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: 250,
      behavior: "smooth"
    });
  };

  const formatNumber = (num) => {
    if (!num) return "0";

    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(".0", "") + "M";
    }

    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(".0", "") + "K";
    }

    return num;
  };

  useEffect(() => {
    setSelectedCategory("All");
  }, [mainCategory]);

  useEffect(() => {

    const fetchCharacters = async () => {

      try {

        setLoading(true);

        const params = new URLSearchParams();

        if (mainCategory) params.append("main", currentCategory);

        if (selectedCategory !== "All")
          params.append("category", selectedCategory);

        if (search.trim())
          params.append("search", search.trim());

        const res = await API.get(`/characters?${params.toString()}`);

        setCharacters(res.data || []);

      } catch (err) {

        console.error(err);
        setCharacters([]);

      } finally {

        setLoading(false);

      }

    };

    fetchCharacters();

  }, [mainCategory, selectedCategory, search, currentCategory]);

  return (

    <div className="character-section">

      <h2 className="character-title">
        AI Girlfriend <span>Characters</span>
      </h2>

      {/* SEARCH + FILTER */}

      <div className="character-filter-wrapper">

        <div className={`search-wrapper ${searchActive ? "active" : ""}`}>

          <FiSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search"
            value={search}
            onFocus={() => setSearchActive(true)}
            onChange={(e) => setSearch(e.target.value)}
          />

          {searchActive && (
            <FiX
              className="close-icon"
              onClick={() => {
                setSearch("");
                setSearchActive(false);
              }}
            />
          )}

        </div>

        <div className="category-slider">

          <button className="slider-arrow left" onClick={scrollLeft}>
            <FiChevronLeft />
          </button>

          <div className="character-categories" ref={sliderRef}>

            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}

          </div>

          <button className="slider-arrow right" onClick={scrollRight}>
            <FiChevronRight />
          </button>

        </div>

      </div>

      {/* GRID */}

      <div className="character-grid">

        {loading ?

          [...Array(8)].map((_, i) => (
            <div className="character-skeleton-card" key={i}>

              <div className="skeleton-image">
                <div className="image-placeholder-icon"></div>
              </div>

              <div className="skeleton-content">

                <div className="skeleton-line title"></div>

                <div className="skeleton-line desc"></div>
                <div className="skeleton-line desc"></div>

                <div className="skeleton-footer">
                  <div className="skeleton-line small"></div>
                  <div className="skeleton-line small"></div>
                </div>

                <div className="skeleton-line bottom"></div>

              </div>

            </div>
          ))

          :

          characters.map((character) => {

            const video = character?.video
              ? `https://candyai.onrender.com/uploads/${character.video}`
              : "";

            return (

              <div
                className="character-card fade-in"
                key={character._id}
                onClick={() => {

                  const token = localStorage.getItem("token");

                  if (!token) {
                    window.dispatchEvent(new Event("openLogin"));
                    return;
                  }

                  navigate(`/chat/${character._id}`);

                }}
              >

                {character.label && labelConfig[character.label] && (
                  <div className={`character-label ${labelConfig[character.label].class}`}>
                    {labelConfig[character.label].icon}
                    {labelConfig[character.label].text}
                  </div>
                )}

                <video
                  src={video}
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                />

                <div className="card-info">

                  <div className="card-header">

                    <h3 className="card-name">
                      {character.name}
                    </h3>

                    <span className="online-badge">
                      <span className="dot"></span>
                      Online
                    </span>

                  </div>

                  <div className="card-location">
                    <IoLocationSharp className="icon" />
                    {character.location}
                  </div>

                  <div className="card-footer">

                    <div className="card-age">
                      {character.age} years old
                    </div>

                    <div className="card-stats">

                      <span className="stat">
                        <FaHeart className="icon" />
                        {formatNumber(character.likes)}
                      </span>

                      <span className="stat">
                        <IoChatbubble className="icon" />
                        {formatNumber(character.chats)}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            )

          })}

      </div>

    </div>

  );

}

export default CharacterCard;