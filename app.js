require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const slotRoutes = require('./src/routes/slots');
const bookingRoutes = require('./src/routes/bookings');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Universal Middleware Layout Layers
app.use(cors());
app.use(express.json());

// Expose public folder for static frontend delivery
app.use(express.static(path.join(__dirname, 'public')));

// Connect API routing sub-structures
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);

// Catch matching fallback paths for undefined routing layers
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Target operational path missing' });
});

// Register unified error tracking wrapper layer
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`CST Field Booking Engine operational at http://localhost:${PORT}`);
});