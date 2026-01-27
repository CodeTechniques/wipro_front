export const PROPERTY_TYPES = [
  { value: 'residential', label: '🏠 Residential' },
  { value: 'commercial', label: '🏢 Commercial' },
  { value: 'industrial', label: '🏭 Industrial' },
  { value: 'land', label: '🌍 Land' },
  { value: 'apartment', label: '🏬 Apartment' },
  { value: 'villa', label: '🏡 Villa' },
  { value: 'office', label: '💼 Office' },
  { value: 'shop', label: '🛍️ Shop' },
  { value: 'warehouse', label: '📦 Warehouse' },
];

export const LISTING_TYPES = [
  { value: 'sale', label: '💰 For Sale' },
  { value: 'rent', label: '🏠 For Rent' },
  { value: 'both', label: '🔄 Sale & Rent' },
];

export const PROPERTY_STATUS = [
  { value: 'available', label: '✅ Available' },
  { value: 'sold', label: '💰 Sold' },
  { value: 'rented', label: '🏠 Rented' },
  { value: 'pending', label: '⏳ Pending' },
  { value: 'withdrawn', label: '🚫 Withdrawn' },
];

export const INQUIRY_TYPES = [
  { value: 'buying', label: 'Interested in Buying' },
  { value: 'renting', label: 'Interested in Renting' },
  { value: 'viewing', label: 'Schedule Viewing' },
  { value: 'info', label: 'More Information' },
];

export const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest First' },
  { value: 'created_at', label: 'Oldest First' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-area_sqft', label: 'Area: Large to Small' },
  { value: 'area_sqft', label: 'Area: Small to Large' },
  { value: 'title', label: 'Title A-Z' },
  { value: '-views_count', label: 'Most Viewed' },
];

export const FEATURES = [
  { key: 'furnished', label: '🪑 Furnished' },
  { key: 'ac_available', label: '❄️ Air Conditioning' },
  { key: 'balcony', label: '🌅 Balcony' },
  { key: 'gym', label: '💪 Gym' },
  { key: 'swimming_pool', label: '🏊 Swimming Pool' },
  { key: 'garden', label: '🌸 Garden' },
  { key: 'security', label: '🔐 Security' },
  { key: 'lift_available', label: '🛗 Lift Available' },
  { key: 'power_backup', label: '⚡ Power Backup' },
  { key: 'parking', label: '🚗 Parking' },
  { key: 'pet_friendly', label: '🐕 Pet Friendly' },
  { key: 'internet_wifi', label: '📶 Internet/WiFi' },
  { key: 'water_supply', label: '💧 24/7 Water Supply' },
  { key: 'cctv', label: '📹 CCTV Surveillance' },
  { key: 'playground', label: '🎮 Playground' },
  { key: 'club_house', label: '🏛️ Club House' },
  { key: 'maintenance_staff', label: '👨‍🔧 Maintenance Staff' },
  { key: 'medical_center', label: '🏥 Medical Center' },
  { key: 'shopping_center', label: '🛒 Shopping Center' },
  { key: 'fire_safety', label: '🔥 Fire Safety' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const PRICE_RANGES = [
  { min: 0, max: 500000, label: 'Under ₹5L' },
  { min: 500000, max: 1000000, label: '₹5L - ₹10L' },
  { min: 1000000, max: 2000000, label: '₹10L - ₹20L' },
  { min: 2000000, max: 5000000, label: '₹20L - ₹50L' },
  { min: 5000000, max: 10000000, label: '₹50L - ₹1Cr' },
  { min: 10000000, max: 20000000, label: '₹1Cr - ₹2Cr' },
  { min: 20000000, max: 50000000, label: '₹2Cr - ₹5Cr' },
  { min: 50000000, max: null, label: 'Above ₹5Cr' },
];

export const AREA_RANGES = [
  { min: 0, max: 500, label: 'Under 500 sq ft' },
  { min: 500, max: 1000, label: '500 - 1000 sq ft' },
  { min: 1000, max: 1500, label: '1000 - 1500 sq ft' },
  { min: 1500, max: 2000, label: '1500 - 2000 sq ft' },
  { min: 2000, max: 3000, label: '2000 - 3000 sq ft' },
  { min: 3000, max: 5000, label: '3000 - 5000 sq ft' },
  { min: 5000, max: 10000, label: '5000 - 10000 sq ft' },
  { min: 10000, max: null, label: 'Above 10000 sq ft' },
];

export const BEDROOMS_OPTIONS = [
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5', label: '5+ BHK' },
];

export const BATHROOMS_OPTIONS = [
  { value: '1', label: '1 Bathroom' },
  { value: '2', label: '2 Bathrooms' },
  { value: '3', label: '3 Bathrooms' },
  { value: '4', label: '4+ Bathrooms' },
];

export const PROPERTY_AGE = [
  { value: 'new', label: 'Under Construction' },
  { value: '0-1', label: '0-1 Years' },
  { value: '1-5', label: '1-5 Years' },
  { value: '5-10', label: '5-10 Years' },
  { value: '10-20', label: '10-20 Years' },
  { value: '20+', label: '20+ Years' },
];

export const FACING_DIRECTION = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'north-east', label: 'North-East' },
  { value: 'north-west', label: 'North-West' },
  { value: 'south-east', label: 'South-East' },
  { value: 'south-west', label: 'South-West' },
];

export const TENANT_TYPE = [
  { value: 'family', label: 'Family' },
  { value: 'bachelors', label: 'Bachelors' },
  { value: 'company', label: 'Company' },
  { value: 'any', label: 'Any' },
];

export const FURNISHING_STATUS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi_furnished', label: 'Semi Furnished' },
  { value: 'fully_furnished', label: 'Fully Furnished' },
];

export const PARKING_TYPE = [
  { value: 'none', label: 'No Parking' },
  { value: 'open', label: 'Open Parking' },
  { value: 'covered', label: 'Covered Parking' },
  { value: 'both', label: 'Both' },
];

export const FLOOR_OPTIONS = [
  { value: 'ground', label: 'Ground Floor' },
  { value: '1', label: '1st Floor' },
  { value: '2', label: '2nd Floor' },
  { value: '3', label: '3rd Floor' },
  { value: '4', label: '4th Floor' },
  { value: '5', label: '5th Floor' },
  { value: '6', label: '6th Floor' },
  { value: '7', label: '7th Floor' },
  { value: '8', label: '8th Floor' },
  { value: '9', label: '9th Floor' },
  { value: '10+', label: '10+ Floor' },
];

export const POSSESSION_STATUS = [
  { value: 'ready', label: 'Ready to Move' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'new_launch', label: 'New Launch' },
];

export const TRANSACTION_TYPE = [
  { value: 'new_booking', label: 'New Booking' },
  { value: 'resale', label: 'Resale' },
];

export const APPROVAL_STATUS = [
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending Approval' },
  { value: 'not_applicable', label: 'Not Applicable' },
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_REQUIRED: 'Please login to access this feature.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  FILE_TOO_LARGE: 'File size too large. Maximum size allowed is 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload image files only.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
  PROPERTY_NOT_FOUND: 'Property not found.',
  INQUIRY_SEND_ERROR: 'Failed to send inquiry. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROPERTY_CREATED: 'Property listed successfully!',
  PROPERTY_UPDATED: 'Property updated successfully!',
  PROPERTY_DELETED: 'Property deleted successfully!',
  INQUIRY_SENT: 'Inquiry sent successfully!',
  FAVORITE_ADDED: 'Property added to favorites!',
  FAVORITE_REMOVED: 'Property removed from favorites!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  EMAIL_VERIFIED: 'Email verified successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTRATION_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  REFRESH_TOKEN: '/auth/refresh/',
  LOGOUT: '/auth/logout/',
  USER_PROFILE: '/auth/user/',
  CHANGE_PASSWORD: '/auth/change-password/',
  
  // Properties
  PROPERTIES: '/properties/',
  PROPERTY_DETAIL: '/properties/{id}/',
  MY_PROPERTIES: '/properties/my-properties/',
  FEATURED_PROPERTIES: '/properties/featured/',
  PROPERTY_STATS: '/properties/stats/',
  PROPERTY_VIEWS: '/properties/{id}/view/',
  
  // Favorites
  FAVORITES: '/properties/favorites/',
  TOGGLE_FAVORITE: '/properties/{id}/favorite/',
  
  // Inquiries
  INQUIRIES: '/properties/inquiries/',
  SEND_INQUIRY: '/properties/{id}/inquire/',
  INQUIRY_DETAIL: '/properties/inquiries/{id}/',
  MY_INQUIRIES: '/properties/inquiries/sent/',
  RECEIVED_INQUIRIES: '/properties/inquiries/received/',
  MARK_RESPONDED: '/properties/inquiries/{id}/respond/',
  
  // Search & Filters
  SEARCH: '/properties/search/',
  FILTERS: '/properties/filters/',
  
  // File Upload
  UPLOAD_IMAGE: '/properties/upload-image/',
  UPLOAD_DOCUMENT: '/properties/upload-document/',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  SEARCH_FILTERS: 'search_filters',
  RECENT_SEARCHES: 'recent_searches',
  PROPERTY_VIEWS: 'property_views',
  PREFERENCES: 'user_preferences',
};

// Pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  PAGE_SIZE_OPTIONS: [6, 12, 24, 48],
};

// File Upload Config
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    lat: 20.5937, // Center of India
    lng: 78.9629
  },
  DEFAULT_ZOOM: 5,
  PROPERTY_ZOOM: 15,
  SEARCH_RADIUS: 5000, // 5km in meters
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/wipo-properties',
  TWITTER: 'https://twitter.com/wipo_properties',
  INSTAGRAM: 'https://instagram.com/wipo.properties',
  LINKEDIN: 'https://linkedin.com/company/wipo-properties',
  YOUTUBE: 'https://youtube.com/wipoproperties',
};

// Contact Information
export const CONTACT_INFO = {
  EMAIL: 'info@wipoproperties.com',
  PHONE: '+91-9876543210',
  WHATSAPP: '+91-9876543210',
  ADDRESS: '123 Business Street, Tech City, India - 560001',
  SUPPORT_HOURS: 'Mon-Sat: 9:00 AM - 8:00 PM',
};

// SEO Meta Data
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'WIPO Properties - Find Your Dream Home',
  DEFAULT_DESCRIPTION: 'Discover the perfect property with WIPO Properties. Browse thousands of verified listings for homes, apartments, and commercial spaces across India.',
  DEFAULT_KEYWORDS: 'real estate, property, homes, apartments, buy, rent, sell, India, properties',
  SITE_URL: 'https://wipoproperties.com',
  DEFAULT_IMAGE: '/og-image.jpg',
};

// Feature Flags
export const FEATURESTECH = {
  ENABLE_CHAT: false,
  ENABLE_VIDEO_CALLS: false,
  ENABLE_VIRTUAL_TOURS: false,
  ENABLE_EMI_CALCULATOR: true,
  ENABLE_PROPERTY_COMPARISON: true,
  ENABLE_PRICE_ALERTS: false,
  ENABLE_SAVED_SEARCHES: true,
  ENABLE_DARK_MODE: false,
};

// Theme Colors
export const THEME_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: '480px',
  sm: '768px',
  md: '1024px',
  lg: '1200px',
  xl: '1400px',
};

// Animation Durations
export const ANIMATIONS = {
  FAST: '150ms',
  NORMAL: '300ms',
  SLOW: '500ms',
  EXTRA_SLOW: '1000ms',
};

export default {
  PROPERTY_TYPES,
  LISTING_TYPES,
  PROPERTY_STATUS,
  INQUIRY_TYPES,
  SORT_OPTIONS,
  FEATURES,
  INDIAN_STATES,
  PRICE_RANGES,
  AREA_RANGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_ENDPOINTS,
  STORAGE_KEYS,
  PAGINATION_CONFIG,
  UPLOAD_CONFIG,
  MAP_CONFIG,
  CONTACT_INFO,
  SEO_CONFIG,
};
