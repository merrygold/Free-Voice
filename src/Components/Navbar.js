import React, { useEffect } from "react";
import Home from "../images/icons/home.png";
import Messages from "../images/icons/messages.png";
import Bell from "../images/icons/bell.png";
import Huddle from "../images/icons/huddle.png";
import Livepeer from "../images/icons/livepper.png";
import Search from "../images/icons/search.png";
import { Navigate } from 'react-router-dom';

import "../Components/Navbar.css";
import { Link } from "react-router-dom";
import Connect from "./Connect";
import { useAccount } from "wagmi";

const Navbar = () => {

  useEffect(() => {
   <Connect/>
  }, [])
  
  const { isConnected, isDisconnected } = useAccount();
  return (
    <div>
      {isConnected && (
        <div className="sidebar-icons">
          <div className="home">
            <img className="home-icon" src={Home} />
            <Link to="/Home">
            <h2 className="sidebar-livepeer"> Home</h2>
            </Link>
            
          </div>

          <div className="messages">
            <img className="messages-icon" src={Messages} />
            <h2 className="sidebar-icon_messages">Messages</h2>
          </div>

          <div className="bell">
            <img className="bell-icon" src={Bell} />
            <h2 className="sidebar-icon_notification">Notification</h2>
          </div>

          <div className="huddle">
            <img className="huddle-icon" src={Huddle} />
            <h2 className="sidebar-huddle">Huddle</h2>
          </div>

          <div className="livepeer">
            <img className="livepeer-icon" src={Livepeer} />
            <Link to="/light-house">
              <h2 className="sidebar-livepeer">Livepeer</h2>
            </Link>
          </div>

          <div className="livepeer">
            <Connect />
          </div>
        </div>
      )}

      {isDisconnected && (
        <Navigate to='/login' />
      )}
    </div>
  );
};

export default Navbar;
