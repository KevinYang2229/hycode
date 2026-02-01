import type { Todo, FilterType } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoList({ todos, filter, onToggle, onDelete, onEdit }: TodoListProps) {
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 16px',
        color: '#94a3b8'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}>📋</div>
        <p style={{ fontSize: '18px', margin: 0 }}>
          {filter === 'all' && '尚無待辦事項'}
          {filter === 'active' && '沒有進行中的項目'}
          {filter === 'completed' && '沒有已完成的項目'}
        </p>
        <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7, margin: '8px 0 0 0' }}>
          {filter === 'all' && '新增一個來開始吧'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
