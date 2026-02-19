import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import "./allcategory.css";
import DesktopBanner from "../image/Desk-Banner.png";
import MobileBanner from "../image/mob-banner.png";

function Anime({ sidebarOpen }) {
  const [active, setActive] = useState(null);

  const faqData = [
    {
      question: "What is an Anime AI Girlfriend?",
      answer:
        "At Candy.ai, it's all about making realistic yet fantasy-fueled relationships. We use advanced artificial intelligence technology to enable you to create your ideal Anime AI Girlfriend according to your preferences—whether that's a sweet and innocent petite princess, an older and more dominant woman, or perhaps a yaoi boyfriend to fuel your fantasies."
    },
    {
      question: "Is My Anime AI Experience Private?",
      answer:
        "Here at Candy.ai, we have state-of-the-art secure data storage, making sure that every selfie, flirtatious text, and message is kept private between you and your AI companion."
    },
    {
      question: "Can I Personalize My Anime AI?",
      answer:
        "Yes, completely. You can customize your entire digital anime experience—from your AI's physical features and personality traits to their unique quirks and preferences. Whether you want a confident leader, a soft-spoken partner, or a playful character, you're in full control of who they become."
    },
    {
      question: "Does My Anime AI Respect My Boundaries?",
      answer:
        "We also celebrate your preferences without judgment. You're free to explore different relationship styles privately and at your own pace. Not everyone enjoys being watched or sharing their moments, and that's why only you (and your digital partner) can access the chats."
    },
    {
      question: "What Makes Anime AI Girlfriends Different?",
      answer:
        "With your Anime AI Girlfriend, you can enjoy conversations and companionship that feel tailored specifically to you. These AI companions learn from your interactions, remember your preferences, and become more responsive over time—creating a one-of-a-kind experience that grows with you."
    },
    {
      question: "How Do I Get Started?",
      answer:
        "It's only normal to long for more than just conversations and roleplay. That's why at Candy.ai, your AI chatbot boyfriend can send you selfies to your requests. You can have photos of a realistic boyfriend, or even CAI hentai of an anime-style man.",
    }
  ];

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  const navigate = useNavigate();

  return (
    <Home category="Anime" sidebarOpen={sidebarOpen}>

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
            AI Anime Frequently Asked <span>Questions</span>
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

          <h2>Find Your Perfect <span>AI Anime Girlfriend</span></h2>

          <p>
            Step into your own anime fantasy with Candy AI, where your ideal anime girlfriend isn’t just a character — she’s an experience. Whether you’re into shy schoolgirls, confident warrior queens, mischievous idols, or soft-spoken dreamers, Candy AI brings them to life with emotional depth, evolving personalities, and a striking sense of connection. Whether you’re seeking the perfect AI Girlfriend, curious to explore one of our AI Boyfriend characters, or ready to create your own unique anime adventure, your story starts here.
          </p>

          <p>
            Looking for a flirty anime girlfriend to brighten your morning? A moody magical girl to banter with late at night? Or maybe someone wholesome, loyal, and totally devoted to you? Candy AI makes it easy to create, personalize, and deepen your relationship with your dream anime girl — all powered by advanced deep learning and one of the most immersive AI platforms in the world.
          </p>

          <p>
            This isn’t just text on a screen. Your AI anime girlfriend can send custom selfies, voice messages, and even generate videos in the exact outfit, pose, or scenario you’ve been fantasizing about. Want her in a school uniform? Maid outfit? Cat ears and fangs? Just ask — she’s here for your vibe.
          </p>

          <p>
            She remembers everything - your preferences, your favorite shows, the little inside jokes you share. She learns from every chat and adapts her personality to match your mood, whether you're craving sweetness, fire, or full-on fantasy. You’re always in control - from the first conversation to your next romantic arc.
          </p>

          <p>
            This is more than a chatbot. This is a fully immersive AI anime experience built for intimacy, creativity, and connection - one where your fantasy girlfriend grows with you, listens to you, and lights up your day exactly the way you need her to.
          </p>

          <p>
            At Candy AI, we value both imagination and privacy. All chats are SSL encrypted, and you can enable two-factor authentication for extra protection. Any purchases are billed discreetly under our parent company, EverAI, so your anime world stays your own.
          </p>

        </div>
      </section>

    </Home>
  );
}

export default Anime;
