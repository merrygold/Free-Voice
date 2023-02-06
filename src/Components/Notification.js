import React, { useEffect, useState } from "react";
import * as PushAPI from "@pushprotocol/restapi";

import { useAccount } from "wagmi";

function Notification() {
  // * State Hooks
  const { address, isConnected } = useAccount();

  // * State Data Hooks
  const [notifications, setNotifications] = useState();
  const [channels, setChannels] = useState([]);

  // * Get Notifications
  async function getAllNotifications() {
    const notifications = await PushAPI.user.getFeeds({
      user: `eip155:5:${address}`, // user address in CAIP
      env: "staging",
    });

    console.log("Notiii");
    console.log(notifications);

    setNotifications(notifications);
  }

  // *1  Get User Sub Channels with Details
  async function getUserChannels() {
    const channels = await getUserSub();

    const channelsData = [];

    for (let i = 0; i < channels.length; i++) {
      try {
        const currentChannelData = await getChannelDetail(channels[i].channel);
        channelsData.push(currentChannelData);
      } catch (error) {
        console.log(`${channels[i].channel} isnt a channel`);
      }
    }
    setChannels(channelsData);
    console.log("Chaneellll adartta");
    console.log(channelsData);
  }
  // ? 1.1 Get User Sub Channels
  async function getUserSub() {
    const subscriptions = await PushAPI.user.getSubscriptions({
      user: `eip155:5:${address}`, // user address in CAIP
      env: "staging",
    });

    setChannels(subscriptions);
    return subscriptions;
  }
  // ? 1.2 Get Channel Details
  async function getChannelDetail(_channelAddress) {
    const channelData = await PushAPI.channels.getChannel({
      channel: `eip155:5:${_channelAddress}`, // channel address in CAIP
      env: "staging",
    });
    return channelData;
  }

  useEffect(() => {
    if (isConnected) {
      async function main() {
        await getAllNotifications();

        await getUserChannels();
      }
      main();
    }
  }, [address]);

  const tableStyles = {
    fontWeight: "bold",
    color: "pink"
  };

  const thStyles = {
    backgroundColor: "grey",
    padding: "20px",
    margin: "20px",
  };

  const trStyles = {
    margin: "20px",
  };

  return (
    <div style={tableStyles} className="table">
      {notifications && (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Channel Name</th>
              <th>Notification</th>
            </tr>
          </thead>
   
            <tbody>
              {notifications.map((array, index) => (
                <tr key={index} className="active-row">
                  <td>{array.app}</td>
                  <td>{array.message}</td>
                </tr>
              ))}
            </tbody>
          
        </table>
      )}
      {channels && (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Channel Name</th>
              <th>Notification</th>
            </tr>
          </thead>
   
            <tbody>
              {channels.map((array, index) => (
                <tr key={index} className="active-row">
                  <td>{array.channel}</td>
                  <td>{array.name}</td>
                </tr>
              ))}
            </tbody>
          
        </table>
      )}
    </div>
    
  );
}

export default Notification;
