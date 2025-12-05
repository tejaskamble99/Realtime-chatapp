import React, { useEffect, useState, useRef } from "react";
import { io as socketIO } from "socket.io-client";
import { user } from "../Join/Join";
import "./Chat.css";
import sendImage from "../../Images/send.png"; // Renamed to avoid conflict
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../Images/closeIcon.png";

const ENDPOINT = "http://localhost:4500/";

const Chat = () => {
  const chatBoxRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = socketIO(ENDPOINT, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      alert("Connected");
      setId(newSocket.id);
    });

    newSocket.emit("joined", { user });

    newSocket.on("welcome", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(data.user, data.message);
    });

    newSocket.on("userJoined", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(data.user, data.message);
    });

    newSocket.on("leave", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(data.user, data.message);
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
    } else {
      console.error("Socket is undefined");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("sendMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        console.log(data.user, data.message, data.id);
      });
      return () => {
        if (socket) {
          socket.disconnect(); // Disconnect the socket
          socket.off(); // Remove all event listeners
        }
      };
    }
  }, [socket]);
  useEffect(() => {
    // Scroll to bottom of chat box
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>C CHAT</h2>
          <a href="/">
            {" "}
            <img src={closeIcon} alt="Close" />
          </a>
        </div>
        <div className="header"></div>
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
        <div className="inputBox">
          <input
          onChange={() => socket.emit('typing', roomID)}
  
  onKeyPress={(event) =>
              event.key === "Enter" ? sendMessage() : null
            }
            type="text"
            id="chatInput"
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
