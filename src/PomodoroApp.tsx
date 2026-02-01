import { useState, useEffect, useRef } from 'react';

type SessionType = 'work' | 'break' | 'longBreak';

const DURATIONS: Record<SessionType, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

export function PomodoroApp() {
  const [mode, setMode] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setSessionsCompleted(s => s + 1);
          const nextMode = mode === 'work' 
            ? (sessionsCompleted % 4 === 0 ? 'longBreak' : 'break')
            : 'work';
          setMode(nextMode);
          setIsRunning(false);
          return DURATIONS[nextMode];
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, sessionsCompleted]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const modeLabel: Record<SessionType, string> = {
    work: '工作時間',
    break: '短休息',
    longBreak: '長休息'
  };

  const modeColor: Record<SessionType, string> = {
    work: '#ef4444',
    break: '#22c55e',
    longBreak: '#3b82f6'
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            番茄時鐘
          </h1>
          <p className="text-[var(--color-text-muted)]">Pomodoro Timer</p>
        </header>

        <main className="space-y-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-lg font-semibold mb-4 px-4 py-2 rounded-full text-white" style={{ backgroundColor: modeColor[mode] }}>
              {modeLabel[mode]}
            </div>

            <div className="text-6xl font-bold text-[var(--color-primary)] mb-8 font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <p className="text-[var(--color-text-muted)] text-sm">
              {isRunning ? '進行中...' : '已暫停'}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-200 active:scale-95"
              >
                {isRunning ? '暫停' : '開始'}
              </button>
              <button
                onClick={() => {
                  setTimeLeft(DURATIONS[mode]);
                  setIsRunning(false);
                }}
                className="px-8 py-3 rounded-xl bg-[var(--color-surface-hover)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-border)] transition-all duration-200 active:scale-95"
              >
                重置
              </button>
            </div>

            <div className="flex gap-2 justify-center">
              {(['work', 'break', 'longBreak'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setMode(type);
                    setTimeLeft(DURATIONS[type]);
                    setIsRunning(false);
                  }}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    mode === type
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50'
                  }`}
                >
                  {type === 'work' && '工作'}
                  {type === 'break' && '短休'}
                  {type === 'longBreak' && '長休'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">{sessionsCompleted}</div>
              <p className="text-sm text-[var(--color-text-muted)]">已完成</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-success)] mb-2">
                {Math.floor(sessionsCompleted * 25 / 60)}h {(sessionsCompleted * 25) % 60}m
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">專注時間</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-[var(--color-text)] mb-2">-</div>
              <p className="text-sm text-[var(--color-text-muted)]">最後一次</p>
            </div>
          </div>
        </main>

        <footer className="mt-12 text-center text-sm text-[var(--color-text-muted)] opacity-50">
          <p>每 4 個工作週期後自動切換長休息</p>
        </footer>
      </div>
    </div>
  );
}
