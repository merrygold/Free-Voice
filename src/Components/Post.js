import React, { useEffect } from "react";
import Navbar from "./Navbar";
import "../Components/Post.css";
import person1 from "../images/thumbnails/c1.png";
import Upvote from "../images/icons/upvote.png";
import Downvote from "../images/icons/downvote.png";
import Comments from "../images/icons/comment.png";

// * Contract ABIs
import abi from "../lib/abi.json";
import nftAbi from "../lib/nftAbi.json"

// * Web3 Client Libs
import Web3 from "web3";
import { ethers } from "ethers";

// * Hooks
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useAccount } from "wagmi";

const Post = () => {
  // * Contract initialization
  const RPC = "https://api.hyperspace.node.glif.io/rpc/v1";
  // Provider
  const ethers_provider = new ethers.providers.JsonRpcProvider(RPC);
  const web3_provider = new Web3(new Web3.providers.HttpProvider(RPC));
  const ABI = abi;
  const ContractAddress = "0x88FD1e7E486DED4fFb4002417583DCB984a76AFD";

  // Contract Instance
  const ethersContract = new ethers.Contract(
    ContractAddress,
    ABI,
    ethers_provider
  );

  const web3_contract = new web3_provider.eth.Contract(ABI, ContractAddress);

  // User wallet hooks
  const { address, isConnected } = useAccount();
  // Post Id from Props
  const { state: postState } = useLocation();
  
  // * State Hooks
  // Loading State Hook
  const [isLoading, setIsLoading] = useState(false) 
  // Data State Hook
  const [gettingData, setGettingData] = useState(true)

  // For Comment Posting
  const [comment, setComment] = useState()

  //* View Data for Current Post
  // Post Data from Contract
  const [currentPost, setCurrentPost] = useState();
  // Comments for current Post
  const [comments, setComments] = useState([]);
  // Upvotes for Current Post
  const [upvotes, setUpvotes] = useState(0);
  // Downvotes for Current Post
  const [downvotes, setDownvotes] = useState(0);

  const [isMember, setIsMember] = useState(false);

  // * Get Functions
  // Get Current Post Details with PostId
  async function getPostDetails() {
        // All Posts Array with Duplicates
        const postsArrayArrayDuplicate = await web3_contract.getPastEvents(
          "PostCreated",
          {
            fromBlock: 50000,
            toBlock: "latest",
          },
          function (error, eventsArray) {
            return eventsArray;
          }
        );
    
        // Remove Duplicates
        const postsArray = removeDuplicateObjects(postsArrayArrayDuplicate);
    
        // * Get Details for Current Post
    
        var postDetails;

        for (let i = 0; i < postsArray.length; i++) {
          const currentPost = postsArray[i];
          // * If postId in matches Current Post Id
          if (currentPost.returnValues.id == postState.id) {
            // * Set it equal to current post
            postDetails = currentPost;
          }
        }
        console.log(postDetails);
        setCurrentPost(postDetails);
  }
  // Get Comments with PostId
  async function getComments() {
    // All Comments Array with Duplicates
    const commentsArrayDuplicate = await web3_contract.getPastEvents(
      "CommentAdded",
      {
        fromBlock: 50000,
        toBlock: "latest",
      },
      function (error, eventsArray) {
        return eventsArray;
      }
    );

    // Remove Duplicates
    const commentsArray = removeDuplicateObjects(commentsArrayDuplicate);

      console.log(commentsArray)

    // * Get Comments for Current Post

    const comments = [];
      console.log(commentsArray)
    for (let i = 0; i < commentsArray.length; i++) {
      const currentComment = commentsArray[i];

      // * If postId in Comment Match Current Post
      if (currentComment.returnValues.postId == postState.id) {
        // * Push Commend to current post Comments
        comments.push(currentComment);
      }
    }
    console.log("Comments")
    console.log(comments);
    setComments(comments);
  }
  // Get Upvotes with PostId
  async function getUpvotes() {
    // All Comments Array with Duplicates
    const upvotesArrayDuplicate = await web3_contract.getPastEvents(
      "PostUpvotes",
      {
        fromBlock: 50000,
        toBlock: "latest",
      },
      function (error, eventsArray) {
        return eventsArray;
      }
    );

    // Remove Duplicates
    const upvotesArray = removeDuplicateObjects(upvotesArrayDuplicate);

    // * Get Comments for Current Post

    const upvotes = [];

    for (let i = 0; i < upvotesArray.length; i++) {
      const currentUpvote = upvotesArray[i];

      // * If Upvote Id in upvote Match Current Post
      if (currentUpvote.returnValues.id == postState.id) {
        // * Push Upvote to current post Upvotes
        upvotes.push(currentUpvote.returnValues.id);
      }
    }

    console.log(upvotes);
    setUpvotes(upvotes.length);
  }
  // Get downVotes with PostId
  async function getDownvotes() {
    // All Comments Array with Duplicates
    const downvotesArrayDuplicate = await web3_contract.getPastEvents(
      "PostDownvotes",
      {
        fromBlock: 50000,
        toBlock: "latest",
      },
      function (error, eventsArray) {
        return eventsArray;
      }
    );

    // Remove Duplicates
    const downvotesArray = removeDuplicateObjects(downvotesArrayDuplicate);

    // * Get Comments for Current Post

    const downvotes = [];

    for (let i = 0; i < downvotesArray.length; i++) {
      const currentDownvote = downvotesArray[i];

      // * If Upvote Id in upvote Match Current Post
      if (currentDownvote.returnValues.id == postState.id) {
        // * Push Upvote to current post downvotes
        downvotes.push(currentDownvote.returnValues.id);
      }
    }

    console.log(downvotes);
    setDownvotes(downvotes.length);
  }

  // Get isMember with Address
  async function getIsMember() {
    // * Contract Initialization
    const NftABI = nftAbi;

    // * Get NFT Address
    console.log(postState)
    const syndicate = await ethersContract.syndicates(postState.syndicateId)
    const nftContractAddress = syndicate[8]

    const nftContract = new ethers.Contract(nftContractAddress, NftABI, ethers_provider);

    const user_balance = await nftContract.balanceOf(address)

    if (user_balance > 0) {
      setIsMember(true)
      return true
    } else {
      setIsMember(false)
      return false
    }
    
  }

  // * Write Functions
  // Write Comment on Post
  async function writeComment() {
    // Get Signer
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();

    // Contract Instance
    const ethersContract = new ethers.Contract(
      ContractAddress,
      ABI,
      signer
    );

    setIsLoading(true)
    // Write Function
    const commentTxn = await ethersContract.addComment(postState.id, comment)
    
      

    // Wait for Txn Mine
    await commentTxn.wait()
    
    setIsLoading(false)




  }
  // Write Upvote on Post
  async function writeUpvote() {
    // Get Signer
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();

    // Contract Instance
    const ethersContract = new ethers.Contract(
      ContractAddress,
      ABI,
      signer
    );

    setIsLoading(true)
    // Write Function
    const upvoteTxn = await ethersContract.upvoteMeme(postState.id)
    
    // Wait for Txn Mine
    await upvoteTxn.wait()
    setIsLoading(false)



  }
  // Write Downvote on Post
  async function writeDownvote() {
    // Get Signer
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();

    // Contract Instance
    const ethersContract = new ethers.Contract(
      ContractAddress,
      ABI,
      signer
    );

    setIsLoading(true)
    // Write Function
    const downvoteTxn = await ethersContract.downvoteMeme(postState.id)
    
    // Wait for Txn Mine
    await downvoteTxn.wait()
    setIsLoading(false)

  }


  // * useEffect => Update Component State
  useEffect(() => {
    async function main() {
      setGettingData(true)
      console.log("Getting Data")
      await getIsMember()
      await getPostDetails();
      await getComments();
      await getUpvotes();
      await getDownvotes();
      console.log("Got Data")
      setGettingData(false)
    }
    main()
  }, [postState, address]);


  // * Utility Functions
  // * Array Pruner
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

  // * Time Converter
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

  // * UI
  return (
    <div>
      {isConnected && (
        <div>
        <div className="home">
          {!gettingData && 
          <div className="comment-page">
            <div className="posts-box">
              <img className="post-pic" src={person1} />

              <div className="post-details">
                <h2 className="post-title">{currentPost.returnValues.memeTitle}</h2>

                <h4 className="post-time">{UnixToTimeAgo(currentPost.returnValues.datePosted)}</h4>

                <p className="post-description">
                  {currentPost.returnValues.description}
                </p>
              </div>
            </div>

            <div className="interaction">
              <div className="comment-type">
                <label className="comment">
                  <input
                    className="comment-input"
                    type="text"
                    name="comment"
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add Comments..."
                  />
                </label>
                
                <a onClick={writeComment} className="comment-post">Comment</a>
              </div>
            </div>
            <div className="voting">
              <div className="comments">
                <img src={Comments} />
                <p>{comments.length}</p>
              </div>

              <div className="downvote">
             
                <img onClick={writeDownvote} className="downvote" src={Downvote} />
                <p>{downvotes}</p>
              </div>

              <div className="upvote">
           
                <img onClick={writeUpvote} src={Upvote} />
                <p>{upvotes}</p>
              </div>
            </div>

            <h1 className="comment-heading">Comments</h1>
          {comments.map((comment) => (
            <div className="comment-section" key={comment.returnValues.datePosted}>
              <img className="commenter-img" src={person1} />
              <span className="commentor-address">
                Commentor Address: {comment.returnValues.addr}
              </span>

              <div className="commentor-details">
                <p className="commentor-description">
                  {comment.returnValues.commentMessage}
                </p>
                <h2 className="commentor-timing">{UnixToTimeAgo(comment.returnValues.datePosted)}</h2>
              </div>
            </div>
            ))}
          </div>
          }
          <div>
          {/* {isLoading &&
          <div>Transaction Underway....</div>
          } */}
          </div>
        </div>
        </div>

      )}
    </div>
  );
};

export default Post;
