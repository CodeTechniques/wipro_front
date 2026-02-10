import { toast } from "react-toastify";

// Get environment variables
// const API_BASE_URL = "http://127.0.0.1:8000/api";
const API_BASE_URL = "https://backend.wipogroup.in/api";

 const AUTH_PREFIX = "/auth";
 const TOKEN_REFRESH_ENDPOINT ="/auth/token/refresh/";




// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Enhanced fetch with error handling
const fetchWithAuth = async (url, options = {}) => {
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    let response = await fetch(`${API_BASE_URL}${url}`, config);

    // Handle token refresh for 401 errors
    if (response.status === 401 && !url.includes(TOKEN_REFRESH_ENDPOINT)) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}${TOKEN_REFRESH_ENDPOINT}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem('access_token', refreshData.access);

            // Retry original request with new token
            config.headers.Authorization = `Bearer ${refreshData.access}`;
            response = await fetch(`${API_BASE_URL}${url}`, config);
          } else {
            await logoutUser();
          }
        } catch (refreshError) {
          await logoutUser();
        }
      } else {
        await logoutUser();
      }
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json') 
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(data?.detail || data?.message || `HTTP error! status: ${response.status}`);
    }

    return { data, status: response.status, ok: response.ok };
    
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Logout helper
const logoutUser = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}${AUTH_PREFIX}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ refresh: refreshToken })
      });
    } catch (err) {
      console.warn('Failed to send logout request to server:', err);
    }
  }

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

// API helper functions
const apiRequest = {
  get: (url, options = {}) => fetchWithAuth(url, { method: 'GET', ...options }),
  post: (url, data, options = {}) => fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  }),
  put: (url, data, options = {}) => fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  }),
  delete: (url, options = {}) => fetchWithAuth(url, { method: 'DELETE', ...options }),
};

// Properties API functions
export const propertiesAPI = {
  /**
   * Fetch list of properties with optional filtering
   * @param {Object} params - Query parameters (e.g., page, search, status)
   * @returns {Promise<Object>} List of properties and pagination info
   */
  listProperties: async (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest.get(`/properties/${queryString}`);
  },

  /**
   * Create a new property
   * @param {Object} propertyData - Property details to create
   * @returns {Promise<Object>} Created property data
   */
  createProperty: async (propertyData) => {
    return apiRequest.post('/properties/', propertyData);
  },

  /**
   * Update an existing property
   * @param {string|number} propertyId - ID of the property to update
   * @param {Object} propertyData - Updated property details
   * @returns {Promise<Object>} Updated property data
   */
  updateProperty: async (propertyId, propertyData) => {
    return apiRequest.put(`/properties/${propertyId}/`, propertyData);
  },

  /**
   * Delete a property by ID
   * @param {string|number} propertyId - ID of the property to delete
   * @returns {Promise<Object>} Success confirmation
   */
  deleteProperty: async (propertyId) => {
    return apiRequest.delete(`/properties/${propertyId}/`);
  },

  /**
   * Get detailed information about a specific property
   * @param} propertyId - ID of the property
   * @returns {Promise<Object>} Full property details
   */
  getPropertyDetails: async (propertyId) => {
    return apiRequest.get(`/properties/${propertyId}/`);
  },

  /**
   * Upload property image
   * @param {string|number} propertyId - ID of the property
   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} Upload result
   */
  uploadPropertyImage: async (propertyId, file) => {
    const formData = new FormData();
    formData.append('image', file);

    return apiRequest.post(`/properties/${propertyId}/upload-image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Auth API functions
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration success or error message
   */
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data)
        if(data.username){
          toast.error(data?.username || 'Registration failed')
          throw new Error(data?.username || 'Registration failed');
        }
        if(data.email){
          toast.error('Email Already Register' || data?.email || 'Registration failed')
          throw new Error('Email Already Register');
        }
        toast.error(data?.detail || 'Registration failed')
        throw new Error(data?.detail || 'Registration failed');
      }

      return { data, status: response.status, ok: response.ok };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Authenticate user and obtain tokens
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Promise<Object>} Authenticated user data and tokens
   */
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.non_field_errors[0] || 'Login failed');
      }

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      return { data, status: response.status, ok: response.ok };
    } catch (error) {
      throw error;
    }
  },


  contact: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/contact-us/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.non_field_errors[0] || 'Login failed');
      }

      // localStorage.setItem('access_token', data.access);
      // localStorage.setItem('refresh_token', data.refresh);

      return { data, status: response.status, ok: response.ok };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout current user and invalidate tokens
   * @returns {Promise<Object>} Success confirmation
   */
  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}${AUTH_PREFIX}/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({ refresh: refreshToken })
        });
      } catch (err) {
        console.warn('Logout request failed, continuing anyway');
      }
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  },

  /**
   * Retrieve current user profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    return apiRequest.get(`${AUTH_PREFIX}/profile/`);
  },

  /**
   * Update current user profile
   * @param {Object} userData - Updated profile data
   * @returns {Promise<Object>} Updated profile
   */
  updateProfile: async (userData) => {
    return apiRequest.put(`${AUTH_PREFIX}/profile/`, userData);
  },

  /**
   * Change user password
   * @param {Object} passwordData - Old and new passwords
   * @returns {Promise<Object>} Success or error message
   */
  changePassword: async (passwordData) => {
    return apiRequest.post(`${AUTH_PREFIX}/change-password/`, passwordData);
  },

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Valid refresh token
   * @returns {Promise<Object>} New access token
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}${TOKEN_REFRESH_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || 'Token refresh failed');
      }

      localStorage.setItem('access_token', data.access);
      return { data, status: response.status, ok: response.ok };
    } catch (error) {
      throw error;
    }
  }
};

// Export configuration and main request utility
export const config = {
  API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  AUTH_PREFIX,
  TOKEN_REFRESH_ENDPOINT,
};


const API_BASE = import.meta.env.VITE_API_BASE_URL

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const url = `${API_BASE}${endpoint}`
  
  try {
    const response = await fetch(url, config)

    if (response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      throw new Error('Unauthorized - Session expired')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

export const api = {
  // ===== PROPERTIES =====
  getProperties: (params) => 
    apiFetch(`/properties/?${params?.toString() || ''}`),
  
  getProperty: (id) => 
    apiFetch(`/properties/${id}/`),
  
  createProperty: (formData) => {
    return fetch(`${API_BASE}/properties/`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    }).then(r => r.ok ? r.json() : Promise.reject(r))
  },

  updateProperty: (id, data) =>
    apiFetch(`/properties/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  deleteProperty: (id) =>
    apiFetch(`/properties/${id}/`, { method: 'DELETE' }),

  getMyProperties: () => 
    apiFetch('/properties/my-properties/'),

  // ===== PROPERTY IMAGES =====
  uploadPropertyImages: (propertyId, files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))
    
    return fetch(`${API_BASE}/properties/${propertyId}/images/`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    }).then(r => r.json())
  },

  // ===== INTERESTS & INQUIRIES =====
  createInterest: (propertyId, data) =>
    apiFetch(`/properties/${propertyId}/interest/`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getInterestsReceived: () => 
    apiFetch('/properties/interests/received/'),

  respondInterest: (interestId, action) =>
    apiFetch(`/properties/interests/${interestId}/respond/`, {
      method: 'POST',
      body: JSON.stringify({ action })
    }),

  createPropertyInquiry: (propertyId, data) =>
    apiFetch(`/properties/${propertyId}/inquire/`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getMyInquiries: () =>
    apiFetch('/properties/inquiries/sent/'),

  getInquiriesReceived: () =>
    apiFetch('/properties/inquiries/received/'),

  // ===== FAVORITES =====
  toggleFavorite: (propertyId) =>
    apiFetch(`/properties/${propertyId}/favorite/`, { method: 'POST' }),

  removeFavorite: (propertyId) =>
    apiFetch(`/properties/${propertyId}/favorite/`, { method: 'DELETE' }),

  getFavorites: () =>
    apiFetch('/properties/favorites/'),

  // ===== PLANS & PAYMENTS =====
  getPlanPayable: (planId) => 
    apiFetch(`/properties/plans/${planId}/payable/`),

  payPlan: (planId, data) =>
    apiFetch(`/properties/plans/${planId}/pay/`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  createLeadInvestment: (propertyId, data) =>
    apiFetch(`/properties/${propertyId}/invest/`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // ===== TRANSACTIONS & NOTIFICATIONS =====
  getMyTransactions: () =>
    apiFetch('/properties/transactions/my/'),

  getNotifications: () =>
    apiFetch('/properties/notifications/my/'),

  // ===== STATISTICS =====
  getPropertyStats: () =>
    apiFetch('/properties/stats/'),

  // ===== AUTH =====
  login: (credentials) =>
    apiFetch('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  register: (userData) =>
    apiFetch('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  getCurrentUser: () =>
    apiFetch('/auth/user/'),
}


export default apiRequest;
