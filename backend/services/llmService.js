// services/llmService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Access your API key as an environment variable
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables.');
  process.exit(1); // Exit if API key is not found
}

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Function to summarize todos using Google Gemini
async function summarizeTodos(todos) {
  if (!todos || todos.length === 0) {
    return "No pending todos to summarize.";
  }

  const todoList = todos.map(todo => `- ${todo.title}`).join('\n');

  // **** IMPORTANT CHANGE HERE: Using 'gemini-1.5-flash' ****
  // This model is generally faster, more cost-effective, and may have different quota limits.
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Summarize the following list of pending to-do items into a concise and actionable summary. Focus on key tasks and eliminate redundancy. If there are no todos, indicate that.

  To-Do List:\n${todoList}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text(); // Get the text content from the Gemini response

    if (!text) {
        console.error('Gemini API returned no text in the response.');
        throw new Error('Failed to get summary from LLM: No text content in Gemini response.');
    }

    return text;
  } catch (error) {
    console.error('Raw error from Gemini API request:', error);
    console.error('Error summarizing todos with Google Gemini:', error.message);
    throw new Error('Failed to get summary from LLM: An error occurred with the Gemini API.');
  }
}

module.exports = { summarizeTodos };