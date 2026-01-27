import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import PropertyCard from "../components/PropertyCard";
import "../styles/property.css";
import MiniVerticalNav from "../components/MiniVerticalNav";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/properties/")
      .then((data) => {
        setProperties(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading properties...</p>;

  return (
    <div className="properties-page">
      {/* LEFT – MINI NAV */}
  <div className="market-sidebar">
  <MiniVerticalNav />
</div>

      {/* MARKET HEADER */}
<div className="market-layout">

  

  {/* RIGHT – HEADER */}
  <div className="market-main">

    {/* MARKET HEADER */}
    <div className="market-header">
      <div className="market-header-inner">

        <div className="market-title">
          <h1>
            Market <br /><span>Listings</span>
          </h1>
          <p>Discover exclusive verified properties.</p>
        </div>

        <div className="market-actions">
          <div className="market-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search city, area or project..."
            />
          </div>

          <button className="market-filter">
            All Types <i className="bi bi-chevron-down"></i>
          </button>
        </div>

      </div>
    </div>

  </div>
</div>



      {/* PROPERTY GRID */}
      <div className="properties-container">
        {error && <p className="properties-error">{error}</p>}

        {properties.length === 0 ? (
          <div className="properties-empty">
            <p>No properties found</p>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
