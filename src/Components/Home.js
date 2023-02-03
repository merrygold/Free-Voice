import React, { useState } from "react";
import { ethers } from "ethers";
import "../Components/Home.css";
const Home = () => {
  const [postContent, setPostContent] = useState("");

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    // Connect to the Ethereum network
    const provider = new ethers.providers.InfuraProvider("ropsten");

    // Import the ABI and address of the smart contract
    const abi = [
      // Your ABI here
    ];
    const contractAddress = "0x1234567890abcdef";
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call the smart contract function to write the post
    await contract.post(postContent);

    // Reset the form after the post is submitted
    setPostContent("");
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <textarea
        value={postContent}
        onChange={handlePostContentChange}
        placeholder="What's happening?"
        rows="4"
      />
      <button type="submit">Tweet</button>
    </form>
  );
};

export default Home;
