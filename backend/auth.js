const express = require("express");
const router = express.Router();
const db = require("./server");

// ✅ Register a New User
router.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function (err) {
        if (err) {
            return res.status(500).json({ error: "User already exists." });
        }
        res.json({ success: true, userId: this.lastID });
    });
});

// ✅ User Login
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        res.json({ success: true, user });
    });
});

module.exports = router;
