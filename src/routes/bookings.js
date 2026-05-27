const express = require('express');
const router = express.Router();
const { getAllBookings, createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');

router.get('/', getAllBookings);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;