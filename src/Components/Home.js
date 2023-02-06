import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../Components/Home.css";
import abi from "../lib/abi.json";
import Web3 from "web3";
import person1 from "../images/thumbnails/c1.png"
import img1 from "../images/thumbnails/nft.jpg"

import { Link } from "react-router-dom";

import { useAccount } from "wagmi";
const Home = () => {
  const [postContent, setPostContent] = useState("");
  const [Syndicate, setSyndicate] = useState([]);
  const [Posts, setPosts] = useState("");
  const {address , isConnected} = useAccount()
  // Create a provider using the RPC link

  // ** API GOD_FATHER
  const API = "1e8ba22b-e3c5-4335-aadd-79b5f614ce0f";

  const RPC = "https://api.hyperspace.node.glif.io/rpc/v1";

  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const web3 = new Web3(new Web3.providers.HttpProvider(RPC));

  const ABI = abi;

  const ContractAddress = "0x9528f220eBBC5770FAAc338d5018d871708e6EDb";

  const mainContract = new ethers.Contract(ContractAddress, ABI, provider);

  // * Utility Functions
  // * BigNumber to JS Number
  function bigToNum(_value) {
    const bigNumber = ethers.BigNumber.from(_value);
    return bigNumber.toNumber();
  }

  // * Remove Duplicate objects from an array
  function removeDuplicateObjects(array) {
    const seen = new Set();
    return array.filter((item) => {
      if (seen.has(item.transactionHash)) {
        return false;
      } else {
        seen.add(item.transactionHash);
        return true;
      }
    });
  }



  // * Get All the Sundicates from the Smart Contract
  async function getAllSyndicates() {
    const contract = new web3.eth.Contract(ABI, ContractAddress);

    // Parse events from contract
    const syndicates = await contract.getPastEvents(
      "EventCreateSyndicate",
      {
        fromBlock: 50000,
        toBlock: "latest",
      },
      function (error, eventsArray) {
        if (error) {
          console.log("there is an error");
        }
        return eventsArray;
      }
    );
    const filterSyndicates = removeDuplicateObjects(syndicates);
    setSyndicate(filterSyndicates);
    console.log(filterSyndicates);
  }



  // * Get all the posts of the syndicates user joined on the Home page

  const[displayPosts , setDisplayPosts] = useState('')

  async function getHomePosts(){

    // * Create Web3 Provider
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC));

    // * Create Web3 Contract
    const contract = new web3.eth.Contract(ABI, ContractAddress);

    //* Get All User Syndicates
    const userSyndicatesDouble = await contract.getPastEvents('EventJoinSyndicate', {
        fromBlock: 50000,
        toBlock: 'latest',
    },
    function(error, eventsArray) {
      return eventsArray
    }
    );

    // * Get Current User Joined Syndicates
    const userSyndicatesArray = removeDuplicateObjects(userSyndicatesDouble)
    const userSyndicates = []

    for (let i = 0; i < userSyndicatesArray.length; i++) {
        const currentEvent = userSyndicatesArray[i]
        // * If Event Match User joining
        if(currentEvent.returnValues._member == address) {
            // * Push syndicate Id to userSyndicates
            userSyndicates.push(currentEvent.returnValues.id)
        }
    }

    // * 2. Get All posts for User Syndicates
    // * Get all posts
    const syndicatesPostsDouble = await contract.getPastEvents('PostCreated', {
        fromBlock: 50000,
        toBlock: 'latest',
    },
    function(error, eventsArray) {
      return eventsArray
    }
    );

    const syndicatesPostsArray = removeDuplicateObjects(syndicatesPostsDouble)

    const userHomePosts = []

    // * Get only User Syndicates Post
    for (let i = 0; i < syndicatesPostsArray.length; i++) {
        const currentPost = syndicatesPostsArray[i]
        const currentPostSyndicateId = currentPost.returnValues.syndicateId

        // * If Posts User Ids is found inside UserSyndicates array
        // * Push the post into user Home Posts
        if(userSyndicates.includes(currentPostSyndicateId)) {
            userHomePosts.push(currentPost)
        }
    }

    // * return all User Home Posts
    setDisplayPosts(userHomePosts)
    console.log("These are the Posts")
    console.log(userHomePosts)
    return userHomePosts;
  
}

function UnixToTimeAgo(props) {
  const timestamp = props;
  const now = Date.now();
  const difference = now - timestamp * 1000;
  
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  
  if (difference >= day) {
    return Math.floor(difference / day) + " days ago";
  } else if (difference >= hour) {
    return Math.floor(difference / hour) + " hours ago";
  } else if (difference >= minute) {
    return Math.floor(difference / minute) + " minutes ago";
  } else {
    return Math.floor(difference / second) + " seconds ago";
  }
}

 // * Get User Data

 const [userData , setUserData] = useState();

 async function getUserData() {
  const userUpvotes = await mainContract.getUserUpvotesTotal(address)
  const userDownvotes = await mainContract.getUserDownvotesTotal(address)
  const userpostTotal = await mainContract.getUserpostTotal(address)

  const userData = {upVotes:bigToNum(userUpvotes) , downVotes:bigToNum(userDownvotes) , posts:bigToNum(userpostTotal)}
  console.log(userData)
  setUserData(userData)
 }

    // * Main State Loader
    useEffect(() => {
      if(isConnected) {
      async function main() {
        await getAllSyndicates();
        await getHomePosts()
        await getUserData()
      }
  
      main();
    }
    }, [address]);

  return (
    <>
      {isConnected && (
        <div className="home-page">
          <div className="communities-page">
            {userData && (
              <div className="user-dashboard">
                <h1
                  style={{ borderBottom: "3px solid gray" }}
                  className="user-dashboard-heading"
                >
                  User Dashboard
                </h1>
                <h1 className="user-upvotes">
                  User Upvotes: {userData.upVotes}
                </h1>
                <h1 className="user-downvotes">
                  User Downvotes: {userData.downVotes}
                </h1>
                <h1 className="user-posts">
                  User Total Posts: {userData.posts}
                </h1>
              </div>
            )}

            <div className="create-community">
              <Link to={"/community"}>
                <button className="create-btn">
                  Create your own community
                </button>
              </Link>
            </div>
            <div className="communities">
              {Syndicate.map((item) => (
                <div
                  key={item.returnValues.syndicateCount}
                  className="community-box"
                >
                  <img className="community-pic" src={person1} />

                  <div className="community-details">
                    <h2 className="community-name">
                      {item.returnValues.syndicateName}
                    </h2>
                    <Link
                      to={`/Syndicates/${item.returnValues.syndicateCount}`}
                      style={{ textDecoration: "none" }}
                      state={{
                        id: item.returnValues.syndicateCount,
                      }}
                    >
                      <button className="join-community">View Community</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {displayPosts && (
            <div>
              {displayPosts.map((item) => (
                <div className="posts-home" key={item.returnValues.id}>
                  <div className="posts-box">
                    <img className="post-pic" src={person1} />

                    <div className="post-details">
                      <h3 className="post-title">
                        {item.returnValues.memeTitle}
                      </h3>

                      <h4 className="post-time">
                        {UnixToTimeAgo(item.returnValues.datePosted)}
                      </h4>

                      <p className="post-description">
                        {item.returnValues.description}
                      </p>
                    </div>
                  </div>
                  {item.returnValues.hasImage && (
                    <img className="post-img" src={img1} />
                  )}

                  <Link
                    to={`/Post/${item.returnValues.id}`}
                    style={{ textDecoration: "none" }}
                    state={{
                      id: item.returnValues.id,
                      syndicateId: item.returnValues.syndicateId,
                    }}
                  >
                    <button className="details-btn">View Details</button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;