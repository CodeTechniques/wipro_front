import React, { useEffect, useState } from 'react';



const Stats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getRequest(`${import.meta.env.VITE_PROPERTIES_ENDPOINT}/stats/`);
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading stats...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="stats-container">
      <h1>Platform Statistics</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Properties</h3>
          <p className="stat-value">{stats.total_properties || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Favorites</h3>
          <p className="stat-value">{stats.total_favorites || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Inquiries</h3>
          <p className="stat-value">{stats.active_inquiries || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Investments Made</h3>
          <p className="stat-value">{stats.total_investments || 0}</p>
        </div>
      </div>

      <div className="chart-section">
        <h3>Recent Activity</h3>
        <p>Chart would display here (integrate Chart.js or SVG later).</p>
      </div>
    </div>
  );
};

export default Stats;
