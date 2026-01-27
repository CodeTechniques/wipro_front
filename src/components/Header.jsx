import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { config } from '../services/api';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            {config.APP_NAME}
          </Link>
          
          <nav className="nav-links">
            {isAuthenticated ? (
              <>
                <div className="user-info">
                  Welcome, {user?.first_name || user?.username}!
                </div>
                <button 
                  onClick={handleLogout} 
                  className="nav-link" 
                  style={{background: 'none', border: 'none', cursor: 'pointer'}}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
