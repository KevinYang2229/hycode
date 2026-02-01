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

  const getBadgeStyle = () => {
    switch (mode) {
      case 'work':
        return 'bg-blue-500/20 text-blue-300';
      case 'break':
        return 'bg-emerald-500/20 text-emerald-300';
      case 'longBreak':
        return 'bg-amber-500/20 text-amber-300';
    }
  };

  const getButtonStyle = () => {
    switch (mode) {
      case 'work':
        return 'from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/50';
      case 'break':
        return 'from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50';
      case 'longBreak':
        return 'from-amber-500 to-amber-600 hover:shadow-lg hover:shadow-amber-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Pomodoro
          </h1>
          <p className="text-slate-400 text-lg">專注每一刻</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 space-y-8 shadow-2xl">
          {/* Badge */}
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getBadgeStyle()}`}>
            {mode === 'work' && '工作時間'}
            {mode === 'break' && '短休息'}
            {mode === 'longBreak' && '長休息'}
          </div>

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-9xl font-bold font-mono text-blue-400 tracking-tighter">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <p className="text-slate-400 text-lg">
              {isRunning ? '進行中...' : '已暫停'}
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 bg-gradient-to-r ${getButtonStyle()} text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 active:scale-95`}
            >
              {isRunning ? '暫停' : '開始'}
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 active:scale-95 border border-slate-600"
            >
              重置
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2">
            {(['work', 'break', 'longBreak'] as const).map(m => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                disabled={isRunning}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  mode === m
                    ? 'bg-slate-600 text-white border border-slate-500'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-100 border border-slate-600 disabled:opacity-50'
                }`}
              >
                {m === 'work' && '工作 (25m)'}
                {m === 'break' && '短休 (5m)'}
                {m === 'longBreak' && '長休 (15m)'}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="border-t border-slate-700 pt-8 grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest">已完成</p>
              <p className="text-4xl font-bold text-blue-400">{sessionsCompleted}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest">總專注時間</p>
              <p className="text-4xl font-bold text-emerald-400">
                {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          4 個工作週期後自動切換長休息
        </p>
      </div>
    </div>
  );
}
