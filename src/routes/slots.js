const express = require('express');
const router = express.Router();
const { getAllSlots, createSlot, updateSlot, deleteSlot } = require('../controllers/slotController');

// Define RESTful endpoint routes for slot entities
router.get('/', getAllSlots);
router.post('/', createSlot);
router.put('/:id', updateSlot);
router.delete('/:id', deleteSlot);

// CRITICAL FIX: Export the router so app.js can use it as a function
module.exports = router;