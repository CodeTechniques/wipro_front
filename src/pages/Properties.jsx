import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import PropertyCard from "../components/PropertyCard";
import "../styles/property.css";
import MiniVerticalNav from "../components/MiniVerticalNav";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔍 SEARCH STATES (IMPORTANT)
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState("");

  // ✅ INITIAL LOAD
  useEffect(() => {
    setLoading(true);
    apiFetch("/properties/")
      .then((data) => {
        setProperties(data.results || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load properties");
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ DEBOUNCE SEARCH INPUT
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ✅ FETCH WHEN SEARCH / FILTER CHANGES
  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (type) params.append("property_type", type);

    apiFetch(`/properties/?${params.toString()}`)
      .then((data) => {
        setProperties(data.results || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Search failed");
      })
      .finally(() => setLoading(false));
  }, [searchQuery, type]);

  return (
    <div className="properties-page">
      {/* LEFT – MINI NAV */}
      <div className="market-sidebar">
        <MiniVerticalNav />
      </div>

      {/* MARKET HEADER */}
      <div className="market-layout">
        <div className="market-main">
          <div className="market-header">
            <div className="market-header-inner">
              <div className="market-title">
                <h1>
                  Market <br />
                  <span>Listings</span>
                </h1>
                <p>Discover exclusive verified properties.</p>
              </div>

              <div className="market-actions">
                {/* 🔍 SEARCH */}
                <div className="market-search">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Search city, area or project..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>

                {/* 🔽 FILTER */}
                <select
                  className="market-filter"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTY GRID */}
      <div className="properties-container">
        {loading && <p className="properties-loading">Loading...</p>}
        {error && <p className="properties-error">{error}</p>}

        {!loading && properties.length === 0 ? (
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