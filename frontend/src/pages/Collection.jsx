import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FaImage, FaVideo } from "react-icons/fa";
import "./Collection.css";

function Collection({ sidebarOpen }) {

  const [characters, setCharacters] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const load = async () => {

      const res = await API.get("/chat/collection");

      const formatted = res.data.map(item => {

        const cover =
          item.characterId?.images?.length
            ? item.characterId.images[0]
            : null;

        const firstImage =
          item.images?.length
            ? item.images[0].media || item.images[0]
            : null;

        const firstVideo =
          item.videos?.length
            ? item.videos[0].media || item.videos[0]
            : null;

        return {
          character: item.characterId,
          images: item.images || [],
          videos: item.videos || [],
          preview: cover || firstImage || firstVideo
        };

      });

      setCharacters(formatted);
      setLoading(false);

    };

    load();

  }, []);

  return (

    <div className={`main-layout ${sidebarOpen ? "expanded" : "collapsed"}`}>

      <div className="collection-page">

        <h2 className="collection-title">My Collection</h2>

        <div className="collection-character-grid">

          {loading
            ? Array.from({ length: 6 }).map((_, i) => (

              <div key={i} className="collection-character-card skeleton-card">

                <div className="character-top">

                  <div className="skeleton-avatar"></div>

                  <div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-small"></div>
                  </div>

                </div>

                <div className="skeleton-image"></div>

              </div>

            ))

            : characters.map((item, i) => {

              const preview = item.preview;

              return (
                <div
                  key={i}
                  className="collection-character-card"
                  onClick={() => navigate(`/collection/${item.character._id}`)}
                >

                  <div className="character-top">

                    <img
                      src={
                        item.character.images?.[0]
                          ? `http://localhost:5000/uploads/${item.character.images[0]}`
                          : "/placeholder.jpg"
                      }
                      className="character-avatar"
                      alt={item.character.name || "character"}
                    />

                    <div>

                      <div className="character-name">
                        {item.character.name}
                      </div>

                      <div className="character-count">

                        <span>
                          <FaVideo /> {item.videos.length}
                        </span>

                        <span>
                          <FaImage /> {item.images.length}
                        </span>

                      </div>

                    </div>

                  </div>

                  <img
                    src={
                      preview?.startsWith("http")
                        ? preview
                        : preview
                          ? `http://localhost:5000/uploads/${preview}`
                          : "/placeholder.jpg"
                    }
                    className="character-preview"
                    alt="preview"
                  />

                </div>
              );
            })}

        </div>

      </div>

    </div>

  );

}

export default Collection;