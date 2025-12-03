const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

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
    throw new APIError(
      error.message || 'Network error. Please check your connection.',
      0,
      null
    );
  }
}

export const authAPI = {
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  googleLogin: async (credential) => {
    return apiCall('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  },

  forgotPassword: async (email, method = 'otp') => {
    return apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, method }),
    });
  },

  verifyOTP: async (email, otp) => {
    return apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (resetData) => {
    return apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  },

  getMe: async () => {
    return apiCall('/auth/me', {
      method: 'GET',
    });
  },

  updateDetails: async (userData) => {
    return apiCall('/auth/updatedetails', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiCall('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

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

export const flightsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/flights${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  getById: async (id) => {
    return apiCall(`/flights/${id}`, {
      method: 'GET',
    });
  },

  create: async (flightData) => {
    return apiCall('/flights', {
      method: 'POST',
      body: JSON.stringify(flightData),
    });
  },

  update: async (id, flightData) => {
    return apiCall(`/flights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(flightData),
    });
  },

  delete: async (id) => {
    return apiCall(`/flights/${id}`, {
      method: 'DELETE',
    });
  },
};

export const bookingsAPI = {
  getAll: async () => {
    return apiCall('/bookings', {
      method: 'GET',
    });
  },

  getMyBookings: async () => {
    return apiCall('/bookings/my-bookings', {
      method: 'GET',
    });
  },

  getById: async (id) => {
    return apiCall(`/bookings/${id}`, {
      method: 'GET',
    });
  },

  create: async (bookingData) => {
    return apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  update: async (id, bookingData) => {
    return apiCall(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  cancel: async (id) => {
    return apiCall(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  updateStatus: async (id, status) => {
    return apiCall(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id) => {
    return apiCall(`/bookings/${id}/admin`, {
      method: 'DELETE',
    });
  },
};

export const usersAPI = {
  getAll: async () => {
    return apiCall('/users', {
      method: 'GET',
    });
  },

  getById: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'GET',
    });
  },

  create: async (userData) => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id, userData) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

export { APIError };
