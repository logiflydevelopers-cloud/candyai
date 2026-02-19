import React, { useState } from "react";
import "./Chat.css";

function Chat() {

  const [messages, setMessages] = useState([
    { text: "Hello 👋 Welcome to chat!", sender: "bot" }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };

    setMessages([...messages, newMessage]);
    setInput("");

    // fake bot reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { text: "This is a demo reply 🤖", sender: "bot" }
      ]);
    }, 800);
  };

  return (
    <div className="main-layout collapsed">
      <div className="container">

        <div className="chat-header">
          <h2>💬 Chat Room</h2>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.sender}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default Chat;
