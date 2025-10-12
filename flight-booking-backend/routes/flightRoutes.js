// Flight routes

const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const {
  searchFlights,
  getFlightById,
  addFlight,
  updateFlight,
  deleteFlight,
  getAllFlights
} = require('../controllers/flightController');

// GET /api/flights/search
// GET /api/flights/:id
// POST /api/flights (Admin)
// PUT /api/flights/:id (Admin)
// DELETE /api/flights/:id (Admin)
// GET /api/flights (Admin)

module.exports = router;
