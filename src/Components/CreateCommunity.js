
import "../Components/CreateCommunity.css"
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import abi from "../lib/abi.json";
import lighthouse from "@lighthouse-web3/sdk";
import File from "../images/icons/file2.png";
const CreateCommunity = () => {

// ** API GOD_FATHER
const API = "1e8ba22b-e3c5-4335-aadd-79b5f614ce0f";

const RPC = "https://api.hyperspace.node.glif.io/rpc/v1";

const provider = new ethers.providers.JsonRpcProvider(RPC);
const web3 = new Web3(new Web3.providers.HttpProvider(RPC));

const ABI = abi;

const ContractAddress = "0x88FD1e7E486DED4fFb4002417583DCB984a76AFD";

const mainContract = new ethers.Contract(ContractAddress, ABI, provider);


      // * State Hooks for Creating a Syndicate
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [NFTname, setNFTname] = useState("");
  const [NFTsymbol, setNFTsymbol] = useState("");
  const [loading, setloading] = useState(false);

  // * Input event handlers
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDescChange = (event) => {
    setDesc(event.target.value);
  };
  const handleNFTnameChange = (event) => {
    setNFTname(event.target.value);
  };
  const handleNFTsymbolChange = (event) => {
    setNFTsymbol(event.target.value);
  };

  // * Create a New Syndicate
  async function createSyndicate(
    _name,
    _desc,
    _NFTname,
    _NFTsymbol,
    _imageHash
  ) {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();

    const signContract = new ethers.Contract(ContractAddress, ABI, signer);
 
    const newSyndicate = await signContract.createSyndicate(
      _name,
      _desc,
      _NFTname,
      _NFTsymbol,
      _imageHash
    );
    
    await newSyndicate.wait();
    console.log("New Syndicate Created");
  }

  // * Button onClick "Create New Syndicate"
  const createSyndicateButton = async () => {
    setloading(true)
    const imageCid = await imageUploadSyndicate();
    await createSyndicate(name, desc, NFTname, NFTsymbol, imageCid);
    setloading(false)
  };

  // * Image Upload function for the Syndicate
  const [simpleFile, setSimpleFile] = useState(null);
  const [inputRefSimple, setInputRefSimple] = useState(null);

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };
  const imageUploadSyndicate = async () => {
    // * Upload File to lighthouse
    const output = await lighthouse.upload(simpleFile, API, progressCallback);
    // * Get Cid of the file
    const imageCid = output.data.Hash;
    return imageCid;
  };

  // * Get that Uploaded Simple file and then saving it to a state so we can use later
  const handleSimpleFile = (e) => {
    console.log(e);
    setSimpleFile(e);
  };

  const handleImageClick = () => {
    inputRefSimple.click();
  };












  return (
    <div className="container">
      <div className="title">Create your own community</div>
      <div className="content">
        <form action="#">
          <div className="user-details">
            <div className="input-box">
              <span className="details">Name</span>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="input-box">
              <span className="details">Description</span>
              <input
                type="text"
                id="desc"
                value={desc}
                onChange={handleDescChange}
              />
            </div>

            <div className="input-box">
              <span className="details">NFT Name</span>
              <input
                type="text"
                id="NFTname"
                value={NFTname}
                onChange={handleNFTnameChange}
              />
            </div>
            <div className="input-box">
              <span className="details">NFT Symbol</span>
              <input
                type="text"
                id="NFTsymbol"
                value={NFTsymbol}
                onChange={handleNFTsymbolChange}
              />
            </div>
            <div>
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
          </div>
          {loading ? (
            <button className="disable-btn" disabled>
              Creating Syndicate...
            </button>
          ) : (
            <a className="details-btn" onClick={createSyndicateButton}>
              Create Syndicate
            </a>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateCommunity
