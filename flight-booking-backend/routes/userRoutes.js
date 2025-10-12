// User routes

const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser
} = require('../controllers/userController');

// GET /api/users (Admin)
// GET /api/users/:id
// PUT /api/users/:id/block (Admin)
// PUT /api/users/:id/unblock (Admin)

module.exports = router;
