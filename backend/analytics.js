const express = require("express");
const router = express.Router();
const db = require("./server");

// ✅ Get All Credit Requests
router.get("/credit-requests", (req, res) => {
    db.all("SELECT * FROM credit_requests WHERE status = 'pending'", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Failed to fetch requests." });
        res.json({ requests: rows });
    });
});

// ✅ Approve Credit Request
router.post("/approve", (req, res) => {
    const { requestId, userId } = req.body;
    db.run("UPDATE users SET credits = credits + 10 WHERE id = ?", [userId], function (err) {
        if (err) return res.status(500).json({ error: "Approval failed." });
        db.run("UPDATE credit_requests SET status = 'approved' WHERE id = ?", [requestId]);
        res.json({ success: true });
    });
});

module.exports = router;
