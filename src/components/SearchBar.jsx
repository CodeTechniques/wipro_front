// src/components/SearchBar.jsx
import React, { useState } from 'react';


const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      search: searchTerm,
      location: location,
      property_type: propertyType
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    setLocation('');
    setPropertyType('');
    onSearch({});
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-inputs">
        <div className="input-group">
          <span className="input-icon">🔍</span>
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="input-group">
          <span className="input-icon">📍</span>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="input-group">
          <span className="input-icon">🏠</span>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="search-select"
          >
            <option value="">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="office">Office Space</option>
            <option value="land">Land</option>
          </select>
        </div>
      </div>

      <div className="search-actions">
        <button type="submit" className="btn btn-primary search-btn">
          Search
        </button>
        <button 
          type="button" 
          onClick={handleClear}
          className="btn btn-outline clear-btn"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
