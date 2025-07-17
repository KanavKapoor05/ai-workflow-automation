const express = require("express");
const router = express.Router();
const Chat = require("../models/chatModel");
const verifyToken = require("../middleware/auth");

// Save a chat (prompt and output)
router.post("/", verifyToken, async (req, res) => {
  const { prompt, output } = req.body;
  const userId = req.user.id;

  if (!prompt || !output) {
    return res.status(400).json({ message: "Prompt and output required" });
  }

  try {
    const chat = new Chat({ user: userId, prompt, output });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error("Error saving chat:", err);
    res.status(500).json({ message: "Server error while saving chat" });
  }
});

// Get all chats of logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ message: "Server error while fetching chats" });
  }
});

module.exports = router;
