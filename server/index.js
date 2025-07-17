const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load .env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const workflowRoutes = require("./routes/workflowRoutes");
const chatRoutes = require("./routes/chatRoutes");

// ✅ Use routes
app.use("/api/auth", authRoutes);        
app.use("/api", workflowRoutes);        
app.use("/api/chat", chatRoutes);        

// Default Route
app.get("/", (req, res) => {
  res.send("🧠 AI Workflow Automation Server is running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
