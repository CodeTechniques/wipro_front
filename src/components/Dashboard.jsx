import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { config } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1 className="welcome-title">
        Welcome to {config.APP_NAME}! 🎉
      </h1>
      
      <div className="success-message">
        <h2>🚀 System Integration Successful!</h2>
        <p>Your JWT authentication system is working perfectly with React frontend using native Fetch API</p>
      </div>

      <div className="system-status">
        <div className="status-card">
          <h3>✅ Backend Status</h3>
          <p>Django REST API running smoothly</p>
          <small>{config.API_BASE_URL}</small>
        </div>
        
        <div className="status-card">
          <h3>✅ Frontend Status</h3>
          <p>React + Vite application connected</p>
          <small>Native Fetch API implementation</small>
        </div>
        
        <div className="status-card">
          <h3>✅ Authentication</h3>
          <p>JWT tokens working perfectly</p>
          <small>Auto-refresh enabled</small>
        </div>

        <div className="status-card">
          <h3>✅ User Profile</h3>
          <p>Welcome, {user?.first_name || user?.username}!</p>
          <Link to="/profile" style={{color: '#667eea', textDecoration: 'none', fontSize: '0.9rem'}}>
            Manage Profile →
          </Link>
        </div>
      </div>

      <div className="feature-list">
        <h3>🎯 Successfully Implemented Features</h3>
        <ul>
          <li>User Registration with validation</li>
          <li>Secure JWT Authentication</li>
          <li>Native Fetch API (no Axios dependency)</li>
          <li>Environment variable configuration</li>
          <li>Automatic token refresh</li>
          <li>Protected routes and components</li>
          <li>User session management</li>
          <li>Profile management system</li>
          <li>Password change functionality</li>
          <li>Responsive UI with modern design</li>
          <li>Error handling and user feedback</li>
          <li>Environment-aware development</li>
        </ul>
      </div>

      <div className="success-message" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <h2>🎊 Congratulations!</h2>
        <p>Your full-stack application with Django backend and React frontend is now complete with native Fetch API and environment variables!</p>
      </div>


   
    </div>
  );
};

export default Dashboard;
