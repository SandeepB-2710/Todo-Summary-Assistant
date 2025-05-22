// frontend/src/components/TodoForm.js
import React, { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium'); // State for priority, default to Medium

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTodo(title, priority); // Pass priority to the parent component (App.js)
    setTitle(''); // Clear title input
    setPriority('Medium'); // Reset priority to default
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: '10px 15px',
          marginRight: '15px',
          width: 'calc(70% - 15px)', /* Adjust width to make space for select */
          maxWidth: '300px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '1em',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          marginBottom: '10px', /* Space for wrapping on small screens */
        }}
        onFocus={(e) => e.target.style.borderColor = '#add8e6'}
        onBlur={(e) => e.target.style.borderColor = '#ccc'}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{
          padding: '10px 15px',
          marginRight: '15px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '1em',
          outline: 'none',
          backgroundColor: '#f8f8f8',
          marginBottom: '10px', /* Space for wrapping on small screens */
        }}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: '#8fbc8f',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '10px', /* Space for wrapping on small screens */
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#6e8b6e'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#8fbc8f'}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;