import React, { useState } from "react";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_OPENAI_API_ENDPOINT}/openai/deployments/gpt-35-turbo-instruct/completions?api-version=2023-05-15`,
        {
          prompt: input,
          max_tokens: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_OPENAI_API_KEY,
          },
        }
      );

      const aiMessage = {
        sender: "ai",
        text: response.data.choices[0].text.trim(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error al llamar a la API de OpenAI:", error);
    }
  };

  console.log(process.env.REACT_APP_OPENAI_API_ENDPOINT);

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={message.sender}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
