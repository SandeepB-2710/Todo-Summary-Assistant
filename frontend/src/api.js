// frontend/src/api.js

const API_BASE_URL = 'http://localhost:5000/todos'; // Note: /todos is the base path for your backend routes

// Fetch all todos
export const getTodos = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch todos');
  }
  return response.json();
};

// Add a new todo (now includes priority)
export const addTodo = async (title, priority) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, priority }), // Send priority with the title
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add todo');
  }
  return response.json();
};

// Delete a todo
export const deleteTodo = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete todo');
  }
  // No content expected for 204 No Content
};

// Update a todo (e.g., toggle complete, update title, or update priority)
export const updateTodo = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update todo');
  }
  return response.json();
};


// Summarize and send to Slack
export const summarizeAndSend = async () => {
  // IMPORTANT: The backend route is POST /todos/summarize
  // So the fetch URL should be API_BASE_URL + '/summarize'
  const response = await fetch(`${API_BASE_URL}/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // No body needed for this request as backend fetches todos itself
  });

  // Check if the response is successful (status 2xx)
  if (!response.ok) {
    const errorData = await response.json(); // Attempt to parse JSON error from backend
    throw new Error(errorData.error || 'Failed to summarize and send to Slack');
  }

  // Parse the JSON response from the backend
  return response.json();
};