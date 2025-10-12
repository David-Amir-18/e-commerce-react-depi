// Authentication routes

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register - Register new user
// POST /api/auth/login - Single login endpoint for both user and admin

module.exports = router;
