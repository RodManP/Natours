const express = require('express');

const { getCheckoutSession } = require('../controllers/bookingController');

const { protect } = require('../controllers/authController');

// REVIEW ROUTES
const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

module.exports = router;
