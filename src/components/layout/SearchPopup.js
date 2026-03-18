import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchPopup = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeSearchPopup();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const closeSearchPopup = () => {
    document.body.classList.remove('open-search-popup');
    setSearchQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add search logic here
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="search-popup" onClick={(e) => {
      if (e.target === e.currentTarget) closeSearchPopup();
    }}>
      <div className="search-popup-container bg-white rounded-3 shadow-lg p-4">
        <button 
          className="btn-close position-absolute top-0 end-0 m-4" 
          onClick={closeSearchPopup}
          aria-label="Close search"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="search-content">
          <div className="popup-content">
            <h3 className="text-uppercase mb-4">Search Products</h3>
            <form className="search-form position-relative" onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control form-control-lg shadow-none border-0 border-bottom rounded-0 ps-0"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={inputRef}
              />
              <button 
                type="submit" 
                className="search-btn position-absolute end-0 top-50 translate-middle-y bg-transparent border-0"
                disabled={!searchQuery.trim()}
              >
                <FontAwesomeIcon icon={faSearch} className="text-primary" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
