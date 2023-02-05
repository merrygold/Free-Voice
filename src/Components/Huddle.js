import React from 'react'
import { HuddleIframe } from "@huddle01/huddle01-iframe";



function Huddle() {
  const iframeConfig = {
    roomUrl: "https://iframe.huddle01.com/123",
    height: "800px",
    width: "100%",
    noBorder: true, // false by default
  };

  

  return (
    <div style={{marginTop: '20px'}}><HuddleIframe  config={iframeConfig} /></div>
  )
}

export default Huddle