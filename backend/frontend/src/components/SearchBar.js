import React, { useState } from 'react';
import '../styles/SearchBar.css'
import { Box, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <Box
    id='search-bar-container'
    className='search-bar-container'
    component="form"
    noValidate
    autoComplete="off"
    >
        <TextField id='outlined-search' 
        label="Search for item:" 
        variant="outlined" 
        type='search'
        value={query}
        onChange={(e) => setQuery(e.target.value)} 
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <div className='button-container'>
            <Button variant="contained" onClick={handleSearch}>Search</Button>
            <Button variant='outlined' startIcon={<DeleteIcon/>} onClick={handleClear}>Clear</Button>
        </div>
    </Box>
  );
};

export default SearchBar;

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
}