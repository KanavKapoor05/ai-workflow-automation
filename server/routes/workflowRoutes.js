const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const requireAuth = require("../middleware/auth"); 
const Chat = require("../models/Chat"); 

// 🔐 Protected Route
router.post("/workflow", requireAuth, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const aiResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      max_tokens: 256,
    });

    const responseText = aiResponse.data.choices[0].text.trim();

    // ✅ Save to Chat collection with user
    const chat = new Chat({
      user: req.user._id,
      prompt,
      response: responseText,
    });
    await chat.save();

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error generating AI response:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
