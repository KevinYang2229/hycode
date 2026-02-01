import { useState, useRef, useEffect } from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    } else {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      opacity: todo.completed ? 0.6 : 1,
      transition: 'all 0.2s'
    }}>
      <button
        onClick={() => onToggle(todo.id)}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: todo.completed ? 'none' : '2px solid #94a3b8',
          backgroundColor: todo.completed ? '#22c55e' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.2s'
        }}
      >
        {todo.completed && (
          <span style={{ color: 'white', fontSize: '16px' }}>✓</span>
        )}
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: '#0f172a',
            border: '1px solid #6366f1',
            color: '#f1f5f9',
            fontSize: '16px',
            fontFamily: 'inherit'
          }}
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          style={{
            flex: 1,
            cursor: 'pointer',
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#94a3b8' : '#f1f5f9'
          }}
        >
          {todo.text}
        </span>
      )}

      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
        <button
          onClick={() => setIsEditing(true)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          title="編輯"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          title="刪除"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
