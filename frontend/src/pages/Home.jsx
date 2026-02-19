import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Banner from "../components/Banner";
import Stories from "../components/Stories";
import Footer from "../components/Footer";
import CharacterCard from "../components/CharacterCard";
import MobileBottomNav from "../layout/MobileBottomNav";

import "./Home.css";

function Home({ category, sidebarOpen, children }) {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    if (!category) return;

    API.get(`/character/${category}`)
      .then((res) => {
        setCharacters(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching characters:", err);
        setCharacters([]);
      });
  }, [category]);

  return (
    <div className={`main-layout ${sidebarOpen ? "expanded" : "collapsed"}`}>

      <div className="banner-section">
        <Banner category={category} />
      </div>

      <div className="container">

        <Stories category={category} />

        {children && (
          <div className="custom-page-content">
            {children}
          </div>
        )}

        {characters.length > 0 && (
          <div className="grid">
            {characters.map((character) => (
              <CharacterCard
                key={character._id}
                image={character.image}
                data={character}
              />
            ))}
          </div>
        )}

      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default Home;
