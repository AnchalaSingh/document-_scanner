const express = require("express");
const router = express.Router();
const db = require("./server");

// ✅ Scan a Document
router.post("/", (req, res) => {
    const { userId, documentName } = req.body;
    db.run("INSERT INTO scans (user_id, document_name) VALUES (?, ?)", [userId, documentName], function (err) {
        if (err) return res.status(500).json({ error: "Scan failed." });
        res.json({ success: true, scanId: this.lastID });
    });
});

// ✅ Get User Scan History
router.get("/:userId", (req, res) => {
    db.all("SELECT * FROM scans WHERE user_id = ?", [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: "Failed to fetch scans." });
        res.json({ scans: rows });
    });
});

module.exports = router;
