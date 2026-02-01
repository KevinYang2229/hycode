import type { PomodoroSession, SessionType } from '../types/pomodoro';

interface TimerControlsProps {
  session: PomodoroSession;
  onToggle: () => void;
  onReset: () => void;
  onSwitch: (type: SessionType) => void;
}

export function TimerControls({
  session,
  onToggle,
  onReset,
  onSwitch,
}: TimerControlsProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-3 justify-center">
        <button
          onClick={onToggle}
          className="px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] transition-all duration-200 active:scale-95 min-w-32"
        >
          {session.isRunning ? '暫停' : '開始'}
        </button>
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-xl bg-[var(--color-surface-hover)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] transition-all duration-200 active:scale-95"
        >
          重置
        </button>
      </div>

      <div className="flex gap-2 justify-center">
        {(['work', 'break', 'longBreak'] as const).map(type => (
          <button
            key={type}
            onClick={() => onSwitch(type)}
            disabled={session.isRunning}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              session.type === type
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
  );
}
