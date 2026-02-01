import { useState, type FormEvent } from 'react';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新增待辦..."
          autoFocus
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#1e293b',
            color: '#f1f5f9',
            fontSize: '16px',
            fontFamily: 'inherit'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#6366f1',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          新增
        </button>
      </div>
    </form>
  );
}
