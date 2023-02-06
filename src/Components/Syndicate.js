import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import abi from "../lib/abi.json";
import nftAbi from "../lib/nftAbi.json";
import Web3 from "web3";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import "./Syndicate.css";
import { useAccount } from "wagmi";
import "../Components/Syndicate.css";
import person1 from "../images/dps/p1.jpeg";
import File from "../images/icons/file2.png";
import Cake from "../images/icons/cake.png";
import Huddle from "../images/icons/huddle.png";

function Syndicate() {
  // ? CONTRACT BOILERPLATE
  // ** API GOD_FATHER
  const API = "1e8ba22b-e3c5-4335-aadd-79b5f614ce0f";

  //* Create a provider using the RPC link
  const RPC = "https://api.hyperspace.node.glif.io/rpc/v1";
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const web3 = new Web3(new Web3.providers.HttpProvider(RPC));

  const ABI = abi;

  const NftABI = nftAbi

  const ContractAddress = "0x88FD1e7E486DED4fFb4002417583DCB984a76AFD";

  const mainContract = new ethers.Contract(ContractAddress, ABI, provider);


  // * BigNumber to JS Number
  function bigToNum(_value) {
    const bigNumber = ethers.BigNumber.from(_value);
    return bigNumber.toNumber();
  }
  // * State Hooks for NFT Dashboard
  // * Get Current User Address
  const { address } = useAccount();
  const [isOwnerNFT, setIsOwnerNFT] = useState(false);
  const [memberAddress, setMemberAddress] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [isUserJoined, setIsUserJoined] = useState(false);


  
  async function joinSyndicate() {

    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const mainContract = new ethers.Contract(ContractAddress, ABI, signer);
    const joinSyndicate = await mainContract.joinSyndicate(syndicate.syndicateCount);
    await joinSyndicate.wait() 

  }


  
  async function getUserJoined(currentSyndicateId) {
  
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
          const currentSyndicate = userSyndicatesArray[i]
          // * If Event Match User joining
          if(currentSyndicate.returnValues._member == address) {
              // * Push syndicate Id to userSyndicates
              userSyndicates.push(currentSyndicate.returnValues.id)
          }
      }
  
      // * If userSyndicates.includes(syndicateId) then isUserJoined = True
      if(userSyndicates.includes(currentSyndicateId))
      {
        setIsUserJoined(true)
      }
      else 
      {
        setIsUserJoined(false)
      }
    
  
  
  }






   // * Get isMember
   async function getMember(syndicateData) {
    const isMember = await mainContract.checkOwnership(address , syndicateData.syndicateCount);
    if (isMember) {
      setIsMember(true);
      return true;
    } else {
      setIsMember(false);
      return false
    }
  }
  

  // * Get isOwner
  async function getOwner(syndicateData) {
    if (syndicateData.syndicateCreator == address) {
      setIsOwnerNFT(true);
      return true;
    } else {
      setIsOwnerNFT(false);
      return false
    }
  }

  async function addMember() {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const nftContract = new ethers.Contract(
      syndicate.NftContract,
      NftABI,
      signer
    );

    const addMemberTransaction = await nftContract.safeMint(memberAddress);
    await addMemberTransaction.wait();
    console.log("Minted Successfully");
  }

  // * State Hooks for Current Syndicate
  const { state: syndicateId } = useLocation();
  const [syndicate, setSyndicate] = useState();

  // * BigNumber to JS Number
  function bigToNum(_value) {
    const bigNumber = ethers.BigNumber.from(_value);
    return bigNumber.toNumber();
  }

  // * Convert Unix to date format
  function convertUnixToDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleString();
  }
  // * Get a Syndicate by Id
  async function getSyndicate() {
    const syndicate = await mainContract.syndicates(syndicateId.id);
    setSyndicate(syndicate);
    return syndicate;
  }



  // * Get all the Posts of the Syncdicate
  const [allSyndicatePosts, setAllSyndicatesPosts] = useState("");
  const [createPost, setCreatePost] = useState("");
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
  // * Unix to time Ago
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

  // * Get all the SyndicatePosts
  async function getSyndicatePosts() {
    // * Create Web3 Provider
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC));

    // * Create Web3 Contract
    const contract = new web3.eth.Contract(ABI, ContractAddress);

    // * Get All Posts
    const syndicatesTotal = await contract.getPastEvents(
      "PostCreated",
      {
        fromBlock: 50000,
        toBlock: "latest",
      },
      function (error, eventsArray) {
        return eventsArray;
      }
    );

    //
    const syndicates = removeDuplicateObjects(syndicatesTotal);

    const PostsInSyndicate = [];

    for (let i = 0; i < syndicates.length; i++) {
      const currentPost = syndicates[i];

      if (currentPost.returnValues.syndicateId == syndicateId.id) {
        PostsInSyndicate.push(currentPost);
      }
    }
    PostsInSyndicate.reverse();
    // setCreatePost(PostsInSyndicate.returnValues.syndicateId)
    setAllSyndicatesPosts(PostsInSyndicate);
    console.log("Posts :");
    console.log(PostsInSyndicate);
    return PostsInSyndicate;
  }

  // * UseEffect for the Whole Statee
  useEffect(() => {
    async function main() {
     
      const syndicateData = await getSyndicate();
      // console.log(syndicateData)
      const isOwner = await getOwner(syndicateData);
      const isMember = await getMember(syndicateData);
      const isJoined = await getUserJoined(syndicateData.syndicateCount)

      const SyndicatePosts = await getSyndicatePosts();
    
      // console.log(isOwner)
    }
    main();
  }, [address]);

  return (
    <>
      {syndicate && allSyndicatePosts && (
        <div className="community">
          <div className="title">
            <button className="create-post-btn">
              <Link
                to={`/CreatePost/${syndicateId.id}`}
                style={{ textDecoration: "none" }}
                state={{
                 syndicateId: syndicateId.id,
                }}
              >
                Create Post
              </Link>
            </button>

            <img className="title-img" src={person1} />
            <h1 className="title-heading">{syndicate.syndicateName}</h1>
            <div className="huddle">
              <img className="huddle-icon" src={Huddle} />
              <Link
                to={"/Huddle/${syndicateId.id}"}
                style={{ textDecoration: "none" }}
                state={{
                  id: syndicateId.id,
                }}
              >
                <h2 className="sidebar-livepeer">Join Shadow Room</h2>
              </Link>
              {/* <button className="joined-status">
            Joined
          </button> */}
            </div>
          </div>

          <hr
            style={{
              border: "3px solid rgba(32, 32, 32, 1)",
              margin: "15px 50px",
            }}
          />

          <div className="about">
            <div className="about-input">
              {isOwnerNFT && (
                <label>
                  Add Member:
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Address"
                    value={memberAddress}
                    onChange={(e) => setMemberAddress(e.target.value)}
                    required
                  />
                  <button className="joined-status">
                    <a onClick={addMember}>Add User</a>
                  </button>
                </label>
              )}
            </div>

            {isMember && isOwnerNFT && isUserJoined && (
              <button className="joined-status">Creator</button>
            )}

            {isMember && !isOwnerNFT && isUserJoined && (
              <button className="joined-status">Member</button>
            )}

            {isMember && !isOwnerNFT && !isUserJoined && (
              <button className="joined-status">
                <a onClick={joinSyndicate}>Join</a>
              </button>
            )}

            {!isMember && !isOwnerNFT && !isUserJoined && (
              <button className="joined-status">Not Eligible</button>
            )}

            <h2 className="about-title">{syndicate.syndicateName}</h2>
            <hr
              style={{
                border: "px solid rgba(32, 32, 32, 1)",
                margin: "5px -10px",
              }}
            />

            <h3 className="description">
              s/{syndicate.syndicateName} {syndicate.syndicateDescription}
            </h3>

            <div className="dob">
              <img className="cake" src={Cake} />
              <h4 className="creation-date">
                Created on {convertUnixToDate(bigToNum(syndicate.dateCreated))}
              </h4>
            </div>

            <h3 className="syndicate-id">Syndicate ID: {syndicateId.id} </h3>

            <h3 className="creator-address">
              Creator's Address: {syndicate.syndicateCreator}
            </h3>
            <h3 className="creator-address">Nft Name: {syndicate._nftName}</h3>
            <h3 className="creator-address">
              NFT Symbol: {syndicate._nftSymbol}
            </h3>
            <h3 className="creator-address">
              NFT Address: {syndicate.NftContract}
            </h3>
          </div>

          <div className="home">
            <div className="posts-community">
              {allSyndicatePosts.map((posts) => (
                <>
                  <div
                    className="community-box"
                    key={posts.returnValues.datePosted}
                  >
                    <img className="community-post-pic" src={person1} />

                    <div className="community-post-details">
                      <h2 className="community-post-title">
                        {posts.returnValues.memeTitle}
                      </h2>

                      <h4 className="community-comment-time">
                        {UnixToTimeAgo(posts.returnValues.datePosted)}
                      </h4>

                      <p className="community-comment-description">
                        {posts.returnValues.description}
                      </p>
                      <Link
                        to={`/Post/${posts.returnValues.id}`}
                        style={{ textDecoration: "none" }}
                        state={{
                          id: posts.returnValues.id,
                          syndicateId: posts.returnValues.syndicateId,
                        }}
                      >
                        <button className="community-details-btn">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Syndicate;
