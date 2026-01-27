// src/components/SimilarProperties.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSimilarProperties } from '../services/properties';
import PropertyCard from './PropertyCard';


const SimilarProperties = ({ currentPropertyId, location, propertyType }) => {
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSimilarProperties();
  }, [currentPropertyId, location, propertyType]);

  const loadSimilarProperties = async () => {
    try {
      setLoading(true);
      const data = await fetchSimilarProperties({
        exclude_id: currentPropertyId,
        location: location,
        property_type: propertyType,
        limit: 4
      });
      setSimilarProperties(data);
    } catch (err) {
      setError('Failed to load similar properties');
      console.error('Error loading similar properties:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="similar-properties">
        <h3 className="section-title">Similar Properties</h3>
        <div className="loading-similar">
          <div className="loading-spinner"></div>
          <p>Loading similar properties...</p>
        </div>
      </div>
    );
  }

  if (error || similarProperties.length === 0) {
    return null; // Don't show section if no similar properties
  }

  return (
    <div className="similar-properties">
      <div className="section-header">
        <h3 className="section-title">Similar Properties</h3>
        <Link to="/properties" className="view-all-link">
          View All →
        </Link>
      </div>
      
      <div className="similar-properties-grid">
        {similarProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;
