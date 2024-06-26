import React, { useEffect, useState } from "react";
import { postMessage, getMessages } from "../api/FirestoreAPI";
import { auth } from "../firebaseConfig";
import Loader from "../components/common/Loader";
import "../message.scss";

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUser({
        displayName: user.displayName || "Anonymous",
        email: user.email,
        uid: user.uid,
      });
    }
    getMessages(setMessages);
    setLoading(false);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && currentUser) {
      postMessage(message, currentUser.displayName);
      setMessage("");
    }
  };

  return loading ? <Loader /> : (
    <div className="message-container">
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className="message-item">
            <p className="message-sender"><strong>{msg.sender}:</strong></p>
            <p className="message-content">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-message-btn">Send</button>
      </div>
    </div>
  );
}
