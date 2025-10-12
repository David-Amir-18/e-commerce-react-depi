// Authentication controller

const register = async (req, res) => {
  // User registration logic
  // Default role: 'user'
  // Hash password
  // Save user to database
  // Return success message
};

const login = async (req, res) => {
  // Single login for both user and admin
  // Validate email and password
  // Check user role from database
  // Generate JWT token with role embedded
  // Return: { token, user: { id, name, email, role } }
  // Frontend will redirect based on role
};

module.exports = { register, login };
