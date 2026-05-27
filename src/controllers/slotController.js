const db = require('../models/db');

// GET /api/slots
const getAllSlots = (req, res, next) => {
    try {
        const slots = db.prepare('SELECT * FROM slots').all();
        res.status(200).json({ success: true, count: slots.length, data: slots });
    } catch (err) { next(err); }
};

// POST /api/slots
const createSlot = (req, res, next) => {
    try {
        const { display_name } = req.body;
        if (!display_name) {
            return res.status(400).json({ success: false, message: 'Display name is required' });
        }
        const result = db.prepare('INSERT INTO slots (display_name) VALUES (?)').run(display_name);
        const newSlot = db.prepare('SELECT * FROM slots WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: newSlot });
    } catch (err) { next(err); }
};

// PUT /api/slots/:id
const updateSlot = (req, res, next) => {
    try {
        const { display_name } = req.body;
        if (!display_name) return res.status(400).json({ success: false, message: 'Display name required' });
        
        const info = db.prepare('UPDATE slots SET display_name = ? WHERE id = ?').run(display_name, req.params.id);
        if (info.changes === 0) return res.status(404).json({ success: false, message: 'Slot not found' });
        res.status(200).json({ success: true, message: 'Slot structure updated successfully' });
    } catch (err) { next(err); }
};

// DELETE /api/slots/:id
const deleteSlot = (req, res, next) => {
    try {
        const info = db.prepare('DELETE FROM slots WHERE id = ?').run(req.params.id);
        if (info.changes === 0) return res.status(404).json({ success: false, message: 'Slot not found' });
        res.status(200).json({ success: true, message: 'Slot removed cleanly' });
    } catch (err) { next(err); }
};

// Export functions to be consumed by the slots router
module.exports = { getAllSlots, createSlot, updateSlot, deleteSlot };