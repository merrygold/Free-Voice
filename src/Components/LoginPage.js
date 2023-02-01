import React, {useEffect, useState} from 'react'
import "../Components/LoginPage.css"
import Google from "../images/socials/google.png"
import Github from "../images/socials/github.png"
import Twitter from "../images/socials/twt.png"
import Metamask from "../images/wallets/metamask.png"
import { Link } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";

import Connect from './Connect';

const LoginPage = () => {

  useEffect(() => {
    <Connect/>
   }, [])

  return (
    <div className="login-page">
      <div className="signin-text">
        <h1 className="heading-txt">Sign in</h1>
        <h3 className="subheading-txt">Continue with Metamask</h3>
        <img className="wallet-icon" src={Metamask} />
    </div>  

    <div>
      
     
          <Connect />
      </div>
    </div>
  );
}

export default LoginPage







// function Rainbow() {


//     return (
//       
//     )
// }



// export default Rainbow