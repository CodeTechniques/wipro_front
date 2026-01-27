// src/components/PropertyInfoCard.jsx
import React from 'react';


const PropertyInfoCard = ({ property }) => {
  const formatNumber = (num) => {
    return num?.toLocaleString() || 'N/A';
  };

  const propertyInfo = [
    { label: 'Property ID', value: property.id, icon: '🆔' },
    { label: 'Property Type', value: property.property_type, icon: '🏠' },
    { label: 'Bedrooms', value: property.bedrooms, icon: '🛏️' },
    { label: 'Bathrooms', value: property.bathrooms, icon: '🛁' },
    { label: 'Built-up Area', value: `${formatNumber(property.area)} sqft`, icon: '📏' },
    { label: 'Carpet Area', value: `${formatNumber(property.carpet_area)} sqft`, icon: '📐' },
    { label: 'Year Built', value: property.year_built, icon: '📅' },
    { label: 'Floor', value: property.floor, icon: '🏢' },
    { label: 'Total Floors', value: property.total_floors, icon: '🏗️' },
    { label: 'Facing', value: property.facing, icon: '🧭' },
    { label: 'Furnishing', value: property.furnishing, icon: '🛋️' },
    { label: 'Parking', value: property.parking, icon: '🚗' },
  ];

  return (
    <div className="property-info-card">
      <h3 className="card-title">Property Details</h3>
      <div className="info-grid">
        {propertyInfo.map((info, index) => (
          <div key={index} className="info-item">
            <div className="info-icon">{info.icon}</div>
            <div className="info-content">
              <span className="info-label">{info.label}</span>
              <span className="info-value">{info.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyInfoCard;
