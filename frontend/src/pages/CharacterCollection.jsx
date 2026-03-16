import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FaPlay, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import "./Collection.css";

function CharacterCollection({ sidebarOpen }) {

    const { id } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [previewIndex, setPreviewIndex] = useState(null);
    const [character, setCharacter] = useState(null);

    useEffect(() => {

        const load = async () => {

            const res = await API.get("/chat/collection");

            const filtered = res.data.find(
                i => i.characterId?._id === id
            );

            if (!filtered) return;

            setCharacter(filtered.characterId);

            const mediaItems = [
                ...(filtered.images || []).map(img => ({
                    type: "image",
                    media: img
                })),
                ...(filtered.videos || []).map(vid => ({
                    type: "video",
                    media: vid
                }))
            ];

            setItems(mediaItems);

        };

        load();

    }, [id]);

    const closePreview = () => {
        setPreviewIndex(null);
    };

    const next = () => {
        setPreviewIndex((prev) =>
            prev === items.length - 1 ? 0 : prev + 1
        );
    };

    const prev = () => {
        setPreviewIndex((prev) =>
            prev === 0 ? items.length - 1 : prev - 1
        );
    };

    const preview =
        previewIndex !== null ? items[previewIndex] : null;

    return (

        <div className={`main-layout ${sidebarOpen ? "expanded" : "collapsed"}`}>

            <div className="collection-page">

                {/* HEADER */}

                <div className="collection-header">

                    <div className="breadcrumb">

                        <span
                            className="breadcrumb-back"
                            onClick={() => navigate("/collection")}
                        >
                            My Collection
                        </span>

                        {character && (
                            <>
                                <span className="arrow">›</span>

                                <img
                                    src={`http://localhost:5000/uploads/${character.images?.[0]}`}
                                    className="header-avatar"
                                    alt=""
                                />

                                <span className="collection-character-title">
                                    {character.name}
                                </span>
                            </>
                        )}

                    </div>

                </div>


                {/* GRID */}

                <div className="media-grid">

                    {items.map((item, i) => (

                        <div
                            key={i}
                            className="media-card"
                            onClick={() => setPreviewIndex(i)}
                        >

                            {item.type === "image" ? (

                                <img
                                    src={`http://localhost:5000/uploads/${item.media}`}
                                    className="media-thumb"
                                    alt=""
                                />

                            ) : (

                                <video
                                    src={`http://localhost:5000/uploads/${item.media}`}
                                    className="media-thumb"
                                />

                            )}

                            {item.type === "video" && (
                                <div className="play-icon">
                                    <FaPlay />
                                </div>
                            )}

                        </div>

                    ))}

                </div>


                {/* MODAL PREVIEW */}

                {preview && (

                    <div
                        className="preview-modal"
                        onClick={closePreview}
                    >

                        <div
                            className="preview-wrapper"
                            onClick={(e) => e.stopPropagation()}
                        >

                            {/* CLOSE */}

                            <span
                                className="close-btn"
                                onClick={closePreview}
                            >
                                <FaTimes />
                            </span>

                            {/* LEFT */}

                            <button
                                className="nav-btn left"
                                onClick={prev}
                            >
                                <FaChevronLeft />
                            </button>


                            {/* MEDIA */}

                            {preview.type === "image" ? (

                                <img
                                    src={`http://localhost:5000/uploads/${preview.media}`}
                                    className="preview-media"
                                    alt=""
                                />

                            ) : (

                                <video
                                    src={`http://localhost:5000/uploads/${preview.media}`}
                                    controlsList="nodownload"
                                    disablePictureInPicture
                                    controls
                                    autoPlay
                                    className="preview-media"
                                />

                            )}


                            {/* RIGHT */}

                            <button
                                className="nav-btn right"
                                onClick={next}
                            >
                                <FaChevronRight />
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}

export default CharacterCollection;