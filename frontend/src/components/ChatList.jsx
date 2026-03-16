import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

import API from "../api/axios";

function formatTime(time) {

    const date = new Date(time)

    let hours = date.getHours()
    let minutes = date.getMinutes()

    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12

    minutes = minutes < 10 ? "0" + minutes : minutes

    return `${hours}:${minutes}${ampm}`

}

function ChatList({ conversations, navigate, active, refresh, mobileOpen, closeMobile, loading }) {

    const [search, setSearch] = useState("");
    const [resetModal, setResetModal] = useState(false)
    const [resetId, setResetId] = useState(null)
    const [resetName, setResetName] = useState("")

    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [deleteName, setDeleteName] = useState("")

    const confirmReset = async () => {

        try {

            await API.post(`/chat/reset/${resetId}`)

            setResetModal(false)

            refresh()

            navigate(`/chat/${resetId}`, { replace: true })

            window.location.reload()

        } catch (err) {
            console.log(err)
        }

    }

    const filtered = conversations
        .filter(chat => chat.characterId)
        .filter(chat =>
            chat.characterId.name
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );

    // ✅ RESET CHAT
    const resetChat = async (e, characterId) => {
        e.stopPropagation();

        try {

            await API.post(`/chat/reset/${characterId}`);

            refresh();

            // force chat reload
            navigate(`/chat/${characterId}`, { replace: true });

            if (closeMobile) closeMobile();

        } catch (err) {
            console.log(err);
        }
    };

    const confirmDelete = async () => {

        try {

            await API.delete(`/chat/delete/${deleteId}`);

            setDeleteModal(false);

            await refresh();

            const remaining = conversations.filter(
                chat => chat.characterId._id !== deleteId
            );

            if (remaining.length > 0) {

                navigate(`/chat/${remaining[0].characterId._id}`, { replace: true });

            } else {

                navigate("/chat", { replace: true });

            }

        } catch (err) {

            console.log(err);

        }

    };


    return (
        <>
            <div className={`chat-sidebar ${mobileOpen ? "mobile-open" : ""}`}>

                {/* HEADER */}
                <div className="chat-top">

                    <h2>Chat</h2>

                    <button
                        className="mobile-close"
                        onClick={() => {
                            if (closeMobile) closeMobile();
                            navigate("/");
                        }}
                    >
                        <IoClose size={24} />
                    </button>

                </div>


                {/* SEARCH */}
                <div className="chat-search">

                    <FiSearch className="search-icon" />

                    <input
                        placeholder="Search for a profile..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>


                {loading && (
                    <div className="chat-skeleton-wrapper">

                        {[1, 2, 3, 4, 5].map((i) => (
                            <div className="chat-skeleton" key={i}>

                                <div className="sk-avatar">
                                    <FaUserCircle />
                                </div>

                                <div className="sk-lines">

                                    <div className="sk-line short"></div>

                                    <div className="sk-line"></div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}


                {/* LIST */}

                <div className="chat-list">

                    {!loading && filtered.map(chat => {

                        const char = chat.characterId || {};

                        return (

                            <div
                                key={chat._id}
                                className={`chat-item ${active === char._id ? "active" : ""}`}
                                onClick={() => {
                                    navigate(`/chat/${char._id}`);
                                    if (closeMobile) closeMobile();
                                }}
                            >

                                <img
                                    src={`http://localhost:5000/uploads/${char?.images?.[0] || ""}`}
                                    alt=""
                                />

                                <div className="chat-info">

                                    <div className="chat-name">
                                        {char.name}
                                    </div>

                                    <div className="chat-last">
                                        {chat.lastMessage || char.welcomeMessage}
                                    </div>

                                </div>

                                <div className="chat-right">

                                    <div className="chat-time">
                                        {chat.lastTime ? formatTime(chat.lastTime) : ""}
                                    </div>

                                    <div className="chat-actions">

                                        <HiOutlineRefresh
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setResetId(char._id)
                                                setResetName(char.name)
                                                setResetModal(true)
                                            }}
                                        />

                                        <FiTrash2
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setDeleteId(char._id)
                                                setDeleteName(char.name)
                                                setDeleteModal(true)
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>

            {resetModal && (

                <div className="reset-overlay">

                    <div className="reset-modal">

                        <button
                            className="reset-close"
                            onClick={() => setResetModal(false)}
                        >
                            <IoClose />
                        </button>

                        <h2>Reset chat?</h2>

                        <p>
                            This will start a new conversation with <b>{resetName}</b>.
                            Your current chat history will be cleared.
                        </p>

                        <div className="reset-actions">

                            <button
                                className="reset-cancel"
                                onClick={() => setResetModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="reset-confirm"
                                onClick={confirmReset}
                            >
                                Yes, Confirm
                            </button>

                        </div>

                    </div>

                    <div className="reset-info">

                        <span className="info-icon">i</span>

                        All generated media will stay in your gallery.

                    </div>

                </div>

            )}

            {deleteModal && (

                <div className="reset-overlay">

                    <div className="reset-modal">

                        <button
                            className="reset-close"
                            onClick={() => setDeleteModal(false)}
                        >
                            <IoClose />
                        </button>

                        <h2>Delete chat?</h2>

                        <p>
                            Are you sure you want to delete the conversation with <b>{deleteName}</b>?
                            All messages will be lost.
                        </p>

                        <div className="reset-actions">

                            <button
                                className="reset-cancel"
                                onClick={() => setDeleteModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="reset-confirm"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}
        </>
    );

}

export default ChatList;