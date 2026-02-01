import { useState, useEffect, useRef } from 'react';

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const getModeConfig = () => {
    switch (mode) {
      case 'work':
        return {
          label: '工作時間',
          bgColor: 'bg-slate-950',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-400',
          accentColor: 'bg-blue-500 hover:bg-blue-600',
          badgeColor: 'bg-blue-500/20 text-blue-300'
        };
      case 'break':
        return {
          label: '短休息',
          bgColor: 'bg-slate-950',
          borderColor: 'border-emerald-500/30',
          textColor: 'text-emerald-400',
          accentColor: 'bg-emerald-500 hover:bg-emerald-600',
          badgeColor: 'bg-emerald-500/20 text-emerald-300'
        };
      case 'longBreak':
        return {
          label: '長休息',
          bgColor: 'bg-slate-950',
          borderColor: 'border-amber-500/30',
          textColor: 'text-amber-400',
          accentColor: 'bg-amber-500 hover:bg-amber-600',
          badgeColor: 'bg-amber-500/20 text-amber-300'
        };
    }
  };

  const config = getModeConfig();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* 頂部文字 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight">Pomodoro</h1>
          <p className="text-slate-400 text-base">專注每一刻</p>
        </div>

        {/* 主卡片 */}
        <div className={`${config.bgColor} rounded-2xl border ${config.borderColor} p-12 space-y-8 shadow-2xl`}>
          {/* 狀態徽章 */}
          <div className={`${config.badgeColor} inline-block px-4 py-2 rounded-full text-sm font-medium`}>
            {config.label}
          </div>

          {/* 時間顯示 */}
          <div className="text-center space-y-4">
            <div className={`text-8xl md:text-9xl font-mono font-bold ${config.textColor} tracking-tighter`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <p className="text-slate-400 text-lg">
              {isRunning ? '進行中...' : '已暫停'}
            </p>
          </div>

          {/* 主按鈕 */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 ${config.accentColor} text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 active:scale-95`}
            >
              {isRunning ? '暫停' : '開始'}
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 active:scale-95 border border-slate-700"
            >
              重置
            </button>
          </div>

          {/* 模式按鈕 */}
          <div className="flex gap-2">
            {(['work', 'break', 'longBreak'] as const).map(m => {
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => handleModeSwitch(m)}
                  disabled={isRunning}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 ${
                    isActive
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 border border-slate-700'
                  }`}
                >
                  {m === 'work' && '工作 (25m)'}
                  {m === 'break' && '短休 (5m)'}
                  {m === 'longBreak' && '長休 (15m)'}
                </button>
              );
            })}
          </div>

          {/* 統計 */}
          <div className="border-t border-slate-700 pt-8 grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-2">已完成番茄</p>
              <p className={`text-4xl font-bold ${config.textColor}`}>{sessionsCompleted}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">總專注時間</p>
              <p className="text-4xl font-bold text-purple-400">
                {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
              </p>
            </div>
          </div>
        </div>

        {/* 提示文字 */}
        <p className="text-center text-slate-500 text-xs mt-8">
          4 個工作週期後自動切換長休息
        </p>
      </div>
    </div>
  );
}
