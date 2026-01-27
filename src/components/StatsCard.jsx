// src/components/StatsCard.jsx
import React from 'react';


const StatsCard = ({ title, value, icon, description }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3 className="stats-value">{value}</h3>
        <p className="stats-title">{title}</p>
        {description && (
          <p className="stats-description">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
