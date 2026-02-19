import "./CharacterCard.css";

function CharacterCard({ image }) {
  return (
    <div className="character-card">
      <img src={image} alt="character" />
    </div>
  );
}

export default CharacterCard;
