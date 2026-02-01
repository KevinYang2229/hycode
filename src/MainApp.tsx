import { useState } from 'react';
import App from './App';
import { PomodoroApp } from './PomodoroApp';

type PageType = 'todo' | 'pomodoro';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<PageType>('todo');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9' }}>
      {/* Navigation Bar */}
      <nav style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid #334155',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(4px)',
        padding: '16px'
      }}>
        <div style={{ 
          maxWidth: '64rem',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}>
          <h1 style={{ 
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#6366f1',
            margin: 0
          }}>
            Hycode
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage('todo')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: currentPage === 'todo' ? '#6366f1' : 'transparent',
                color: currentPage === 'todo' ? 'white' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}
            >
              Todo
            </button>
            <button
              onClick={() => setCurrentPage('pomodoro')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: currentPage === 'pomodoro' ? '#6366f1' : 'transparent',
                color: currentPage === 'pomodoro' ? 'white' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}
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