const db = require('../models/db');

// GET /api/bookings - Fetch reservations linked alongside the related slot parameters
const getAllBookings = (req, res, next) => {
    try {
        const query = `
            SELECT bookings.*, slots.display_name AS slot_name 
            FROM bookings 
            JOIN slots ON bookings.slot_id = slots.id
            ORDER BY bookings.date ASC
        `;
        const bookings = db.prepare(query).all();
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (err) { next(err); }
};

// POST /api/bookings - File record insertion into database after processing input structural checks
const createBooking = (req, res, next) => {
    try {
        const { name, category, contact, date, slot_id } = req.body;
        
        // Input validation sequence logic
        if (!name || !category || !contact || !date || !slot_id) {
            return res.status(400).json({ success: false, message: 'All booking fields are completely mandatory' });
        }

        // Avoid double booking double-reservations on the exact field index properties
        const conflict = db.prepare('SELECT id FROM bookings WHERE date = ? AND slot_id = ?').get(date, slot_id);
        if (conflict) {
            return res.status(400).json({ success: false, message: 'This field layout time is already booked for this date!' });
        }

        const statement = db.prepare('INSERT INTO bookings (name, category, contact, date, slot_id) VALUES (?, ?, ?, ?, ?)');
        const result = statement.run(name, category, contact, date, slot_id);
        
        const newRecord = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: newRecord });
    } catch (err) { next(err); }
};

// PUT /api/bookings/:id - Modify reservation attributes dynamically
const updateBooking = (req, res, next) => {
    try {
        const { name, category, contact, date, slot_id } = req.body;
        const current = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
        if (!current) return res.status(404).json({ success: false, message: 'Reservation data missing' });

        db.prepare(`
            UPDATE bookings 
            SET name = ?, category = ?, contact = ?, date = ?, slot_id = ? 
            WHERE id = ?
        `).run(
            name || current.name,
            category || current.category,
            contact || current.contact,
            date || current.date,
            slot_id || current.slot_id,
            req.params.id
        );

        res.status(200).json({ success: true, message: 'Booking entry adjusted.' });
    } catch (err) { next(err); }
};

// DELETE /api/bookings/:id - Wipe selected appointment identity row out of scope
const deleteBooking = (req, res, next) => {
    try {
        const info = db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
        if (info.changes === 0) return res.status(404).json({ success: false, message: 'Entry index does not exist' });
        res.status(200).json({ success: true, message: 'Booking removed successfully from server registers.' });
    } catch (err) { next(err); }
};

module.exports = { getAllBookings, createBooking, updateBooking, deleteBooking };