import React from 'react'
import { HuddleIframe } from "@huddle01/huddle01-iframe";
import { useLocation } from 'react-router-dom';



function Huddle() {
  const { state: roomObj } = useLocation();
  console.log(roomObj)

  const roomUrl = "https://iframe.huddle01.com/" + roomObj.id ;
  const iframeConfig = {
    id :roomObj.id,
    roomUrl: roomUrl,
    height: "800px",
    width: "100%",
    noBorder: true, // false by default
  };



  return (
    <div style={{marginTop: '20px'}}><HuddleIframe  config={iframeConfig} /></div>
  )
}

export default Huddle