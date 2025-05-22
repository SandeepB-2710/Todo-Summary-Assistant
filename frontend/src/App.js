// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { getTodos, addTodo, deleteTodo, summarizeAndSend, updateTodo } from './api';
import './App.css'; // Your main CSS file

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  // --- NEW STATE VARIABLES FOR POPUP ---
  const [summaryPopupVisible, setSummaryPopupVisible] = useState(false);
  const [summaryMessage, setSummaryMessage] = useState('');
  // ------------------------------------

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedTodos = await getTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      setMessage('Failed to load todos.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Handle adding a new todo (now accepts priority)
  const handleAddTodo = async (title, priority) => {
    try {
      const newTodo = await addTodo(title, priority); // Pass priority to API
      setTodos((prevTodos) => [newTodo, ...prevTodos]);
      setMessage('Todo added successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Failed to add todo:', error);
      setMessage('Failed to add todo.');
      setMessageType('error');
    }
  };

  // Handle deleting a todo
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setMessage('Todo deleted successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      setMessage('Failed to delete todo.');
      setMessageType('error');
    }
  };

  // Handle toggling todo completion status
  const handleToggleComplete = async (id, is_completed) => {
    try {
        await updateTodo(id, { is_completed });
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, is_completed: is_completed } : todo
            )
        );
        setMessage('Todo updated successfully!');
        setMessageType('success');
    } catch (error) {
        console.error('Failed to update todo completion:', error);
        setMessage('Failed to update todo completion.');
        setMessageType('error');
    }
  };

  // Handle updating todo title and/or priority
  const handleUpdateTodo = async (id, updates) => {
    try {
        const updatedItem = await updateTodo(id, updates);
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, ...updatedItem } : todo
            )
        );
        setMessage('Todo updated successfully!');
        setMessageType('success');
    } catch (error) {
        console.error('Failed to update todo:', error);
        setMessage('Failed to update todo.');
        setMessageType('error');
    }
  };


  // Handle summarizing and sending to Slack
  const handleSummarize = async () => {
    setLoading(true);
    setMessage(''); // Clear previous messages
    setMessageType('');
    setSummaryPopupVisible(false); // Ensure popup is hidden initially on new attempt
    try {
      const response = await summarizeAndSend(); // Get response from backend
      if (response.message) {
        setMessage(response.message); // Set message from backend (e.g., "Summary sent!")
        setMessageType('success');
        // --- NEW POPUP LOGIC ---
        if (response.summary) { // If a summary is returned by the backend
          setSummaryMessage(response.summary); // Store the actual summary text
          setSummaryPopupVisible(true);        // Show the popup
        }
        // -----------------------
      } else {
        setMessage('Failed to summarize and send to Slack.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Failed to summarize and send to Slack:', error);
      setMessage(error.message || 'Failed to summarize and send to Slack.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Clear main message after a few seconds
  useEffect(() => {
    if (message && messageType !== 'error') { // Only clear success/info messages automatically
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000); // Clear message after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount or message change
    }
  }, [message, messageType]);


  // Filter and sort pending todos by priority for the right panel
  const pendingTodosByPriority = {
    'High': [],
    'Medium': [],
    'Low': []
  };

  if (todos && todos.length > 0) {
      todos.forEach(todo => {
        if (!todo.is_completed) {
          const priorityKey = todo.priority || 'Medium'; // Default to Medium if priority is null/undefined
          if (pendingTodosByPriority[priorityKey]) {
            pendingTodosByPriority[priorityKey].push(todo);
          } else {
            // If an unknown priority somehow exists, default it to Medium
            pendingTodosByPriority['Medium'].push(todo);
          }
        }
      });
  }


  return (
    <div className="App-container"> {/* Main container for the two columns */}

      {/* Left Column: Main Todo Management */}
      <div className="App-column left-panel">
        <h1>Todo Summary Assistant</h1>

        <TodoForm onAddTodo={handleAddTodo} />

        <button
          onClick={handleSummarize}
          disabled={loading}
          style={{
            padding: '12px 25px',
            backgroundColor: '#6495ed',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '25px',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Summarizing...' : 'Summarize & Send to Slack'}
        </button>

        {message && (
          <div className={`message-box ${messageType}`}>
            {message}
          </div>
        )}

        {loading && !message && <p>Loading todos...</p>}
        {!loading && todos.length === 0 && <p>No todos yet! Add some above.</p>}

        <TodoList
          todos={todos}
          onDeleteTodo={handleDeleteTodo}
          onToggleComplete={handleToggleComplete}
          onUpdateTodo={handleUpdateTodo}
        />
      </div>

      {/* Right Column: Pending Tasks by Priority */}
      <div className="App-column right-panel">
        <h2>Pending Tasks by Priority</h2>

        <div className="priority-list">
          <h3>High Priority</h3>
          {pendingTodosByPriority['High'].length > 0 ? (
            <ul>
              {pendingTodosByPriority['High'].map(todo => (
                <li key={todo.id} className={todo.is_completed ? 'completed' : ''}>
                  <span>{todo.title}</span>
                  <span className="priority-high">{todo.priority}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No high priority tasks.</p>
          )}

          <h3>Medium Priority</h3>
          {pendingTodosByPriority['Medium'].length > 0 ? (
            <ul>
              {pendingTodosByPriority['Medium'].map(todo => (
                <li key={todo.id} className={todo.is_completed ? 'completed' : ''}>
                  <span>{todo.title}</span>
                  <span className="priority-medium">{todo.priority}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No medium priority tasks.</p>
          )}

          <h3>Low Priority</h3>
          {pendingTodosByPriority['Low'].length > 0 ? (
            <ul>
              {pendingTodosByPriority['Low'].map(todo => (
                <li key={todo.id} className={todo.is_completed ? 'completed' : ''}>
                  <span>{todo.title}</span>
                  <span className="priority-low">{todo.priority}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No low priority tasks.</p>
          )}
        </div>
      </div>

      {/* --- NEW JSX FOR THE POPUP DIALOGUE BOX --- */}
      {summaryPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Summary</h2>
            <p>{summaryMessage}</p>
            <button onClick={() => setSummaryPopupVisible(false)}>Close</button>
          </div>
        </div>
      )}
      {/* ------------------------------------------- */}

    </div> // Closing div for App-container
  );
}

export default App;