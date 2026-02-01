import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { FilterType } from './types/todo';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState<FilterType>('all');

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen py-8 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Todo List
          </h1>
          <p className="text-[var(--color-text-muted)]">
            管理你的待辦事項
          </p>
        </header>

        <main className="space-y-6">
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

        <footer className="mt-12 text-center text-sm text-[var(--color-text-muted)] opacity-50">
          <p>雙擊項目可編輯</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
