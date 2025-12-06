import React, { useState } from "react";
import logo from "../../Images/logo.png";
import "./Join.css";
import { Link } from "react-router-dom";

// Remove the "let user" variable from outside the component

const Join = () => {
  const [name, setname] = useState("");

  const sendUser = () => {
    // Save the user to specific memory so Chat.jsx can find it
    localStorage.setItem("chatUser", name);
  };

  return (
    <div className="Joinpage">
      <div className="JoinContainer">
        <img src={logo} alt="logo" />
        <h1>Messages</h1>
        <input
          onChange={(e) => setname(e.target.value)}
          placeholder="Enter Your Name"
          type="text"
          id="joinInput"
        />
        <Link
          onClick={(event) => (!name ? event.preventDefault() : null)}
          to="/chat"
        >
          <button onClick={sendUser} className="joinBtn">
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;