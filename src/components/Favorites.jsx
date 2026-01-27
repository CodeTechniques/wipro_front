import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await getRequest(`${import.meta.env.VITE_PROPERTIES_ENDPOINT}/favorites/`);
        setFavorites(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <div className="loading">Loading favorites...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="favorites-container">
      <h1>Your Favorite Properties</h1>

      {favorites.length === 0 ? (
        <p className="no-data">You haven’t favorited any properties yet.</p>
      ) : (
        <div className="properties-grid">
          {favorites.map(property => (
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
                <Link to={`/properties/${property.id}`} className="btn btn-secondary">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
