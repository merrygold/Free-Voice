import React, { useEffect, useState } from "react";
import Home from "../images/icons/home.png";
import Messages from "../images/icons/messages.png";
import Bell from "../images/icons/bell.png";
import Users from "../images/icons/users.png";

import Livepeer from "../images/icons/livepper.png";
import Ninja from "../images/icons/ninja.png";
import About from "../images/icons/about.png";
import Shadow from "../images/shadow-512x512.png";
import Search from "../images/icons/search.png";
import { Navigate } from 'react-router-dom';
import abi from "../lib/abi.json";

import "../Components/Navbar.css";
import { Link } from "react-router-dom";
import Connect from "./Connect";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

const Navbar = () => {
  const RPC = "https://api.hyperspace.node.glif.io/rpc/v1";

  const provider = new ethers.providers.JsonRpcProvider(RPC);

  const ABI = abi;

  const ContractAddress = "0x9528f220eBBC5770FAAc338d5018d871708e6EDb";

  const mainContract = new ethers.Contract(ContractAddress, ABI, provider);

  // * BigNumber to JS Number
  function bigToNum(_value) {
    const bigNumber = ethers.BigNumber.from(_value);
    return bigNumber.toNumber();
  }

  // * Get User Data

  const [platformData, setPlatformData] = useState();

  async function getPlatformData() {
    const totalUsers = await mainContract.getUserCount();
    const totalSyndicate = await mainContract.syndicateCount();
    const totalPosts = await mainContract.postCount();

    const platformDataObj = {
      users: bigToNum(totalUsers),
      syndicates: bigToNum(totalSyndicate),
      posts: bigToNum(totalPosts),
    };
    console.log(platformDataObj);
    setPlatformData(platformDataObj);
  }

  useEffect(() => {
    async function main() {
      await getPlatformData();
    }
    main();
    <Connect />;
  }, []);

  const { isConnected, isDisconnected } = useAccount();
  return (
    <div>
      {isConnected && (
        <>
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

            <div className="bell">
              <img className="bell-icon" src={Bell} />
              <Link to="/Notification">
              <h2 className="sidebar-icon_notification notification_style">Notification</h2>
              </Link>
            </div>

            <div className="livepeer">
              <img className="livepeer-icon" src={Ninja} />
              <Link to="/light-house">
                <h2 className="sidebar-livepeer">Ninja Sharing</h2>
              </Link>
            </div>

            <div className="messages">
              <img className="messages-icon" src={About} />
              <Link to="/Push">
                <h2 className="sidebar-livepeer">Story</h2>
              </Link>
            </div>
            {platformData && (
              <div className="home-data">
                <div className="users">
                  {/* <img className="user-icon" src={Users}/> */}
                  <h2>Users: {platformData.users}</h2>
                </div>
                <h2>Posts:{platformData.posts} </h2>
                <h2>Syndicates:{platformData.syndicates} </h2>
              </div>
            )}
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
