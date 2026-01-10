import express from "express";

const router = express.Router();

// Minimal placeholder route to satisfy import from index.js
router.get("/", (req, res) => {
  res.send("Welcome — web routes placeholder. Restore this file with frontend routes if needed.");
});

export default router;
