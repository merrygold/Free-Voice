import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../Components/Home.css";
import abi from "../lib/abi.json"
import Web3 from "web3";
import { Link } from "react-router-dom";
const Home = () => {
  const [postContent, setPostContent] = useState("");
  const [Syndicate, setSyndicate] = useState([]);
  const [Post, setPost] = useState("");

  // Create a provider using the RPC link
  const RPC = "https://api.hyperspace.node.glif.io/rpc/v1"

  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const web3 = new Web3(new Web3.providers.HttpProvider(RPC));

  const ABI = abi

  const ContractAddress = "0x3Fe2d23543B3cb228e2a0b14FAf055b583EA5c99"

  const mainContract = new ethers.Contract(ContractAddress, ABI, provider)

  // * BigNumber to JS Number
  function bigToNum(_value) {
    const bigNumber = ethers.BigNumber.from(_value);
    return bigNumber.toNumber();
  }


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



  useEffect(() => {

    async function main() {
      await getAllSyndicates()
    }

    main()
  }, []);





  async function getAllSyndicates() {
    const contract = new web3.eth.Contract(ABI, ContractAddress);

    // Parse events from contract
    const syndicates = await contract.getPastEvents('EventCreateSyndicate', {
      fromBlock: 50000,
      toBlock: 'latest'
    },
      function (error, eventsArray) {
        if (error) {
          console.log("there is an error")
        }
        return eventsArray
      }
    );
    const filterSyndicates = removeDuplicateObjects(syndicates)
    setSyndicate(filterSyndicates)
    console.log(filterSyndicates)

  }




  // const handlePostContentChange = (event) => {
  //   setPostContent(event.target.value);
  // };

  // const handlePostSubmit = async (event) => {
  //   event.preventDefault();


  return (
    <>
      <div>Posts will Display here</div>

      <div className="Syndicate">Syndicate Array</div>



      {Syndicate.map(item => (
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
    // <form onSubmit={handlePostSubmit}>
    //   <textarea
    //     value={postContent}
    //     onChange={handlePostContentChange}
    //     placeholder="What's happening?"
    //     rows="4"
    //   />
    //   <button type="submit">Tweet</button>
    // </form>
  );
};

export default Home;
