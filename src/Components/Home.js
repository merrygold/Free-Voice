import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../Components/Home.css";
import abi from "../lib/abi.json";
import Web3 from "web3";
// import File from "../images/icons/file2.png";
import File from "../images/icons/file2.png";
import { Link } from "react-router-dom";
import lighthouse from "@lighthouse-web3/sdk";
import { useAccount } from "wagmi";
const Home = () => {
  const [postContent, setPostContent] = useState("");
  const [Syndicate, setSyndicate] = useState([]);
  const [Posts, setPosts] = useState("");
  const {address} = useAccount()
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

  // * State Hooks for Creating a Syndicate
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [NFTname, setNFTname] = useState("");
  const [NFTsymbol, setNFTsymbol] = useState("");

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
    const imageCid = await imageUploadSyndicate();
    await createSyndicate(name, desc, NFTname, NFTsymbol, imageCid);
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



    // * Main State Loader
    useEffect(() => {
      async function main() {
        await getAllSyndicates();
        await getHomePosts()
      }
  
      main();
    }, [address]);




  return (
    <>
      <div>Posts will Display here</div>

      {/*Image Upload*/}
      <form className="files-upload">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <label htmlFor="desc">Description:</label>
          <input
            type="text"
            id="desc"
            value={desc}
            onChange={handleDescChange}
          />
        </div>
        <div>
          <label htmlFor="NFTname">NFT Name:</label>
          <input
            type="text"
            id="NFTname"
            value={NFTname}
            onChange={handleNFTnameChange}
          />
        </div>
        <div>
          <label htmlFor="NFTsymbol">NFT Symbol:</label>
          <input
            type="text"
            id="NFTsymbol"
            value={NFTsymbol}
            onChange={handleNFTsymbolChange}
          />
        </div>
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

        <a onClick={createSyndicateButton} className="upload-btn">
          Create Syndicate
        </a>
      </form>

      <div className="Syndicate">Syndicate Array</div>
      {Syndicate.map((item) => (
        <ul key={item.returnValues.syndicateCount} className="Syndicate">
          <Link
            to={`/Syndicates/${item.returnValues.syndicateCount}`}
            style={{ textDecoration: "none" }}
            state={{
              id: item.returnValues.syndicateCount,
            }}
          >
            <li>{item.blockHash}</li>
            <li>{item.returnValues.syndicateCount}</li>
          </Link>
        </ul>
      ))}
    </>
  );
};

export default Home;
