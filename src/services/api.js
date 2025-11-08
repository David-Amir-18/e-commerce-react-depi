// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// API Error class for better error handling
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const token = sessionStorage.getItem('authToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || 'Something went wrong',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    // Network or other errors
    throw new APIError(
      error.message || 'Network error. Please check your connection.',
      0,
      null
    );
  }
}

// Authentication API Service
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Google OAuth login
  googleLogin: async (credential) => {
    return apiCall('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  },

  // Forgot password
  forgotPassword: async (email, method = 'otp') => {
    return apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, method }),
    });
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    return apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  // Reset password
  resetPassword: async (resetData) => {
    return apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  },

  // Get current user profile
  getMe: async () => {
    return apiCall('/auth/me', {
      method: 'GET',
    });
  },

  // Update user details
  updateDetails: async (userData) => {
    return apiCall('/auth/updatedetails', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Change password (for authenticated users)
  changePassword: async (currentPassword, newPassword) => {
    return apiCall('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Token Management
export const tokenService = {
  setToken: (token) => {
    sessionStorage.setItem('authToken', token);
  },

  getToken: () => {
    return sessionStorage.getItem('authToken');
  },

  removeToken: () => {
    sessionStorage.removeItem('authToken');
  },

  setUser: (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    sessionStorage.removeItem('user');
  },

  clear: () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  },
};

// Flights API Service (Admin)
export const flightsAPI = {
  // Get all flights
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/flights${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // Get single flight
  getById: async (id) => {
    return apiCall(`/flights/${id}`, {
      method: 'GET',
    });
  },

  // Create flight (admin only)
  create: async (flightData) => {
    return apiCall('/flights', {
      method: 'POST',
      body: JSON.stringify(flightData),
    });
  },

  // Update flight (admin only)
  update: async (id, flightData) => {
    return apiCall(`/flights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(flightData),
    });
  },

  // Delete flight (admin only)
  delete: async (id) => {
    return apiCall(`/flights/${id}`, {
      method: 'DELETE',
    });
  },
};

// Bookings API Service
export const bookingsAPI = {
  // Get all bookings (admin only)
  getAll: async () => {
    return apiCall('/bookings', {
      method: 'GET',
    });
  },

  // Get user's bookings
  getMyBookings: async () => {
    return apiCall('/bookings/my-bookings', {
      method: 'GET',
    });
  },

  // Get single booking
  getById: async (id) => {
    return apiCall(`/bookings/${id}`, {
      method: 'GET',
    });
  },

  // Create booking
  create: async (bookingData) => {
    return apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Update booking
  update: async (id, bookingData) => {
    return apiCall(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  // Cancel booking
  delete: async (id) => {
    return apiCall(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  // Update booking status (admin only)
  updateStatus: async (id, status) => {
    return apiCall(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Users API Service (Admin only)
export const usersAPI = {
  // Get all users (admin only)
  getAll: async () => {
    return apiCall('/users', {
      method: 'GET',
    });
  },

  // Get single user (admin only)
  getById: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'GET',
    });
  },

  // Update user (admin only)
  update: async (id, userData) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user (admin only)
  delete: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

export { APIError };
