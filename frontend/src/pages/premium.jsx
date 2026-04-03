import React, { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./premium.css";

function Premium({ sidebarOpen }) {

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        const loadPlans = async () => {
            try {
                const res = await API.get("/plans");
                setPlans(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        const init = async () => {
            const token = localStorage.getItem("token");

            // 🔥 LOAD PLANS IMMEDIATELY (fast UI)
            loadPlans();

            if (!token) return;

            try {
                const planRes = await API.get("/plans/my-plan");

                if (planRes.data.active && !planRes.data.plan.isFreePlan) {
                    navigate("/tokens");
                }

            } catch (err) {
                console.log("ignore my-plan error");
            }
        };

        init();

    }, [navigate]);

    const handleBuy = async () => {
        if (!selectedPlan) {
            toast.error("Select a plan");
            return;
        }

        try {
            const res = await API.post("/plans/buy", {
                planId: selectedPlan._id
            });

            if (res.data.success) {
                toast.success("Plan Activated 🎉");

                // ✅ ONLY HERE (IMPORTANT)
                window.dispatchEvent(new Event("planUpdated"));

                navigate("/tokens", {
                    state: {
                        plan: res.data.data
                    }
                });
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    if (loading) {
        return <div style={{ color: "white" }}>Loading plans...</div>;
    }
    return (
        <div className="premium-main">

            <div className={`premium-grid ${sidebarOpen ? "expanded" : "collapsed"}`}>

                {/* LEFT */}
                <div className="premium-left">
                    <h2 className="sale-title">
                        <span>Spring Sale</span> for <br /> New Users
                    </h2>
                    <p className="sale-sub">
                        Discount ends soon. <span>Don't miss out!</span>
                    </p>

                    <img
                        src="/girl.png"
                        alt=""
                        className="premium-img-left"
                    />
                </div>

                {/* CENTER */}
                <div className="premium-center">

                    {plans.map((plan, i) => {

                        const active = selectedPlan?._id === plan._id;

                        return (
                            <div
                                key={plan._id}
                                className={`plan-card ${active ? "active" : ""}`}
                                onClick={() => setSelectedPlan(plan)}
                            >

                                {plan.label && (
                                    <div className="badge">
                                        {plan.label}
                                    </div>
                                )}

                                <div className="plan-row">

                                    <div>
                                        <h3>{plan.title}</h3>
                                        {plan.discountPercent > 0 && (
                                            <p className="off">
                                                {plan.discountPercent}% OFF
                                            </p>
                                        )}
                                    </div>

                                    <div className="price-box">
                                        {plan.originalPrice > plan.price && (
                                            <span className="old">
                                                ₹{plan.originalPrice}
                                            </span>
                                        )}
                                        <h2>₹{plan.price}</h2>
                                        <span>/month</span>
                                    </div>

                                </div>

                            </div>
                        );
                    })}


                    <button className="upi-btn" onClick={handleBuy}>
                        Pay with UPI
                    </button>

                    <div className="note-box">
                        Annual payment billed as ₹3,600. Cancel anytime.
                    </div>

                </div>

                {/* RIGHT */}
                <div className="premium-right">

                    <h3>Premium Benefits</h3>

                    <ul>
                        <li>✔ Create your own AI Girlfriend(s)</li>
                        <li>✔ Unlimited text messages</li>
                        <li>✔ Get 100 FREE tokens / month</li>
                        <li>✔ Remove image blur</li>
                        <li>✔ Generate images</li>
                        <li>✔ Fast response time</li>
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

export default Premium;