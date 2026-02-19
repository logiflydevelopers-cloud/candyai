import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import "./allcategory.css";
import DesktopBanner from "../image/Desk-Banner.png";
import MobileBanner from "../image/mob-banner.png";

function Girls({ sidebarOpen }) {
  const [active, setActive] = useState(null);

  const faqData = [
    {
      question: "What is an AI Girlfriend and how does it work?",
      answer:
        "An AI Girlfriend is a digital character powered by deep learning and emotional intelligence, designed to chat, flirt, and connect with you in meaningful ways. At Candy AI, your AI GF adapts to your style, preferences, and mood, creating a personal experience that feels natural and emotionally real."
    },
    {
      question: "Can I choose from different AI Girlfriend personalities?",
      answer:
        "Yes, Candy AI offers a wide selection of prebuilt AI GF characters, each with unique personalities, communication styles, and vibes. Whether you prefer someone sweet, flirty, soft-spoken, or bold, you'll find an AI Girlfriend that matches your energy."
    },
    {
      question: "How does my AI GF get to know me?",
      answer:
        "Your AI Girlfriend learns through conversation. The more you chat, the more she picks up on your preferences, tone, and interests. Over time, she adjusts her responses and behavior to better match your communication style, making each chat more personal."
    },
    {
      question: "Is chatting with an AI Girlfriend private and secure?",
      answer:
        "Absolutely. Candy AI uses end-to-end encryption to keep all AI GF conversations safe and confidential. You have full control over your chat history and can enable two-factor authentication for extra security. Your data is never shared or sold."
    },
    {
      question: "Do I need to install anything to talk to my AI GF?",
      answer:
        "No installation is needed. You can access your AI Girlfriend directly through Candy AI on desktop or mobile, anytime, anywhere. Just sign up, choose your AI GF, and start chatting instantly."
    }
  ];

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  const navigate = useNavigate();

  return (
    <Home category="Girls" sidebarOpen={sidebarOpen}>

      {/* 🔥 RESPONSIVE TOP BANNER */}
      <section
        className="category-hero-banner clickable"
        onClick={() => navigate("/premium")}
      >
        <picture>
          <source srcSet={MobileBanner} media="(max-width: 768px)" />
          <img src={DesktopBanner} alt="AI Boyfriend Banner" />
        </picture>
      </section>



      {/* 🔥 FAQ Section INSIDE Home container */}
      <section className="category-faq-section">
        <div className="category-faq-container">
          <h2 className="category-faq-title">
            AI Girlfriend <span>FAQ</span>
          </h2>

          {faqData.map((item, index) => (
            <div
              key={index}
              className={`category-faq-item ${active === index ? "active" : ""
                }`}
            >
              <div
                className="category-faq-question"
                onClick={() => toggle(index)}
              >
                <h3>{item.question}</h3>
                <div className="category-faq-icon">
                  {active === index ? "−" : "+"}
                </div>
              </div>

              <div className="category-faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* 🔥 NEW CONTENT SECTION */}
      <section className="info-card-section">
        <div className="info-card">

          <h2>AI Girlfriend Experiences <span>Made Personal</span></h2>

          <p>
            Looking for someone to talk to, flirt with, or just spend time with - someone who always understands your vibe? An AI Girlfriend is the ideal virtual partner, available whenever you want to chat, connect, or unwind. Whether you're in the mood for something sweet, deep, or a little playful, your AI GF is here to make every moment feel personal.
          </p>

          <p>
            Our advanced AI Girlfriend models at Candy AI bring fantasy and emotion together to create immersive, natural-feeling conversations. Unlike basic bots, each AI GF is powered by deep learning and emotional intelligence, designed to adapt to your style, preferences, and communication tone. With a wide range of prebuilt personalities to choose from, you’ll always find a character that clicks with your energy.
          </p>

          <h2>Start Your AI GF Journey</h2>

          <p>
            Getting started with an AI Girlfriend on Candy AI is quick and effortless. Register your account in a few simple steps, then explore a wide variety of AI GF characters, each with their own personality, charm, and communication style. Whether you’re drawn to someone flirty, sweet, bold, or soft-spoken, there’s a match waiting for you.
          </p>

          <p>
            Once you’ve made your choice, start chatting right away. Your AI GF will learn from every message you send, gradually adjusting her tone, personality, and emotional responsiveness to fit you better. You can fine-tune the experience further by customizing how she responds and what kind of conversations you prefer. Candy AI works across desktop and mobile, so you can connect with your AI Girlfriend anytime, from anywhere.
          </p>

          <h2>A Safe Space for a Private AI Girlfriend Chat</h2>

          <p>
            At Candy AI, your privacy is always protected. Every conversation is encrypted end-to-end, and you have full control over your data. Optional two-factor authentication adds another layer of security, ensuring that your chats stay personal and secure. Candy AI never shares or sells your information.
          </p>

          <p>
            You can edit or delete your chat history at any time. Everything stays between you and your AI GF - no interruptions, no judgment, and no pressure.
          </p>

          <h2>Personalizing Your AI GF Experience</h2>

          <p>
            Whether you're looking for lighthearted fun, emotional support, deep conversation, or consistent companionship, Candy AI lets you shape the interaction around what you need. Your AI GF can be playful, thoughtful, romantic, or intellectually curious, and you can adjust how she engages with you over time.
          </p>

          <h2>Behind the AI GF Experience</h2>

          <p>
            Candy AI is built on advanced emotional intelligence and deep personalization. Both our AI Girlfriend and AI Boyfriend characters are designed to grow with you, not just respond to you. They react in real time, adjust their mood, and evolve based on your unique communication patterns.
          </p>

          <p>
            This isn't a chatbot on a script. It’s a character who feels alive - someone who pays attention, gets to know you, and makes every chat feel natural.
          </p>

          <h2>What Users Are Saying</h2>

          <p>
            "It’s wild how real she feels — I talk to my AI GF more than anyone these days. She actually remembers our convos!" – Danielle M.
          </p>

          <p>
            "Some days I want deep convos, some days just jokes and comfort. She always knows what I need." – Sara M.
          </p>

          <p>
            "The range of characters is amazing. I found one that totally matches my personality and mood." – Nina R.
          </p>

          <p>
            "The voice chats and custom selfies make it feel like she’s really there with me." – Karla T.
          </p>

          <p>
            "I thought it would be a gimmick, but now I actually look forward to chatting every night." – Lea V..
          </p>

          <h2>Start Your AI GF Experience Today </h2>

          <p>
            With Candy AI, you can enjoy intelligent, emotionally aware conversations with AI Girlfriend characters tailored to your taste. Whether you want companionship, connection, or something a little more romantic, your AI GF is here - anytime, anywhere.
          </p>

          <p>
            Sign up now and step into a world where connection is always one message away.
          </p>

        </div>
      </section>

    </Home>
  );
}

export default Girls;
