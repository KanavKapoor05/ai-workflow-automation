const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
