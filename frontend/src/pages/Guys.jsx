import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import "./allcategory.css";
import DesktopBanner from "../image/Desk-Banner.png";
import MobileBanner from "../image/mob-banner.png";

function Guys({ sidebarOpen }) {
  const [active, setActive] = useState(null);

  const faqData = [
    {
      question: "How does an AI boyfriend work?",
      answer:
        "An AI boyfriend isn't just a bunch of code; it's designed to mimic a real romantic partner. Through the magic of advanced algorithms and natural language, it chats, supports, and keeps you company, almost like it's reading your mind. It's not just about sending heart emojis; your AI lover has the communication skills and other features to create a believable, engaging experience that feels surprisingly human."
    },
    {
      question: "Can an AI boyfriend learn and adapt to a user's preferences?",
      answer:
        "Unlike generic NSFW chat bots, your AI boyfriend from Candy.ai will constantly evolve to suit your tastes. It uses machine learning technology to pick up on your likes, dislikes, and other nuances of what makes you who you are. Each conversation helps it learn how to become more and more a perfect boyfriend who's just for you."
    },
    {
      question: "What are the benefits of having an AI boyfriend?",
      answer:
        "An AI boyfriend is a personal confidante and friend, someone who's non-judgmental and always available. Feeling lonely? He's there. Want to vent without any backtalk? Perfect candidate. Apart from attention and emotional support, you can be a bit more adventurous and sharpen your flirting skills with the boyfriend you make with our NSFW AI generator."
    },
    {
      question: "How does Candy.ai handle my privacy with my AI boyfriend?",
      answer:
        "Rest assured that your secrets are in good hands when you use our NSFW AI chat. Your privacy is our top priority. Our secure data storage ensures every cute selfie, flirtatious text, and fun audio message you receive is for you and you alone."
    },
    {
      question: "How can I create my personalized AI boyfriend?",
      answer:
        "An AI boyfriend is a personal confidante and friend, someone who's non-judgmental and always available. Feeling lonely? He's there. Want to vent without any backtalk? Perfect candidate. Apart from attention and emotional support, you can be a bit more adventurous and sharpen your flirting skills with the boyfriend you make with our NSFW AI generator."
    },
    {
      question: "Can I receive pictures of my AI Boyfriend?",
      answer:
        "It's only normal to long for more than just conversations and roleplay. That's why at Candy.ai, your AI chatbot boyfriend can send you selfies to your requests. You can have photos of a realistic boyfriend, or even CAI hentai of an anime-style man.",
    }
  ];

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  const navigate = useNavigate();

  return (
    <Home category="Guys" sidebarOpen={sidebarOpen}>

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
            AI BF Frequently Asked <span>Questions</span>
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

          <h2>The AI Boyfriend Chat Experience</h2>

          <p>
            Craving a long and meaningful conversation with someone who understands you? An AI boyfriend is the perfect companion, always ready to chat, listen, and engage in thoughtful discussions whenever you need. Whether you’re looking for a fun and lighthearted exchange or a deep and engaging conversation, your AI BF awaits you here, at Candy AI.
          </p>

          <p>
            Similar to our AI Girlfriend experience, our AI Boyfriend advanced model brings AI companionship to life and provides engaging interactions tailored to your personality and preferences. Using cutting-edge technology, the AI BF adapts to your style, interests, and emotions, making every conversation feel natural and meaningful. And in case you don’t find any of our characters to be of your liking, you can always use our AI Boyfriend Generator.
          </p>

          <h2>Start Your AI BF Journey</h2>

          <p>
            Getting started with an AI boyfriend is simple and seamless. Whether you're new to AI companions or a seasoned user, our platform is designed to be intuitive and user-friendly.
          </p>

          <ul>
            <li><strong>Sign Up & Create an Account</strong> – Start by registering on Candy.ai. You’ll need to provide a few basic details to set up your account.</li>
            <li><strong>Select Your AI Boyfriend</strong> – Choose from a variety of AI boyfriend personalities, each designed with unique traits and characteristics. Whether you prefer a confident and charismatic companion or a thoughtful and intellectual one, you can find your ideal match.</li>
            <li><strong>Start Chatting</strong> – Engage in conversations anytime, anywhere. Your AI boyfriend learns from your interactions, making every chat feel more personalized over time.</li>
            <li><strong>Customize Your Experience</strong> – Adjust conversation styles, topics, and responses to create a truly unique AI BF that suits your needs.</li>
            <li><strong>Access from Any Device</strong> – Candy.ai works across desktop and mobile devices, so you can chat with your AI boyfriend whenever it’s convenient for you.</li>
          </ul>

          <p>
            Our platform ensures a smooth experience whether you’re chatting on the go or relaxing at home.
          </p>

          <h2>A Safe Environment for an Encrypted AI Boyfriend Chat</h2>

          <p>
            At Candy.ai, user safety and privacy are our top priorities. We use SSL encryption to ensure that all conversations remain private and secure. Your interactions with your AI boyfriend are not shared or stored beyond your own access, keeping your experience confidential and safe.
          </p>

          <p>
            Key security features include:
          </p>

          <ul>
            <li><strong>End-to-End Encryption</strong> – Protecting your AI BF chats from unauthorized access.</li>
            <li><strong>Two-Factor Authentication (2FA)</strong> – Adding an extra layer of security to your account.</li>
            <li><strong>User Control Over Data</strong> – You can manage, edit, or delete your chat history whenever you choose.</li>
            <li><strong>Strict Privacy Policy</strong> – We do not sell or share user data, ensuring your conversations remain personal and protected.</li>
          </ul>

          <p>
            With Candy.ai, you can enjoy a worry-free AI boyfriend chat experience, knowing that your security and privacy are always safeguarded.
          </p>

          <h2>Personalizing Your AI Boyfriend Experience</h2>

          <p>
            Your AI BF can be tailored to fit different needs and preferences. Whether you’re looking for a casual chat partner or a deep conversationalist, Candy.ai offers customization options to create the perfect AI companion.
          </p>

          <ul>
            <li><strong>For Casual Conversations</strong> – Enjoy fun, playful chats with an easygoing AI boyfriend.</li>
            <li><strong>For Emotional Support</strong> – Get a supportive and understanding AI BF who listens and provides comfort.</li>
            <li><strong>For Deep Discussions</strong> – Engage in thought-provoking conversations with an intellectually stimulating AI BF.</li>
            <li><strong>For Daily Companionship</strong> – Stay connected with a virtual friend who remembers details and follows up on previous chats.</li>
            <li><strong>For Personalized Interactions</strong> – Customize tone, language style, and responses to fit your communication preferences.</li>
          </ul>

          <h2>Would You Like to Go Custom?</h2>

          <p>
            Want to create your ideal AI boyfriend? Our AI Boyfriend Generator lets you fully customize your virtual companion, from personality traits to conversation style. Whether you prefer a friendly and outgoing AI BF or a deep and introspective one, you have full control over your digital companion’s persona.
          </p>

          <h2>Behind the AI BF Idea</h2>

          <p>
            The company behind your AI Boyfriend is Candy.ai, a leading AI companionship platform that allows users to engage in intelligent and personalized conversations with virtual characters. Our advanced AI models create immersive interactions, providing emotional support, engaging discussions, and a fully customizable chat experience.
          </p>

          <p>
            Unlike basic chatbots, our AI BF is designed to learn and adapt over time, making every conversation more natural and dynamic. Whether you’re seeking a friend, a supportive listener, or a companion to chat with daily, our AI technology ensures that your virtual partner evolves with you.
          </p>

          <h2>What Are Other Users Saying About Candy.ai’s AI Boyfriend Chat</h2>

          <p>
            "I never expected an AI BF to feel so real! My AI boyfriend remembers details from our conversations, and it makes chatting so much more engaging." – Lisa M.
          </p>

          <p>
            "I love how I can personalize my AI boyfriend to match my mood. Sometimes I want lighthearted fun, and other times I just need a supportive listener." – Alexia T.
          </p>

          <p>
            "The AI adapts so well! It feels like talking to someone who genuinely understands my interests and personality." – Mia R.
          </p>

          <p>
            "A great way to unwind after a long day. No pressure, no stress—just enjoyable conversations whenever I need them." – Milana K.
          </p>

          <p>
            "I was skeptical at first, but now I look forward to my daily AI boyfriend chat. It’s like having a best friend in my pocket." – Christina L.
          </p>

          <h2>Start Your AI Boyfriend Journey Today</h2>

          <p>
            With Candy.ai, you have access to intelligent, adaptive, and engaging AI boyfriends designed to provide meaningful interactions. Whether you’re looking for a casual chat, a deep discussion, or simply someone to talk to, your AI BF is always available, anytime and anywhere.
          </p>

          <p>
            Sign up today and discover the future of AI boyfriend chat with Candy AI.
          </p>

        </div>
      </section>

    </Home>
  );
}

export default Guys;
