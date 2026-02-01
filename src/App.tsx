import { useState, useEffect, useRef } from 'react';
import './index.css';

type SessionType = 'work' | 'break' | 'longBreak';

const DEFAULT_DURATIONS: Record<SessionType, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

export default function App() {
  const [mode, setMode] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [durations, setDurations] = useState<Record<SessionType, number>>(DEFAULT_DURATIONS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 初始化數據
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro_stats');
    if (saved) {
      const data = JSON.parse(saved);
      setSessionsCompleted(data.sessionsCompleted || 0);
    }

    const savedDurations = localStorage.getItem('pomodoro_durations');
    if (savedDurations) {
      setDurations(JSON.parse(savedDurations));
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
            return durations[nextMode];
          } else {
            setMode('work');
            return durations.work;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, sessionsCompleted, durations]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalFocusTime = sessionsCompleted * Math.floor(durations.work / 60);
  
  // 計算是否在最後1/3時間
  const totalTime = durations[mode];
  const isWarning = timeLeft <= totalTime / 3 && timeLeft > 0;

  const handleModeSwitch = (newMode: SessionType) => {
    if (isRunning) return;
    setMode(newMode);
    setTimeLeft(durations[newMode]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const handleDurationChange = (type: SessionType, value: number) => {
    const newDurations = { ...durations, [type]: value * 60 };
    setDurations(newDurations);
    localStorage.setItem('pomodoro_durations', JSON.stringify(newDurations));
    if (mode === type && !isRunning) {
      setTimeLeft(value * 60);
    }
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

  const getTimerStyle = () => {
    if (isWarning) {
      return 'text-red-500 animate-pulse';
    }
    return 'text-blue-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Pomodoro
          </h1>
          <p className="text-slate-400 text-sm sm:text-lg">專注每一刻</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-12 space-y-6 sm:space-y-8 shadow-2xl">
          {/* Badge */}
          <div className={`inline-block px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${getBadgeStyle()}`}>
            {mode === 'work' && '工作時間'}
            {mode === 'break' && '短休息'}
            {mode === 'longBreak' && '長休息'}
          </div>

          {/* Timer Display - 修復手機版破版 + 警示效果 */}
          <div className="text-center space-y-2 sm:space-y-4">
            <div className="flex items-baseline justify-center gap-1 sm:gap-2 min-h-24 sm:min-h-40">
              <div className={`text-6xl sm:text-9xl font-bold font-mono leading-none transition-colors duration-300 ${getTimerStyle()}`}>
                {String(minutes).padStart(2, '0')}
              </div>
              <div className={`text-3xl sm:text-6xl font-bold font-mono leading-none transition-colors duration-300 ${isWarning ? 'text-red-400' : 'text-slate-400'}`}>:</div>
              <div className={`text-6xl sm:text-9xl font-bold font-mono leading-none transition-colors duration-300 ${getTimerStyle()}`}>
                {String(seconds).padStart(2, '0')}
              </div>
            </div>
            <p className={`text-xs sm:text-lg h-6 transition-colors duration-300 ${isWarning ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
              {isWarning ? '⚠️ 即將結束！' : isRunning ? '進行中...' : '已暫停'}
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 bg-gradient-to-r ${getButtonStyle()} text-white font-semibold py-2 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 active:scale-95 text-sm sm:text-base`}
            >
              {isRunning ? '暫停' : '開始'}
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 active:scale-95 border border-slate-600 text-sm sm:text-base"
            >
              重置
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 sm:py-4 px-3 sm:px-4 rounded-lg transition-all duration-200 active:scale-95 border border-slate-600 text-sm sm:text-base"
              title="設定"
            >
              ⚙️
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2 text-xs sm:text-sm">
            {(['work', 'break', 'longBreak'] as const).map(m => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                disabled={isRunning}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all duration-200 ${
                  mode === m
                    ? 'bg-slate-600 text-white border border-slate-500'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-100 border border-slate-600 disabled:opacity-50'
                }`}
              >
                {m === 'work' && '工作'}
                {m === 'break' && '短休'}
                {m === 'longBreak' && '長休'}
              </button>
            ))}
          </div>

          {/* Settings Panel - 更亮的顏色 */}
          {showSettings && (
            <div className="border-t border-slate-600 pt-6 space-y-4 bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-sm sm:text-base font-semibold text-slate-200">時間設定（分鐘）</h3>
              <div className="space-y-4">
                {(['work', 'break', 'longBreak'] as const).map(m => (
                  <div key={m} className="flex items-center justify-between">
                    <label className="text-sm sm:text-base text-slate-100 font-medium">
                      {m === 'work' && '工作時間'}
                      {m === 'break' && '短休息'}
                      {m === 'longBreak' && '長休息'}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDurationChange(m, Math.max(1, durations[m] / 60 - 1))}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-2 rounded font-semibold text-sm sm:text-base transition-colors"
                      >
                        −
                      </button>
                      <span className="w-10 sm:w-12 text-center text-base sm:text-lg font-bold text-slate-100">
                        {durations[m] / 60}
                      </span>
                      <button
                        onClick={() => handleDurationChange(m, durations[m] / 60 + 1)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-2 rounded font-semibold text-sm sm:text-base transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="border-t border-slate-700 pt-4 sm:pt-8 grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm mb-1 sm:mb-2 uppercase tracking-widest text-slate-400">已完成</p>
              <p className="text-2xl sm:text-4xl font-bold text-blue-400">{sessionsCompleted}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm mb-1 sm:mb-2 uppercase tracking-widest text-slate-400">總專注時間</p>
              <p className="text-2xl sm:text-4xl font-bold text-emerald-400">
                {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6 sm:mt-8">
          4 個工作週期後自動切換長休息
        </p>
      </div>
    </div>
  );
}
