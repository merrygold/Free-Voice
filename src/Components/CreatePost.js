import React, { useState } from "react";
import "../Components/CreatePost.css"
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



function CreatePost() {



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

  // * State Hooks for Current Syndicate
  const { state: props } = useLocation();



  // * BigNumber to JS Number
  function bigToNum(_value) {
    const bigNumber = ethers.BigNumber.from(_value);
    return bigNumber.toNumber();
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
    console.log(description, title, hasImage, imageCid, spoiler, props.syndicateId);
    await createTextPost(
      description,
      title,
      hasImage,
      imageCid,
      spoiler,
      props.syndicateId
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


  return (
    <div>
      <div className="container">
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
                  <p className="box-text">{simpleFile.target.files[0].name}</p>
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

            <a className="create-post-btn" onClick={createPostButton}>
              Post
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
