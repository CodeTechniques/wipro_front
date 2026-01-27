// src/components/SortDropdown.jsx
import React, { useState } from 'react';


const SortDropdown = ({ currentSort, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { field: 'created_at', order: 'desc', label: 'Newest First' },
    { field: 'created_at', order: 'asc', label: 'Oldest First' },
    { field: 'price', order: 'asc', label: 'Price: Low to High' },
    { field: 'price', order: 'desc', label: 'Price: High to Low' },
    { field: 'area', order: 'desc', label: 'Largest Area' },
    { field: 'area', order: 'asc', label: 'Smallest Area' },
    { field: 'bedrooms', order: 'desc', label: 'Most Bedrooms' },
    { field: 'bedrooms', order: 'asc', label: 'Fewest Bedrooms' }
  ];

  const currentLabel = sortOptions.find(
    option => option.field === currentSort.field && option.order === currentSort.order
  )?.label || 'Sort By';

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="sort-dropdown">
      <button 
        className="sort-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sort-label">
          <span className="sort-icon">↕️</span>
          {currentLabel}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="sort-menu">
          {sortOptions.map((option) => (
            <button
              key={`${option.field}-${option.order}`}
              className={`sort-option ${
                currentSort.field === option.field && currentSort.order === option.order ? 'active' : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
              {currentSort.field === option.field && currentSort.order === option.order && (
                <span className="check-icon">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
