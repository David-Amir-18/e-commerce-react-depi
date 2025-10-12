// Authentication middleware

const authenticateToken = (req, res, next) => {
  // Verify JWT token logic
};

const isAdmin = (req, res, next) => {
  // Check if user is admin
};

module.exports = { authenticateToken, isAdmin };
