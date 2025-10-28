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

export { APIError };
