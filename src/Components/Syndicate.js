import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import abi from "../lib/abi.json"
import Web3 from "web3";
import { ethers } from "ethers";
import './Syndicate.css';
import { useSigner } from 'wagmi'

function Syndicate() {


  const [src, setSrc] = useState(null);
  const IPFS = "https://ipfs.moralis.io:2053/ipfs/QmQmWq9mbB4GaiDVhbK6mbzhmc5ZTAEkJssRTYvht7eqdb";

  const fetchImage = async () => {
    try {
      const res = await fetch(IPFS);
      const blob = await res.blob();
      setSrc(URL.createObjectURL(blob));
    } catch (error) {

    }
  };



  // Create a provider using the RPC link
  const RPC = "https://api.hyperspace.node.glif.io/rpc/v1";
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const web3 = new Web3(new Web3.providers.HttpProvider(RPC));

  const ABI = abi

  const ContractAddress = "0x3Fe2d23543B3cb228e2a0b14FAf055b583EA5c99"

  const mainContract = new ethers.Contract(ContractAddress, ABI, provider)




  const { state: syndicateDetails } = useLocation();
  const [syndicate, setSyndicate] = useState()
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [original, setOriginal] = useState(false);
  // const syndicateID = syndicateDetails.id



  async function getSyndicate() {
    const syndicate = await mainContract.syndicates(syndicateDetails.id)
    setSyndicate(syndicate)
    console.log(syndicate)
  }


  async function createTextPost(_description, _title, _isSpoiler, _isOC, _syndicateId) {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const signContract = new ethers.Contract(ContractAddress, ABI, signer)
    const newTextPost = await signContract.uploadTextContent(_description, _title, _isSpoiler, _isOC, _syndicateId);
    await newTextPost.wait();
    console.log("New Post Created")
  }


  const createPostButton = async () => {

    await createTextPost(description, title, spoiler, original, syndicateDetails.id);
  };

  useEffect(() => {
    async function main() {
      await fetchImage();
      await getSyndicate()
    }
    main()
    console.log(syndicateDetails.id)

  }, []);
  return (
    <div className='coming-soon'>
      <img src={src} alt="Loading Image" />;
      {/* <form className="form">
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
          <div className="text">Original Content</div>
        </div>
        <div className="form-radio-buttons">
          <label>
            <input
              type="radio"
              name="original"
              value="true"
              checked={original === true}
              onChange={(e) => setOriginal(e.target.value)}
              required
            />
            True
          </label>
          <label>
            <input
              type="radio"
              name="original"
              value="false"
              checked={original === false}
              onChange={(e) => setOriginal(e.target.value)}
              required
            />
            False
          </label>


        </div>

        <a onClick={createPostButton} className="form-button">Post</a>
      </form> */}
    </div>
  )
}

export default Syndicate

