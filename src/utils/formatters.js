// Utility functions for formatting data

export const formatPrice = (price) => {
  if (!price) return '₹0';
  
  const num = parseInt(price);
  if (num >= 10000000) { // 1 crore
    return `₹${(num / 10000000).toFixed(1)}Cr`;
  } else if (num >= 100000) { // 1 lakh
    return `₹${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) { // 1 thousand
    return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num.toLocaleString()}`;
};

export const formatArea = (area) => {
  if (!area) return '0 sq ft';
  return `${parseInt(area).toLocaleString()} sq ft`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString();
};

export const getPropertyTypeIcon = (type) => {
  const icons = {
    'residential': '🏠',
    'commercial': '🏢',
    'industrial': '🏭',
    'land': '🌍',
    'apartment': '🏬',
    'villa': '🏡',
    'office': '💼',
    'shop': '🛍️',
    'warehouse': '📦',
  };
  return icons[type] || '🏠';
};

export const getStatusColor = (status) => {
  const colors = {
    'available': '#10B981',
    'sold': '#EF4444',
    'rented': '#F59E0B',
    'pending': '#8B5CF6',
    'withdrawn': '#6B7280'
  };
  return colors[status] || colors.available;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .trim();
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/\s/g, ''));
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

export const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-property.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it's a relative path, prepend the base URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend.wipogroup.in/api';
  // const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  return `${baseUrl}${imagePath}`;
};

export const shareProperty = async (property) => {
  const shareData = {
    title: property.title,
    text: `Check out this property: ${property.title} - ${formatPrice(property.price)}`,
    url: `${window.location.origin}/properties/${property.id}`
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return { success: true };
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return { success: false, error };
    }
  } else {
    // Fallback to copying to clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      return { success: true, method: 'clipboard' };
    } catch (error) {
      return { success: false, error };
    }
  }
};
