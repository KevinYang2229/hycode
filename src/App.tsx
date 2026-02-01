import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import type { FilterType } from './types/todo';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState<FilterType>('all');

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '36px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #818cf8, #c084fc, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Todo List
          </h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            管理你的待辦事項
          </p>
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TodoInput onAdd={addTodo} />

          {todos.length > 0 && (
            <TodoFilter
              filter={filter}
              onFilterChange={setFilter}
              totalCount={todos.length}
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={clearCompleted}
            />
          )}

          <TodoList
            todos={todos}
            filter={filter}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        </main>

        <footer style={{ marginTop: '48px', textAlign: 'center', fontSize: '14px', color: '#94a3b8', opacity: 0.5 }}>
          <p style={{ margin: 0 }}>簡潔現代的待辦事項管理應用</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
