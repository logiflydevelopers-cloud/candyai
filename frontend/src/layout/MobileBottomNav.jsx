import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MobileBottomNav.css";

import HomeIcon from "../image/Home.svg";
import DiscoverIcon from "../image/Discover.svg";
import CreateIcon from "../image/Create Character.svg";
import ChatIcon from "../image/Chat.svg";
import PremiumIcon from "../image/Premium.svg";

function MobileBottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: "Home", icon: HomeIcon, path: "/" },
        { name: "Discover", icon: DiscoverIcon, path: "/discover" },
        { name: "Create", icon: CreateIcon, path: "/create-character" },
        { name: "Chat", icon: ChatIcon, path: "/chat" },
        { name: "Premium", icon: PremiumIcon, path: "/premium", premium: true },
    ];

    return (
        <div className="mobile-bottom-nav">
            {navItems.map((item, index) => {
                let isActive = false;

                if (item.path === "/") {
                    const homePaths = ["/", "/girls", "/anime", "/guys"];
                    isActive = homePaths.includes(location.pathname);
                } else {
                    isActive = location.pathname.startsWith(item.path);
                }


                return (
                    <div
                        key={index}
                        className={`mobile-nav-item 
              ${isActive ? "active" : ""} 
              ${item.premium ? "premium" : ""}`}
                        onClick={() => navigate(item.path)}
                    >
                        <div className="icon-wrap">
                            <img src={item.icon} alt={item.name} />
                        </div>
                        <span>{item.name}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default MobileBottomNav;
