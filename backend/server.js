const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Initialize Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to SQLite Database
const dbPath = path.resolve(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Error opening database:", err.message);
    } else {
        console.log("✅ Connected to SQLite database.");
    }
});

// ✅ Ensure Required Tables Exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user',
        credits INTEGER DEFAULT 20
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        document_name TEXT,
        scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS credit_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        status TEXT DEFAULT 'pending',
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
});

// ✅ Load API Routes
app.use("/auth", require("./auth"));
app.use("/credits", require("./credits"));
app.use("/scan", require("./scan"));
app.use("/admin", require("./analytics"));

// API Route to Check if Server is Running
app.get("/", (req, res) => {
    res.send("✅ API is running.");
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = db;
