import React from "react";
import "./Collection.css";

function Collection() {

  const items = [
    { id: 1, title: "Character 1" },
    { id: 2, title: "Character 2" },
    { id: 3, title: "Character 3" }
  ];

  return (
    <div className="collection-container">

      <h2>🖼 My Collection</h2>

      <div className="collection-grid">
        {items.map(item => (
          <div key={item.id} className="collection-card">
            <div className="collection-image">
              🎭
            </div>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Collection;
