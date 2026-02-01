import { usePomodoro } from './hooks/usePomodoro';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { StatsPanel } from './components/StatsPanel';

export function PomodoroApp() {
  const { session, stats, toggleTimer, resetSession, switchSession } =
    usePomodoro();

  return (
    <div className="min-h-screen py-8 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            番茄時鐘
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Pomodoro Timer - 專注工作，高效生活
          </p>
        </header>

        <main className="space-y-8">
          <TimerDisplay session={session} />
          <TimerControls
            session={session}
            onToggle={toggleTimer}
            onReset={resetSession}
            onSwitch={switchSession}
          />
          <StatsPanel stats={stats} />
        </main>

        <footer className="mt-12 text-center text-sm text-[var(--color-text-muted)] opacity-50">
          <p>每 4 個工作週期後自動切換長休息</p>
        </footer>
      </div>
    </div>
  );
}
