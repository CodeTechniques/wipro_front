import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currency } = useCurrency(); // ✅ GLOBAL CURRENCY

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        setLoading(true);
        const data = await getRequest(
          `${import.meta.env.VITE_PROPERTIES_ENDPOINT}/my-properties/`
        );
        setProperties(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteRequest(
          `${import.meta.env.VITE_PROPERTIES_ENDPOINT}/${id}/`
        );
        setProperties(properties.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Error deleting property:", err);
      }
    }
  };

  if (loading) return <div className="loading">Loading your properties...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="my-properties-container">
      <h1>My Properties</h1>
      <Link to="/my-properties/new" className="btn btn-primary">
        + Add New Property
      </Link>

      {properties.length === 0 ? (
        <p className="no-data">You haven't added any properties yet.</p>
      ) : (
        <table className="properties-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>{property.title}</td>
                <td>{property.location}</td>
                <td>{formatPrice(property.price, currency)}</td>
                <td>
                  <span className="badge badge-status">
                    {property.status}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/properties/${property.id}`}
                    className="btn btn-sm btn-info"
                  >
                    View
                  </Link>
                  <Link
                    to={`/my-properties/${property.id}/edit`}
                    className="btn btn-sm btn-secondary"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyProperties;
