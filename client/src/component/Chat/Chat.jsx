import React, { useEffect, useState, useRef } from "react";
import { io as socketIO } from "socket.io-client";
import "./Chat.css";
import sendImage from "../../Images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../Images/closeIcon.png";

const ENDPOINT = "http://localhost:4500/";

const Chat = () => {
  const chatBoxRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);
  
  // Typing State
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const user = localStorage.getItem("chatUser");

  useEffect(() => {
    const newSocket = socketIO(ENDPOINT, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setId(newSocket.id);
    });

    newSocket.emit("joined", { user });

    newSocket.on("welcome", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on("userJoined", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on("leave", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // 1. LISTEN FOR TYPING BROADCAST (New Logic)
    newSocket.on('displayTyping', (data) => {
        setTypingUser(data.user);
        setIsTyping(true);
        
        // Hide after 3 seconds
        setTimeout(() => {
            setIsTyping(false);
        }, 3000);
    });

    return () => {
      newSocket.disconnect();
      newSocket.off();
    };
  }, []);

  const sendMessage = () => {
    const message = document.getElementById("chatInput").value;
    if (socket) {
      socket.emit("message", { message, id });
      document.getElementById("chatInput").value = "";
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("sendMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
      return () => {
        socket.off("sendMessage");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>C CHAT</h2>
          <a href="/">
            <img src={closeIcon} alt="Close" />
          </a>
        </div>
        
        <div className="chatBoxContainer" ref={chatBoxRef}>
          <ReactScrollToBottom className="chatBox">
            {messages.map((item, i) => (
              <Message
                key={i}
                user={item.id === id ? "" : item.user}
                message={item.message}
                classs={item.id === id ? "right" : "left"}
              />
            ))}
          </ReactScrollToBottom>
        </div>

        {/* 2. SHOW TYPING INDICATOR (New UI) */}
        <div className="typingContainer">
            {isTyping ? <p style={{color: 'green', fontSize: '12px', paddingLeft: '10px'}}>{typingUser} is typing...</p> : null}
        </div>

        <div className="inputBox">
          <input
            // 3. TRIGGER TYPING EVENT (New Logic)
            onChange={() => socket && socket.emit('typing')} 
            onKeyPress={(event) =>
              event.key === "Enter" ? sendMessage() : null
            }
            type="text"
            id="chatInput"
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className="sendBtn">
            <img src={sendImage} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;