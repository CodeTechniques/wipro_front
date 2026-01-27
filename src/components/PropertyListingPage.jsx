import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getRequest(import.meta.env.VITE_PROPERTIES_ENDPOINT);
        setProperties(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <div className="loading">Loading properties...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="property-list-container">
      <h1>Available Properties</h1>
      <Link to="/my-properties/new" className="btn btn-primary">+ Add Property</Link>

      <div className="properties-grid">
        {properties.map(property => (
          <div key={property.id} className="property-card">
            <div className="property-image">
              {property.images?.[0]?.image ? (
                <img src={property.images[0].image} alt={property.title} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="property-content">
              <h3>{property.title}</h3>
              <p className="property-location">{property.location}</p>
              <p className="property-price">${property.price.toLocaleString()}</p>
              <p className="property-description">{property.description?.substring(0, 100)}...</p>
              <Link to={`/properties/${property.id}`} className="btn btn-secondary">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
