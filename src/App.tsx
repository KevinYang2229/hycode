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
  const progress = ((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100;

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

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return 'from-blue-500 via-indigo-500 to-purple-500';
      case 'break':
        return 'from-emerald-500 via-teal-500 to-cyan-500';
      case 'longBreak':
        return 'from-amber-500 via-orange-500 to-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white overflow-hidden">
      {/* 背景動畫元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* 主容器 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* 標題 */}
          <div className="text-center mb-12 space-y-3">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pomodoro
              </span>
            </h1>
            <p className="text-slate-400 text-lg font-light">專注與休息的完美平衡</p>
          </div>

          {/* 主卡片 - 玻璃態設計 */}
          <div className="space-y-8">
            {/* 計時器區域 */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* 模式徽章 */}
              <div className={`inline-block w-full mb-6 bg-gradient-to-r ${getModeColor()} rounded-2xl py-3 px-6 text-center font-semibold text-white shadow-lg`}>
                {MODE_LABELS[mode]}
              </div>

              {/* 圓形進度條 + 時間顯示 */}
              <div className="relative flex items-center justify-center mb-8">
                <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 200 200">
                  {/* 背景圓 */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  {/* 進度圓 */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* 中心時間 */}
                <div className="absolute text-center">
                  <div className="text-7xl font-bold font-mono text-white tracking-wider">
                    {String(minutes).padStart(2, '0')}
                  </div>
                  <div className="text-5xl font-mono text-white/50">
                    {String(seconds).padStart(2, '0')}
                  </div>
                  <p className="text-sm text-slate-400 mt-4 font-light">
                    {isRunning ? '進行中' : '已暫停'}
                  </p>
                </div>
              </div>
            </div>

            {/* 控制按鈕 */}
            <div className="space-y-4">
              {/* 主按鈕 */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleToggleTimer}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 active:scale-95 transform"
                >
                  {isRunning ? '⏸ 暫停' : '▶ 開始'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-8 py-4 backdrop-blur-xl bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 active:scale-95"
                >
                  ↻ 重置
                </button>
              </div>

              {/* 模式切換 */}
              <div className="flex gap-3 justify-center">
                {(['work', 'break', 'longBreak'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => handleModeSwitch(m)}
                    disabled={isRunning}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      mode === m
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/50'
                        : 'backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50'
                    }`}
                  >
                    {m === 'work' && '工作'}
                    {m === 'break' && '短休'}
                    {m === 'longBreak' && '長休'}
                  </button>
                ))}
              </div>
            </div>

            {/* 統計面板 */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">統計資料</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-slate-400 text-sm font-light">已完成</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">{sessionsCompleted}</p>
                </div>
                <div className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-slate-400 text-sm font-light">總專注時間</p>
                  <p className="text-3xl font-bold text-purple-400 mt-1">
                    {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
                  </p>
                </div>
              </div>
            </div>

            {/* 頁腳 */}
            <p className="text-center text-xs text-slate-500 font-light">
              每 4 個工作週期後自動切換長休息
            </p>
          </div>
        </div>
      </div>

      {/* CSS 動畫 */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
