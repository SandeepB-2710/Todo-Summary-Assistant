const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js'); // Import Supabase client

// Import the service functions we will create next
const { summarizeTodos } = require('../services/llmService'); // Function to summarize with LLM
const sendToSlack = require('../services/slackService'); // Function to send to Slack

// Initialize Supabase client again (same as in todos.js)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

// POST /summarize - Endpoint to get a summary of todos and send to Slack
router.post('/', async (req, res) => {
  try {
    // 1. Fetch todos from the database
    // We only want to summarize pending todos, assuming 'completed' is false
    const { data: todos, error: fetchError } = await supabase
      .from('todos')
      .select('*') // Select all columns
      .eq('completed', false); // Filter for incomplete todos

    if (fetchError) {
      console.error('Error fetching todos for summary:', fetchError.message);
      return res.status(500).json({ error: fetchError.message });
    }

    // Handle case where there are no pending todos
    if (!todos || todos.length === 0) {
        return res.status(200).json({ message: 'No pending todos to summarize.' });
    }

    // 2. Summarize the fetched todos using the LLM service
    const summary = await summarizeTodos(todos);

    // 3. Send the summary to Slack using the Slack service
    await sendToSlack(summary);

    // 4. Send success response back to the client
    res.json({ message: 'Todos summarized and sent to Slack successfully!' });

  } catch (err) {
    console.error('Error in /summarize endpoint:', err);
    // Differentiate between known errors (e.g., from LLM/Slack service) and unexpected errors
    res.status(500).json({ error: err.message || 'An unexpected error occurred during summarization or Slack notification.' });
  }
});

module.exports = router; // Export the router