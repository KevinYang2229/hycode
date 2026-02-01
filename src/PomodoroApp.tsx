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

  const modeColor: Record<SessionType, string> = {
    work: '#ef4444',
    break: '#22c55e',
    longBreak: '#3b82f6'
  };

  const modeLabel: Record<SessionType, string> = {
    work: '工作時間',
    break: '短休息',
    longBreak: '長休息'
  };

  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '36px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #f87171, #fb923c, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            番茄時鐘
          </h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Pomodoro Timer</p>
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Timer Display */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              padding: '8px 16px',
              borderRadius: '20px',
              color: 'white',
              backgroundColor: modeColor[mode],
              display: 'inline-block'
            }}>
              {modeLabel[mode]}
            </div>

            <div style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#6366f1',
              marginBottom: '32px',
              fontFamily: 'monospace',
              letterSpacing: '4px'
            }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
              {isRunning ? '進行中...' : '已暫停'}
            </p>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setIsRunning(!isRunning)}
                style={{
                  padding: '12px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  ':active': { transform: 'scale(0.95)' }
                }}
              >
                {isRunning ? '暫停' : '開始'}
              </button>
              <button
                onClick={() => {
                  setTimeLeft(DURATIONS[mode]);
                  setIsRunning(false);
                }}
                style={{
                  padding: '12px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#334155',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                重置
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {(['work', 'break', 'longBreak'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setMode(type);
                    setTimeLeft(DURATIONS[type]);
                    setIsRunning(false);
                  }}
                  disabled={isRunning}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: mode === type ? '#6366f1' : '#1e293b',
                    color: mode === type ? 'white' : '#94a3b8',
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    opacity: isRunning && mode !== type ? 0.5 : 1,
                    fontSize: '14px'
                  }}
                >
                  {type === 'work' && '工作'}
                  {type === 'break' && '短休'}
                  {type === 'longBreak' && '長休'}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1', marginBottom: '8px' }}>
                {sessionsCompleted}
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>已完成</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e', marginBottom: '8px' }}>
                {Math.floor(sessionsCompleted * 25 / 60)}h {(sessionsCompleted * 25) % 60}m
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>專注時間</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>-</div>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>最後一次</p>
            </div>
          </div>
        </main>

        <footer style={{ marginTop: '48px', textAlign: 'center', fontSize: '14px', color: '#94a3b8', opacity: 0.5 }}>
          <p>每 4 個工作週期後自動切換長休息</p>
        </footer>
      </div>
    </div>
  );
}
