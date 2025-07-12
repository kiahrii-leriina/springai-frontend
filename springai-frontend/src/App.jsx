import { useState } from "react";
import axios from "axios";
import './App.css';

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMsgs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    const loadingMessage = { from: "ai", text: "Typing..." };

    setMsgs(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const { data } = await axios.get(`http://localhost:8080/${encodeURIComponent(input)}`);
      setMsgs(prev => [
        ...prev.slice(0, -1), // remove loading message
        { from: "ai", text: data }
      ]);
    } catch (err) {
      setMsgs(prev => [
        ...prev.slice(0, -1),
        { from: "ai", text: "⚠️ Error talking to server." }
      ]);
    }

    setInput("");
    setIsLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Spring AI Chat</h1>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.from} ${m.text === "Typing..." ? "typing" : ""}`}
          >
            {m.text}
          </div>
        ))}

      </div>

      <form className="input-form" onSubmit={sendMessage}>
        <input
          className="chat-input"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={!input.trim() || isLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
