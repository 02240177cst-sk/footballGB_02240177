const express = require('express');
const router = express.Router();
const { getAllBookings, createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');

// Define RESTful endpoint routes for booking entities
router.get('/', getAllBookings);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

// CRITICAL FIX: Export the router so app.js can use it as a function
module.exports = router;