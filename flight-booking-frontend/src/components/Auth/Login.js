import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // Component logic here
  // After successful login, check user role from response
  // If role === 'admin', redirect to admin dashboard
  // If role === 'user', redirect to user dashboard

  const handleLogin = async (credentials) => {
    // API call to login
    // Response contains: { token, user: { id, name, email, role } }
    // Store token and user data
    // Navigate based on role
  };

  return (
    <div>
      {/* Single Login Form for both User and Admin */}
      {/* Email and Password fields */}
    </div>
  );
};

export default Login;
