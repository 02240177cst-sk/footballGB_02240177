const Database = require('better-sqlite3');
require('dotenv').config();

// Connect to or initialize the SQLite database file tracking ground reservations
const db = new Database(process.env.DB_FILE || './src/models/ground_booking.db');

// Enable foreign key constraints in SQLite (critical for relational structure)
db.exec("PRAGMA foreign_keys = ON;");

// Initialize both resource tables with structured types and relationships
db.exec(`
  CREATE TABLE IF NOT EXISTS slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    display_name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    contact TEXT NOT NULL,
    date TEXT NOT NULL,
    slot_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (slot_id) REFERENCES slots(id) ON DELETE CASCADE
  );
`);

// Automatically pre-populate default operational CST field schedules if empty
const count = db.prepare("SELECT COUNT(*) as total FROM slots").get();
if (count.total === 0) {
    const insertSlot = db.prepare("INSERT INTO slots (display_name) VALUES (?)");
    insertSlot.run("Early Morning (06:00 - 08:00)");
    insertSlot.run("Evening Session 1 (16:00 - 18:00)");
    insertSlot.run("Evening Session 2 (18:00 - 20:00)");
    console.log("Database seeded with default scheduling slots.");
}

console.log('SQLite database connected, constraints applied, and tables verified.');
module.exports = db;