import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import abi from "../lib/abi.json";
import nftAbi from "../lib/nftAbi.json"
import Web3 from "web3";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import File from "../images/icons/file2.png";
import "./Syndicate.css";
import { useAccount } from "wagmi";

function Syndicate() {

  // ? CONTRACT BOILERPLATE
  // ** API GOD_FATHER
  const API = "1e8ba22b-e3c5-4335-aadd-79b5f614ce0f"

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
  const {address} = useAccount()
  const [isOwnerNFT, setIsOwnerNFT] = useState(false);
  const [memberAddress , setMemberAddress] = useState("");
  const [userBalance , setUserBalance] = useState(0);


  // * Get isOwner
  async function getOwner(_nftAddress) {
    const nftContract = new ethers.Contract(_nftAddress, NftABI, provider);
    const isOwner = await nftContract.owner()
    if (isOwner == address) {
      setIsOwnerNFT(true)
      const balance = await nftContract.balanceOf(address)
      setUserBalance(bigToNum(balance))
      return true
    }else {
      setIsOwnerNFT(false)
      const balance = await nftContract.balanceOf(address)
      setUserBalance(bigToNum(balance))
      console.log(bigToNum(balance))
    }
 
  }


  async function addMember()
  {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const nftContract = new ethers.Contract(syndicate.NftContract, NftABI, signer);
    
    const addMemberTransaction = await nftContract.safeMint(memberAddress)
    await addMemberTransaction.wait()
    console.log("Minted Successfully")
  }



  // * State Hooks for Current Syndicate
  const { state: syndicateId } = useLocation();
  const [syndicate, setSyndicate] = useState();

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
    var imageCid = ""
    var hasImage = false

    if (simpleFile) {
      imageCid = await imageUploadPost();
      hasImage = true
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
  const imageUploadPost = async() =>{
    // * Upload File to lighthouse
    const output = await lighthouse.upload(simpleFile, API, progressCallback);
    // * Get Cid of the file
    const imageCid = output.data.Hash
    return imageCid;
  }

  // * Handlers for File Upload
  const handleSimpleFile = (e) => {
    setSimpleFile(e);
  };
  const handleImageClick = () => {
    inputRefSimple.click();
  };

  // * Get all the Posts of the Syncdicate
  const [allSyndicatePosts , setAllSyndicatesPosts] = useState("")
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
  async function getSyndicatePosts() {

    // * Create Web3 Provider
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC));

    // * Create Web3 Contract
    const contract = new web3.eth.Contract(ABI, ContractAddress);

    // * Get All Posts
    const syndicatesTotal = await contract.getPastEvents('PostCreated', {
        fromBlock: 50000,
        toBlock: 'latest',
    },
    function(error, eventsArray) {
      return eventsArray
    }
    );

    // 
    const syndicates = removeDuplicateObjects(syndicatesTotal)

    const PostsInSyndicate = []

    for (let i = 0; i < syndicates.length; i++) {
      const currentPost = syndicates[i]

      if (currentPost.returnValues.syndicateId == syndicateId.id) {
        PostsInSyndicate.push(currentPost)
      }
    }
    PostsInSyndicate.reverse()
    setAllSyndicatesPosts(PostsInSyndicate)
    console.log(PostsInSyndicate)
    return PostsInSyndicate
}


  // * UseEffect for the Whole Statee
  useEffect(() => {
    async function main() {
      
      const syndicateData = await getSyndicate();
      // console.log(syndicateData)

      const isOwner = await getOwner(syndicateData.NftContract)

      const SyndicatePosts = await getSyndicatePosts()
      // console.log(isOwner)
    }
    main();
  }, [address]);



 

  return (
    <div className="coming-soon">
      {isOwnerNFT && 
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
    }
    <div>Balance of NFT : {userBalance}</div>
      {/* <img src={src} alt="Loading Image" />; */}
      <form className="form">
        <div className="form-inputs">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="text">Contain Spoiler</div>
        </div>
        <div className="form-radio-buttons">
          <label>
            <input
              type="radio"
              name="spoiler"
              value="true"
              checked={spoiler === true}
              onChange={(e) => setSpoiler(e.target.value)}
              required
            />
            True
          </label>
          <label>
            <input
              type="radio"
              name="spoiler"
              value="false"
              checked={spoiler === false}
              onChange={(e) => setSpoiler(e.target.value)}
              required
            />
            False
          </label>
        </div>
        <div>
          <img className="file-icon" src={File} onClick={handleImageClick} />
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
        <div>
          <div className="text">Contains Image</div>
        </div>


        <a onClick={createPostButton} className="form-button">
          Post
        </a>
      </form>
    </div>
  );
}

export default Syndicate;
