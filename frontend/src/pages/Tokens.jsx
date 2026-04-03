import React, { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import "./tokens.css";

function Tokens({ sidebarOpen }) {

    const [tokens, setTokens] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTokens();
    }, []);

    const fetchTokens = async () => {
        try {
            const res = await API.get("/tokens");
            setTokens(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleBuy = async () => {
        if (!selected) {
            toast.error("Select token pack");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("/tokens/buy", {
                tokenId: selected._id
            });

            if (res.data.success) {
                toast.success("Tokens added 🎉");

                // 🔥 refresh event (optional)
                window.dispatchEvent(new Event("planUpdated"));
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="premium-main">

            <div className={`premium-grid ${sidebarOpen ? "expanded" : "collapsed"}`}>

                {/* LEFT */}
                <div className="premium-left">
                    <h2 className="sale-title">
                        <span>Buy Tokens</span> <br /> & Save More
                    </h2>

                    <p className="sale-sub">
                        Bigger packs = <span>More bonus 🔥</span>
                    </p>

                    <img
                        src="/girl.png"
                        alt=""
                        className="premium-img-left"
                    />
                </div>

                {/* CENTER */}
                <div className="premium-center">

                    {tokens.map((t) => {

                        const active = selected?._id === t._id;

                        return (
                            <div
                                key={t._id}
                                className={`plan-card ${active ? "active" : ""}`}
                                onClick={() => setSelected(t)}
                            >

                                {t.label && (
                                    <div className="badge">
                                        {t.label}
                                    </div>
                                )}

                                <div className="plan-row">

                                    <div>
                                        <h3>🪙 {t.tokens}</h3>
                                        <p className="off">
                                            {t.discountPercent}% BONUS
                                        </p>
                                    </div>

                                    <div className="price-box">
                                        <span className="old">
                                            ₹{t.originalPrice}
                                        </span>
                                        <h2>₹{t.price}</h2>
                                    </div>

                                </div>

                            </div>
                        );
                    })}

                    <button
                        className="upi-btn"
                        onClick={handleBuy}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Pay with UPI"}
                    </button>

                    <div className="note-box">
                        Tokens are added instantly after payment.
                    </div>

                </div>

                {/* RIGHT */}
                <div className="premium-right">

                    <h3>Token Benefits</h3>

                    <ul>
                        <li>✔ Create AI Girlfriend(s)</li>
                        <li>✔ AI Image generation</li>
                        <li>✔ Voice messages</li>
                        <li>✔ Faster generations</li>
                    </ul>

                    <img
                        src="/girl2.png"
                        alt=""
                        className="premium-img-right"
                    />

                </div>

            </div>

        </div>
    );
}

export default Tokens;