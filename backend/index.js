// backend/index.js

// 1. Load environment variables from .env file FIRST
require('dotenv').config();

// 2. Import necessary modules
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // For Gemini LLM integration

// 3. Initialize Express app
const app = express();

// 4. Apply middleware
app.use(cors()); // Enable CORS for all routes (important for frontend communication)
app.use(express.json()); // Enable parsing of JSON request bodies

// 5. Initialize Google Gemini API
// This should only happen once when the server starts
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    console.error("GEMINI_API_KEY is not set in .env file. LLM functionality will not work.");
    // Optionally, you might want to exit the process or handle this more gracefully
}
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Make the Gemini model available to all routes via req.app.locals
app.locals.geminiModel = model;

// 6. Import and use your API routes
// The todosRouter now includes all todo-related routes (GET, POST, DELETE, PATCH)
// AND the /summarize route, which is part of the /todos base path.
const todosRouter = require('./routes/todos'); // Assuming your todos.js exports these routes
app.use('/todos', todosRouter); // All requests to /todos and /todos/summarize will go here

// 7. Define a simple health check endpoint (optional, but good practice)
app.get('/', (req, res) => {
  res.send('Todo Summary Assistant Backend is running!');
});

// 8. Define the port for your server to listen on
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// 9. Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});