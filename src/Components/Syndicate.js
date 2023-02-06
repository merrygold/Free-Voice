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

  const ContractAddress = "0x9528f220eBBC5770FAAc338d5018d871708e6EDb";

  const mainContract = new ethers.Contract(ContractAddress, ABI, provider);

  // * State Variables for NFT Contract
  const NftABI = nftAbi;

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
  const [userBalance, setUserBalance] = useState(0);

  // * Get isOwner
  async function getOwner(_nftAddress) {
    const nftContract = new ethers.Contract(_nftAddress, NftABI, provider);
    const isOwner = await nftContract.owner();
    if (isOwner == address) {
      setIsOwnerNFT(true);
      const balance = await nftContract.balanceOf(address);
      setUserBalance(bigToNum(balance));
      return true;
    } else {
      setIsOwnerNFT(false);
      const balance = await nftContract.balanceOf(address);
      setUserBalance(bigToNum(balance));
      console.log(bigToNum(balance));
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

  // * State Hooks for CreatePost
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [spoiler, setSpoiler] = useState(false);

  // * Create A Post in current Syndicate
  async function createTextPost(
    _description,
    _title,
    _hasImage,
    _imageHash,
    _isSpoiler,
    _syndicateId
  ) {
    // * Get Signer
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    // * Create Contract Instance
    const signContract = new ethers.Contract(ContractAddress, ABI, signer);

    // * Create Post
    const newTextPost = await signContract.uploadTextContent(
      _description,
      _title,
      _hasImage,
      _imageHash,
      _isSpoiler,
      _syndicateId
    );

    // * wait for transaction to get mined
    await newTextPost.wait();
    console.log("New Post Created");
  }

  const createPostButton = async () => {
    var imageCid = "";
    var hasImage = false;

    if (simpleFile) {
      imageCid = await imageUploadPost();
      hasImage = true;
    }

    await createTextPost(
      description,
      title,
      hasImage,
      imageCid,
      spoiler,
      syndicateId.id
    );
  };

  // * Image Upload function for the Syndicate
  const [simpleFile, setSimpleFile] = useState(null);
  const [inputRefSimple, setInputRefSimple] = useState(null);

  // * Uplaod to Lighthouse
  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  // * Upload Image
  const imageUploadPost = async () => {
    // * Upload File to lighthouse
    const output = await lighthouse.upload(simpleFile, API, progressCallback);
    // * Get Cid of the file
    const imageCid = output.data.Hash;
    return imageCid;
  };

  // * Handlers for File Upload
  const handleSimpleFile = (e) => {
    setSimpleFile(e);
  };
  const handleImageClick = () => {
    inputRefSimple.click();
  };

  // * Get all the Posts of the Syncdicate
  const [allSyndicatePosts, setAllSyndicatesPosts] = useState("");
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

      const isOwner = await getOwner(syndicateData.NftContract);

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

            <img className="title-img" src={person1} />
            <h1 className="title-heading">{syndicate.syndicateName}</h1>
            <div className="huddle">
              <img className="huddle-icon" src={Huddle} />
              <Link to="/Huddle">
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
          {isOwnerNFT && (
            <>
              <div> Syndicate Owner </div>
              <input
                type="text"
                placeholder="Member Address"
                value={memberAddress}
                onChange={(e) => setMemberAddress(e.target.value)}
                required
              />

              <a onClick={addMember}>Add to Syndicate</a>
            </>
          )}
          <div>Balance of NFT : {userBalance}</div>

          <div className="about">

            <div className="about-input">
            <label>
              Lorem Epsum:
              <input className="input-field" type="text" name="name" />
            </label>
            {/* <input className="joined-status" type="submit" value="Submit" /> */}
            <button className="joined-status">
              Joined
            </button>
            </div>
            
            <h2 className="about-title">{syndicate.syndicateDescription}</h2>
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

          <button className="create-post-btn">
            Create Post
          </button>

          {/* <div className="container">
            <div className="title">Create Post</div>
            <div className="content">
              <form action="#">
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">Post Title</span>
                    <input
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Post Description</span>
                    <input
                      type="text"
                      placeholder="Give Some Breif Description of your Post"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="choose-pic-box">
                    <img
                      className="file-icon"
                      src={File}
                      onClick={handleImageClick}
                    />
                    <input
                      type="file"
                      ref={(input) => setInputRefSimple(input)}
                      onChange={handleSimpleFile}
                      style={{ display: "none" }}
                    />
                    {!simpleFile && (
                      <p className="box-text">Upload files (Simple Upload) </p>
                    )}
                    {simpleFile && (
                      <p className="box-text">
                        {simpleFile.target.files[0].name}
                      </p>
                    )}
                  </div>

                  <div className="spoiler">
                    <label className="spoiler-contain" for="show">
                      <input
                        type="radio"
                        name="spoilers"
                        value="true"
                        checked={spoiler === true}
                        onChange={() => setSpoiler(true)}
                      />
                      Contains spoiler
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="spoilers"
                        value="false"
                        checked={spoiler === false}
                        onChange={() => setSpoiler(false)}
                      />
                      Does Not Contain spoiler
                    </label>
                  </div>
                </div>

                <div className="button">
                  <a onClick={createPostButton} className="form-button">
                    Post
                  </a>
                </div>
              </form>
            </div>
          </div> */}

          <div className="home">
            <div className="posts-community">
              {allSyndicatePosts.map((posts) => (
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
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Syndicate;
