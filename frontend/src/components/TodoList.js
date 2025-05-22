// frontend/src/components/TodoList.js
import React, { useState } from 'react';

function TodoList({ todos, onDeleteTodo, onToggleComplete, onUpdateTodo }) {
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingPriority, setEditingPriority] = useState(''); // New state for editing priority

  const handleEditClick = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setEditingPriority(todo.priority || 'Medium'); // Set current priority or default
  };

  const handleSaveEdit = async (todoId) => {
    if (editingTitle.trim()) {
      await onUpdateTodo(todoId, { title: editingTitle, priority: editingPriority }); // Pass updated priority
      setEditingId(null);
      setEditingTitle('');
      setEditingPriority('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
    setEditingPriority('');
  };

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 15px',
            border: '1px solid #ddd',
            marginBottom: '10px',
            backgroundColor: todo.is_completed ? '#f0f8f0' : '#fffacd',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'background-color 0.3s ease',
          }}
        >
          {editingId === todo.id ? (
            <>
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSaveEdit(todo.id);
                }}
                style={{
                  flexGrow: 1,
                  marginRight: '10px',
                  padding: '8px',
                  border: '1px solid #add8e6',
                  borderRadius: '4px',
                  fontSize: '0.95em',
                  outline: 'none',
                }}
              />
              <select
                value={editingPriority}
                onChange={(e) => setEditingPriority(e.target.value)}
                style={{
                  padding: '8px',
                  marginRight: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '0.95em',
                  outline: 'none',
                  backgroundColor: '#f8f8f8',
                }}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button
                onClick={() => handleSaveEdit(todo.id)}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '8px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#bd2130'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => onToggleComplete(todo.id, !todo.is_completed)}
                style={{ marginRight: '15px', transform: 'scale(1.2)' }}
              />
              <span
                style={{
                  flexGrow: 1,
                  textDecoration: todo.is_completed ? 'line-through' : 'none',
                  color: todo.is_completed ? '#777' : '#333',
                  fontSize: '1.05em',
                  textAlign: 'left',
                }}
              >
                {todo.title}
              </span>
              <span
                className={`priority-${todo.priority ? todo.priority.toLowerCase() : 'medium'}`}
                style={{
                    fontSize: '0.9em',
                    marginRight: '15px',
                    minWidth: '50px',
                    textAlign: 'right'
                }}
              >
                {todo.priority || 'Medium'}
              </span>
              <button
                onClick={() => handleEditClick(todo)}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#ffe4b5',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '8px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#ffd700'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffe4b5'}
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteTodo(todo.id)}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#f08080',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e06666'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f08080'}
              >
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TodoList;