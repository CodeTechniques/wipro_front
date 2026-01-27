import React, { createContext, useState, useContext, useEffect } from 'react';


const PropertyContext = createContext();

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null
  });

  // Fetch properties with filters
  const fetchProperties = async (params = {}) => {
    setLoading(true);
    try {
      const response = await propertyAPI.getProperties(params);
      setProperties(response.results || response);
      setPagination({
        count: response.count || 0,
        next: response.next || null,
        previous: response.previous || null
      });
      return { success: true, data: response };
    } catch (error) {
      console.error('Fetch properties error:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single property
  const fetchProperty = async (id) => {
    try {
      const property = await propertyAPI.getProperty(id);
      return { success: true, data: property };
    } catch (error) {
      console.error('Fetch property error:', error);
      return { success: false, message: error.message };
    }
  };

  // Create property
  const createProperty = async (propertyData) => {
    try {
      const newProperty = await propertyAPI.createProperty(propertyData);
      setMyProperties(prev => [newProperty, ...prev]);
      return { success: true, data: newProperty, message: '🏠 Property created successfully!' };
    } catch (error) {
      console.error('Create property error:', error);
      return { success: false, message: error.message };
    }
  };

  // Update property
  const updateProperty = async (id, propertyData) => {
    try {
      const updatedProperty = await propertyAPI.updateProperty(id, propertyData);
      setMyProperties(prev => 
        prev.map(prop => prop.id === id ? updatedProperty : prop)
      );
      setProperties(prev => 
        prev.map(prop => prop.id === id ? updatedProperty : prop)
      );
      return { success: true, data: updatedProperty, message: '✅ Property updated successfully!' };
    } catch (error) {
      console.error('Update property error:', error);
      return { success: false, message: error.message };
    }
  };

  // Delete property
  const deleteProperty = async (id) => {
    try {
      await propertyAPI.deleteProperty(id);
      setMyProperties(prev => prev.filter(prop => prop.id !== id));
      setProperties(prev => prev.filter(prop => prop.id !== id));
      return { success: true, message: '🗑️ Property deleted successfully!' };
    } catch (error) {
      console.error('Delete property error:', error);
      return { success: false, message: error.message };
    }
  };

  // Upload property images
  const uploadImages = async (propertyId, images) => {
    try {
      const result = await propertyAPI.uploadImages(propertyId, images);
      return { success: true, data: result, message: '📸 Images uploaded successfully!' };
    } catch (error) {
      console.error('Upload images error:', error);
      return { success: false, message: error.message };
    }
  };

  // Fetch my properties
  const fetchMyProperties = async () => {
    try {
      const response = await propertyAPI.getMyProperties();
      setMyProperties(response.results || response);
      return { success: true, data: response };
    } catch (error) {
      console.error('Fetch my properties error:', error);
      return { success: false, message: error.message };
    }
  };

  // Create inquiry
  const createInquiry = async (propertyId, inquiryData) => {
    try {
      const result = await propertyAPI.createInquiry(propertyId, inquiryData);
      return { success: true, data: result, message: '📧 Inquiry sent successfully!' };
    } catch (error) {
      console.error('Create inquiry error:', error);
      return { success: false, message: error.message };
    }
  };

  // Toggle favorite
  const toggleFavorite = async (propertyId, isFavorited) => {
    try {
      const result = await propertyAPI.toggleFavorite(propertyId, isFavorited);
      // Update local state
      if (isFavorited) {
        setFavorites(prev => prev.filter(fav => fav.property.id !== propertyId));
      } else {
        await fetchFavorites(); // Refresh favorites list
      }
      return { success: true, data: result };
    } catch (error) {
      console.error('Toggle favorite error:', error);
      return { success: false, message: error.message };
    }
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      const response = await propertyAPI.getFavorites();
      setFavorites(response.results || response);
      return { success: true, data: response };
    } catch (error) {
      console.error('Fetch favorites error:', error);
      return { success: false, message: error.message };
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const statsData = await propertyAPI.getStats();
      setStats(statsData);
      return { success: true, data: statsData };
    } catch (error) {
      console.error('Fetch stats error:', error);
      return { success: false, message: error.message };
    }
  };

  // Apply filters
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
    fetchProperties();
  };

  const contextValue = {
    // State
    properties,
    myProperties,
    favorites,
    loading,
    stats,
    filters,
    pagination,

    // Methods
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadImages,
    fetchMyProperties,
    createInquiry,
    toggleFavorite,
    fetchFavorites,
    fetchStats,
    applyFilters,
    clearFilters,
  };

  return (
    <PropertyContext.Provider value={contextValue}>
      {children}
    </PropertyContext.Provider>
  );
};

export default PropertyProvider;
