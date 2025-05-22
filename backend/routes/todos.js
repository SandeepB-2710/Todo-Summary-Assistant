// backend/routes/todos.js

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); // Your Supabase client setup
const fetch = require('node-fetch'); // Import node-fetch for making HTTP requests (e.g., to Slack)

// GET /todos - Fetch all todos
router.get('/', async (req, res) => {
  try {
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false }); // Order by creation date

    if (error) throw error;
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /todos - Add a new todo
router.post('/', async (req, res) => {
  const { title, priority } = req.body; // Destructure title AND priority from the request body
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    // Insert new todo, including priority. If priority is not provided, Supabase's default will be used.
    const { data: newTodo, error } = await supabase
      .from('todos')
      .insert({ title, is_completed: false, priority: priority || 'Medium' }) // Use provided priority or default to 'Medium'
      .select();

    if (error) throw error;
    res.status(201).json(newTodo[0]);
  } catch (error) {
    console.error('Error adding todo:', error.message);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// DELETE /todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send(); // No content to send back on successful deletion
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// PATCH /todos/:id - Update a todo
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, is_completed, priority } = req.body; // Destructure title, is_completed, AND priority

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (is_completed !== undefined) updates.is_completed = is_completed;
  if (priority !== undefined) updates.priority = priority; // Add priority to the updates object

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No update fields provided' });
  }

  try {
    const { data: updatedTodo, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!updatedTodo || updatedTodo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(updatedTodo[0]);
  } catch (error) {
    console.error('Error updating todo:', error.message);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// POST /summarize - Summarize todos using LLM and send to Slack
router.post('/summarize', async (req, res) => {
  try {
    // 1. Fetch pending todos from Supabase
    const { data: pendingTodos, error: fetchError } = await supabase
      .from('todos')
      .select('title')
      .eq('is_completed', false)
      .order('created_at', { ascending: true }); // Order for consistent summary input

    if (fetchError) throw fetchError;

    if (pendingTodos.length === 0) {
      // If no pending tasks, send a success message indicating nothing to summarize
      return res.status(200).json({ message: 'No pending tasks to summarize.', summary: 'No pending tasks to summarize.' });
    }

    // Format tasks for the LLM prompt
    const taskList = pendingTodos.map(todo => `- ${todo.title}`).join('\n');
    // --- MODIFIED PROMPT LINE ---
    const prompt = `Check out these Pending's, and complete! Here are your pending to-do items:\n\n${taskList}\n\nPlease summarize them concisely and professionally, suitable for a team update or personal reminder.`;
    // ----------------------------

    // 2. Get summary from Gemini LLM
    // Access the Gemini model from app.locals, which was set up in index.js
    const model = req.app.locals.geminiModel;
    if (!model) {
      throw new Error('Gemini model not initialized on server. Check backend/index.js.');
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();

    if (!summary) {
        throw new Error('Failed to get a summary from the LLM.');
    }

    // 3. Send summary to Slack
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      throw new Error('Slack webhook URL not configured in environment variables. Check backend/.env');
    }

    const slackMessage = {
      text: `*Daily Todo Summary:*\n\n${summary}`,
      blocks: [ // Using blocks for richer Slack message formatting
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Daily Todo Summary:*\n\n${summary}`
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `_Generated by Todo Summary Assistant on ${new Date().toLocaleString()}_`
            }
          ]
        }
      ]
    };

    const slackResponse = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    });

    if (!slackResponse.ok) {
      const slackErrorText = await slackResponse.text(); // Get detailed error from Slack
      throw new Error(`Failed to send message to Slack: ${slackResponse.status} - ${slackErrorText}`);
    }

    res.status(200).json({ message: 'Summary sent to Slack successfully!', summary: summary });

  } catch (error) {
    console.error('Error summarizing and sending to Slack:', error.message);
    res.status(500).json({ error: error.message || 'Failed to summarize and send to Slack.' });
  }
});

module.exports = router;