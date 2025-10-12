// Booking routes

const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  getAllBookings,
  cancelBooking
} = require('../controllers/bookingController');

// POST /api/bookings
// GET /api/bookings/user (User's bookings)
// GET /api/bookings/:id
// GET /api/bookings (Admin)
// PUT /api/bookings/:id/cancel

module.exports = router;
