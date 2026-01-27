// src/components/OwnerCard.jsx
import React, { useState } from 'react';


const OwnerCard = ({ owner }) => {
  const [showContact, setShowContact] = useState(false);

  const defaultOwner = {
    name: 'Rajesh Kumar',
    type: 'Property Owner',
    verified: true,
    rating: 4.8,
    total_properties: 12,
    member_since: '2018',
    response_rate: '95%',
    response_time: 'Within 2 hours'
  };

  const ownerData = owner || defaultOwner;

  const handleContactClick = () => {
    setShowContact(!showContact);
  };

  return (
    <div className="owner-card">
      <div className="owner-header">
        <div className="owner-avatar">
          {ownerData.name.charAt(0)}
        </div>
        <div className="owner-info">
          <h4 className="owner-name">
            {ownerData.name}
            {ownerData.verified && <span className="verified-badge">✓</span>}
          </h4>
          <p className="owner-type">{ownerData.type}</p>
          <div className="owner-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-value">{ownerData.rating}</span>
            <span className="rating-count">({ownerData.total_properties} properties)</span>
          </div>
        </div>
      </div>

      <div className="owner-stats">
        <div className="stat-item">
          <span className="stat-label">Member Since</span>
          <span className="stat-value">{ownerData.member_since}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Response Rate</span>
          <span className="stat-value">{ownerData.response_rate}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Response Time</span>
          <span className="stat-value">{ownerData.response_time}</span>
        </div>
      </div>

      <div className="owner-actions">
        <button className="btn btn-primary btn-block" onClick={handleContactClick}>
          {showContact ? 'Hide Contact' : 'Show Contact'}
        </button>
        
        {showContact && (
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span className="contact-text">+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span className="contact-text">owner@example.com</span>
            </div>
            <div className="contact-note">
              <small>Please be respectful when contacting the owner.</small>
            </div>
          </div>
        )}

        <button className="btn btn-outline btn-block">
          📅 Schedule Visit
        </button>
        <button className="btn btn-outline btn-block">
          💬 Send Message
        </button>
      </div>
    </div>
  );
};

export default OwnerCard;
