import { useState, useEffect, useRef } from 'react';
import './index.css';

type SessionType = 'work' | 'break' | 'longBreak';

const DURATIONS: Record<SessionType, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

export default function App() {
  const [mode, setMode] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pomodoro_stats');
    if (saved) {
      setSessionsCompleted(JSON.parse(saved).sessionsCompleted || 0);
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setSessionsCompleted(s => {
            const newCount = s + 1;
            localStorage.setItem('pomodoro_stats', JSON.stringify({ sessionsCompleted: newCount }));
            return newCount;
          });

          if (mode === 'work') {
            const nextMode = sessionsCompleted % 4 === 3 ? 'longBreak' : 'break';
            setMode(nextMode);
            return DURATIONS[nextMode];
          } else {
            setMode('work');
            return DURATIONS.work;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, sessionsCompleted]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalFocusTime = sessionsCompleted * 25;

  const handleModeSwitch = (newMode: SessionType) => {
    if (isRunning) return;
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className="title">Pomodoro</h1>
        <p className="subtitle">專注每一刻</p>
      </div>

      {/* Main Card */}
      <div className="card">
        {/* Badge */}
        <div className={`badge ${mode}`}>
          {mode === 'work' && '工作時間'}
          {mode === 'break' && '短休息'}
          {mode === 'longBreak' && '長休息'}
        </div>

        {/* Timer Display */}
        <div className="timer-display">
          <div className="timer-time">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <p className="timer-status">
            {isRunning ? '進行中...' : '已暫停'}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="button-group">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="button primary"
          >
            {isRunning ? '暫停' : '開始'}
          </button>
          <button
            onClick={handleReset}
            className="button secondary"
          >
            重置
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="mode-buttons">
          {(['work', 'break', 'longBreak'] as const).map(m => (
            <button
              key={m}
              onClick={() => handleModeSwitch(m)}
              disabled={isRunning}
              className={`mode-button ${mode === m ? 'active' : ''}`}
            >
              {m === 'work' && '工作'}
              {m === 'break' && '短休'}
              {m === 'longBreak' && '長休'}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-item">
            <p className="stat-label">已完成</p>
            <p className="stat-value primary">{sessionsCompleted}</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">總專注時間</p>
            <p className="stat-value success">
              {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="footer">4 個工作週期後自動切換長休息</p>
    </div>
  );
}
