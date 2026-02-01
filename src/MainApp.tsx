import { useState } from 'react';
import App from './App';
import { PomodoroApp } from './PomodoroApp';

type PageType = 'todo' | 'pomodoro';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<PageType>('todo');

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--color-primary)]">
            Hycode
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage('todo')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 'todo'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => setCurrentPage('pomodoro')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 'pomodoro'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
              }`}
            >
              Pomodoro
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {currentPage === 'todo' && <App />}
        {currentPage === 'pomodoro' && <PomodoroApp />}
      </main>
    </div>
  );
}

export default MainApp;
