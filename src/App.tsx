import { useState, useEffect, useRef } from 'react';

type SessionType = 'work' | 'break' | 'longBreak';

const DURATIONS: Record<SessionType, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

const MODE_LABELS: Record<SessionType, string> = {
  work: '工作時間',
  break: '短休息',
  longBreak: '長休息',
};

const MODE_COLORS: Record<SessionType, string> = {
  work: 'from-red-500 to-red-600',
  break: 'from-green-500 to-green-600',
  longBreak: 'from-blue-500 to-blue-600',
};

export default function App() {
  const [mode, setMode] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 讀取本地存儲
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro_stats');
    if (saved) {
      setSessionsCompleted(JSON.parse(saved).sessionsCompleted || 0);
    }
  }, []);

  // 計時器邏輯
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // 完成一個週期
          setSessionsCompleted(s => {
            const newCount = s + 1;
            localStorage.setItem('pomodoro_stats', JSON.stringify({ sessionsCompleted: newCount }));
            return newCount;
          });

          // 自動切換模式
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

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-3">
            番茄時鐘
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg">Pomodoro Timer</p>
        </div>

        {/* Mode Badge */}
        <div className={`bg-gradient-to-r ${MODE_COLORS[mode]} rounded-full py-3 px-6 text-center font-semibold text-white shadow-lg`}>
          {MODE_LABELS[mode]}
        </div>

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="text-8xl font-bold text-[var(--color-primary)] font-mono tracking-wider">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <p className="text-[var(--color-text-muted)] text-lg">
            {isRunning ? '進行中...' : '已暫停'}
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Main Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleToggleTimer}
              className="px-8 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 active:scale-95"
            >
              {isRunning ? '暫停' : '開始'}
            </button>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-[var(--color-surface)] text-[var(--color-text)] font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200 active:scale-95"
            >
              重置
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2 justify-center">
            {(['work', 'break', 'longBreak'] as const).map(m => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 ${
                  mode === m
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {m === 'work' && '工作'}
                {m === 'break' && '短休'}
                {m === 'longBreak' && '長休'}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-[var(--color-surface)] rounded-xl p-6 space-y-3 border border-slate-700">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">統計</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[var(--color-text-muted)] text-sm">已完成</p>
              <p className="text-3xl font-bold text-[var(--color-primary)]">{sessionsCompleted}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)] text-sm">總專注時間</p>
              <p className="text-3xl font-bold text-[var(--color-success)]">
                {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--color-text-muted)] opacity-60">
          每 4 個工作週期後自動切換長休息
        </p>
      </div>
    </div>
  );
}
