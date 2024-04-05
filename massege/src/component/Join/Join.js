import React, { useState } from 'react';
import logo from "../../Images/logo.png"
import "./Join.css"
import{Link} from 'react-router-dom'


let user;

  const sendUser = () => {
    user = document.getElementById('joinInput').value;
    document.getElementById('joinInput').value = "";
  }
  const Join =() => {
    const [ name, setname] = useState("");
  return (
    <div className='Joinpage'>
      <div className='JoinContainer'>
      <img src={logo} alt='logo' />
      <h1>Masseges</h1>
      <input onChange={(e) => setname(e.target.value)} placeholder='Enter Your Email' type='text' id='joinInput' />
      <Link onClick={(event)=>!name ?event.preventDefault():null} to='/chat'> <button onClick={sendUser} className='joinBtn'>Log In</button> </Link>
      </div>
    </div>
  )
}

export default Join
export  { user }


