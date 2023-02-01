import React, { useState } from 'react';
import "../Components/SearchBar.css"
import Navbar from "../Components/Navbar"
import searchIcon from "../images/icons/search.png"

const SearchBar = () => {

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Perform search and update state
      }

  return (
    <div>
        <Navbar/>
        <div className='line'></div>
        <img className='search-icon' src={searchIcon}/>
      <input
            className='searchBar'
            type='text'
            value={searchTerm}
            placeholder='Search'
            onChange={(e) => setSearchTerm(e.target.value)} 
        />
      
    </div>
  )
}

export default SearchBar
