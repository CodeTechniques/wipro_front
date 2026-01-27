import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './components/LoginForm'
import Register from './components/RegisterForm';
import Dashboard from './components/Dashboard';


import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import './App.css';
import Profile from "./components/Profile"



// Import the components I ACTUALLY created
import PropertyList from './components/PropertyListingPage';

import MyProperties from './components/MyProperties';
import Favorites from './components/Favorites';
import Inquiries from './components/Inquiries';
import Interests from './components/Interests';
import Transactions from './components/Transactions';

import Stats from './components/Stats';
import PlanPayment from './components/PlanPayment';


import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import PaymentPage from "./pages/PaymentPage";
import Notifications from "./pages/Notifications";




function App() {
  return (
    <Router>
      <AuthProvider>
        <PropertyProvider>
          <div className="App">
            <ScrollToTop />
            <Navbar />
            
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
               <Route path="/" element={<PropertyList />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/my-properties" element={<MyProperties />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/interests" element={<Interests />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/plans/:plan_id/pay" element={<PlanPayment />} />



            <Route path="/" element={<Home />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/plans/:planId/pay" element={<PaymentPage />} />
        <Route path="/notifications" element={<Notifications />} />

            


                
                
                

                
                
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </PropertyProvider>
      </AuthProvider>
    </Router>
  );
}

// 404 Component
const NotFound = () => (
  <div className="not-found">
    <div className="not-found-content">
      <h1>🔍 404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div className="not-found-actions">
        <a href="/" className="form-button">
          🏠 Go Home
        </a>
        <a href="/properties" className="form-button secondary">
          🔍 Browse Properties
        </a>
      </div>
    </div>
  </div>
);

export default App;




