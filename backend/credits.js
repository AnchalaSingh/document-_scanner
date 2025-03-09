const express = require("express");
const router = express.Router();
const db = require("./server");

// ✅ Check Available Credits
router.get("/:userId", (req, res) => {
    db.get("SELECT credits FROM users WHERE id = ?", [req.params.userId], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "User not found." });
        res.json({ credits: row.credits });
    });
});

// ✅ Request More Credits
router.post("/request", (req, res) => {
    const { userId } = req.body;
    db.run("INSERT INTO credit_requests (user_id) VALUES (?)", [userId], function (err) {
        if (err) return res.status(500).json({ error: "Request failed." });
        res.json({ success: true, requestId: this.lastID });
    });
});

module.exports = router;
