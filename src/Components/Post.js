import React from 'react'
import Navbar from "./Navbar"
import "../Components/Post.css"
import person1 from "../images/thumbnails/c1.png"
import Upvote from "../images/icons/upvote.png"
import Downvote from "../images/icons/downvote.png"
import Comments from "../images/icons/comment.png"


const Post = () => {
  return (
    <div>

      <div className='home'>
        <div className='comment-page'>

        <div className='posts-box'>
          <img className='post-pic' src={person1}/>

          <div className='post-details'>
            <h2 className='post-title'>
              Post Title 
            </h2>

            <h4 className='post-time'>
              10 minutes ago 
            </h4>


            <p className='post-description'>Lorem ipsum dolor sit amet. Id consequatur voluptate qui alias amet aut aspernatur debitis eos maxime esse! Non modi rerum ad aperiam omnis sit labore quia aut dicta cumque aut consequuntur dolorum. Aut dolor totam quo culpa dolor et laudantium architecto. Ut enim odit cum voluptatibus volupt
            </p>

          </div>

            
        </div>


        <div className='interaction'>

          <div className='comment-type'>
            <label className='comment'>
              <input className='comment-input' type="text" name="name" placeholder='Add Comments...' />
            </label>
            <button className='comment-post'>
              Post
            </button>
          </div>



          </div>
          <div className='voting'>

          <div className='comments'>
              <img  src={Comments}/>
              <p>47</p>
            </div>
            
            <div className='downvote'>
              <img  src={Downvote}/>
              <p>257</p>
            </div>

            <div className='upvote'>
              <img className='upvote' src={Upvote}/>
              <p>382</p>
            </div>

        </div>


      <h1 className='comment-heading'>Comments</h1>


        <div className='comment-section'>
          <img className='commenter-img' src={person1} />
          <span className='commentor-address'>Commentor Address: 0x320E927B87DB50E31b9C658901F52A42041c6D40</span>

          <div className='commentor-details'>

            <p className='commentor-description'>
          Lorem ipsum dolor sit amet. Id consequatur voluptate qui alias amet aut aspernatur debitis eos maxime esse! Non modi rerum ad aperiam omnis sit labore quia aut dicta cumque aut consequuntur dolorum. Aut dolor totam quo culpa dolor et laudantium architecto. Ut enim odit cum voluptatibus volupt
          </p>
            <h2 className='commentor-timing'>14 minutes ago...</h2>
          </div>
        </div>

        






      </div>
      </div>
      </div>


      
  )
}

export default Post