import React, { useState } from "react";
import { FaUser, FaVenusMars, FaExclamationTriangle } from "react-icons/fa";
import API from "../../api/axios";
import "./Auth.css";

function PersonalizeModal({ close }) {

    const [nickname, setNickname] = useState("");
    const [gender, setGender] = useState("Male");
    const [step, setStep] = useState(1);

    const token = localStorage.getItem("token");

    const handleProfileSubmit = () => {
        if (!nickname || !gender) return;
        setStep(2);
    };

    const confirmAge = async (isAdult) => {
        if (!isAdult) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.reload();
            return;
        }

        await API.post(
            "/auth/complete-profile",
            { nickname, gender, isAdultConfirmed: true },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // 🔥 Update full user object
        const user = JSON.parse(localStorage.getItem("user"));

        user.nickname = nickname;
        user.gender = gender;
        user.isAdultConfirmed = true;

        localStorage.setItem("user", JSON.stringify(user));

        close();
    };


    return (
        <div className="auth-overlay">
            <div className="premium-modal">

                {step === 1 && (
                    <div className="premium-content fade-slide">

                        <h2>Personalize Your AI Experience</h2>
                        <p className="subtitle">
                            It will help to customize your interactions with AI characters.
                        </p>

                        <div className="premium-input-group">
                            <FaUser className="premium-icon" />
                            <input
                                type="text"
                                placeholder="Nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </div>

                        <div className="premium-input-group custom-select">
                            <FaVenusMars className="premium-icon" />
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <span className="select-arrow">⌄</span>
                        </div>


                        <button className="premium-btn" onClick={handleProfileSubmit}>
                            Save
                        </button>

                    </div>
                )}

                {step === 2 && (
                    <div className="premium-content fade-slide">

                        <h2 className="warning-title">
                            <FaExclamationTriangle /> Warning 18+
                        </h2>

                        <p className="warning-text">
                            This site is for adults only.
                            By entering this website, you confirm that you are 18 years old or more.
                        </p>

                        <div className="policy-buttons">
                            <button className="policy-btn">Terms of Service</button>
                            <button className="policy-btn">Privacy Notice</button>
                            <button className="policy-btn">Cookies</button>
                        </div>

                        <button
                            className="premium-btn big"
                            onClick={() => confirmAge(true)}
                        >
                            I am over 18 – Continue
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => confirmAge(false)}
                        >
                            Exit
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
}

export default PersonalizeModal;
