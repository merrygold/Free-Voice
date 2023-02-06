import React, { useEffect } from "react";
import Home from "../images/icons/home.png";
import Messages from "../images/icons/messages.png";
import Bell from "../images/icons/bell.png";
import Users from "../images/icons/users.png";

import Livepeer from "../images/icons/livepper.png";
import Lighthouse from "../images/icons/lighthouse.png";
import Shadow from "../images/shadow-512x512.png";
import Search from "../images/icons/search.png";
import { Navigate } from 'react-router-dom';

import "../Components/Navbar.css";
import { Link } from "react-router-dom";
import Connect from "./Connect";
import { useAccount } from "wagmi";

const Navbar = () => {

  useEffect(() => {
    <Connect />
  }, [])

  const { isConnected, isDisconnected } = useAccount();
  return (
    <div>
      {isConnected && (<>
        <div className="sidebar-icons">
          <div className="home">
            <img className="shadow-icon" src={Shadow} />
          </div>
          <div className="home">
            <img className="home-icon" src={Home} />
            <Link to="/Home">
              <h2 className="sidebar-livepeer"> Home</h2>
            </Link>
          </div>

          <div className="messages">
            <img className="messages-icon" src={Messages} />
            <Link to="/Push">
              <h2 className="sidebar-livepeer">Push Notifications</h2>
            </Link>
          </div>

          <div className="bell">
            <img className="bell-icon" src={Bell} />
            <h2 className="sidebar-icon_notification">Notification</h2>
          </div>

         

          <div className="livepeer">
            <img className="livepeer-icon" src={Lighthouse} />
            <Link to="/light-house">
              <h2 className="sidebar-livepeer">Lighthouse</h2>
            </Link>
          </div>

          <div className="home-data">

            <div className="users">
              {/* <img className="user-icon" src={Users}/> */}
              <h2>Total users: 256</h2>
            </div>
            <h2>Total posts on platform: 235</h2>
            <h2>Total syndicates: 26</h2>

          </div>
          <div className="livepeer">
            <Connect />
          </div>

        </div>
      </>

      )}

      {isDisconnected && <Navigate to="/login" />}
    </div>
  );
};

export default Navbar;
