import type { PomodoroStats } from '../types/pomodoro';

interface StatsPanelProps {
  stats: PomodoroStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const hours = Math.floor(stats.totalFocusTime / 3600);
  const minutes = Math.floor((stats.totalFocusTime % 3600) / 60);

  const getLastSessionTime = () => {
    if (!stats.lastSession) return '尚無記錄';
    const now = Date.now();
    const diff = now - stats.lastSession;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes} 分鐘前`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小時前`;

    const days = Math.floor(hours / 24);
    return `${days} 天前`;
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="text-center">
        <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">
          {stats.sessionsCompleted}
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">已完成</p>
      </div>

      <div className="text-center">
        <div className="text-3xl font-bold text-[var(--color-success)] mb-2">
          {hours}h {minutes}m
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">總專注時間</p>
      </div>

      <div className="text-center">
        <div className="text-lg font-semibold text-[var(--color-text)] mb-2">
          {getLastSessionTime()}
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">最後一次</p>
      </div>
    </div>
  );
}
