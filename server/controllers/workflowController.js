const axios = require("axios");

const generateWorkflow = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model:  "openrouter/auto", // You can change model name
        messages: [{ role: "user", content: prompt }],
         max_tokens: 600,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000", // Change to your domain in production
          "Content-Type": "application/json"
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    res.status(200).json({ workflow: aiResponse });

  } catch (error) {
    console.error("❌ OpenRouter API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate workflow" });
  }
};

module.exports = { generateWorkflow };
