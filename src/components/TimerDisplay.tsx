import { useEffect, useState } from 'react';
import type { PomodoroSession } from '../types/pomodoro';

interface TimerDisplayProps {
  session: PomodoroSession;
}

export function TimerDisplay({ session }: TimerDisplayProps) {
  const [displayTime, setDisplayTime] = useState('25:00');

  useEffect(() => {
    const minutes = Math.floor(session.timeRemaining / 60);
    const seconds = session.timeRemaining % 60;
    setDisplayTime(
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    );
  }, [session.timeRemaining]);

  const getSessionLabel = () => {
    switch (session.type) {
      case 'work':
        return '工作時間';
      case 'break':
        return '短休息';
      case 'longBreak':
        return '長休息';
    }
  };

  const getSessionColor = () => {
    switch (session.type) {
      case 'work':
        return 'from-red-500 to-red-600';
      case 'break':
        return 'from-green-500 to-green-600';
      case 'longBreak':
        return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`text-lg font-semibold mb-4 px-4 py-2 rounded-full bg-gradient-to-r ${getSessionColor()} text-white`}>
        {getSessionLabel()}
      </div>

      <div className="relative w-48 h-48 mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="var(--color-surface-hover)"
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={
              session.type === 'work'
                ? '#ef4444'
                : session.type === 'break'
                  ? '#22c55e'
                  : '#3b82f6'
            }
            strokeWidth="8"
            strokeDasharray={`${Math.PI * 180 * ((session.duration - session.timeRemaining) / session.duration)}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">
            {displayTime}
          </span>
        </div>
      </div>

      <p className="text-[var(--color-text-muted)] text-sm">
        {session.isRunning ? '進行中...' : '已暫停'}
      </p>
    </div>
  );
}
