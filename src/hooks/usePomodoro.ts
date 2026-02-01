import { useState, useEffect, useRef } from 'react';
import type { PomodoroSession, PomodoroStats, SessionType } from '../types/pomodoro';

const DURATIONS = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

const STORAGE_KEY = 'pomodoro_stats';

export function usePomodoro() {
  const [session, setSession] = useState<PomodoroSession>({
    id: crypto.randomUUID(),
    type: 'work',
    duration: DURATIONS.work,
    isRunning: false,
    timeRemaining: DURATIONS.work,
    isCompleted: false,
  });

  const [stats, setStats] = useState<PomodoroStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : { sessionsCompleted: 0, totalFocusTime: 0, lastSession: null };
  });

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!session.isRunning) return;

    intervalRef.current = setInterval(() => {
      setSession(prev => {
        if (prev.timeRemaining <= 1) {
          // Session completed
          const newStats = {
            sessionsCompleted: stats.sessionsCompleted + 1,
            totalFocusTime:
              stats.totalFocusTime +
              (prev.type === 'work' ? prev.duration : 0),
            lastSession: Date.now(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
          setStats(newStats);

          // Play notification
          playNotification();

          // Auto-switch to next session
          const nextType = getNextSessionType(prev.type);
          return {
            id: crypto.randomUUID(),
            type: nextType,
            duration: DURATIONS[nextType],
            isRunning: false,
            timeRemaining: DURATIONS[nextType],
            isCompleted: true,
          };
        }

        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session.isRunning, stats]);

  const playNotification = () => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const getNextSessionType = (current: SessionType): SessionType => {
    if (current === 'work') {
      return stats.sessionsCompleted % 4 === 0 ? 'longBreak' : 'break';
    }
    return 'work';
  };

  const toggleTimer = () => {
    setSession(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSession({
      id: crypto.randomUUID(),
      type: 'work',
      duration: DURATIONS.work,
      isRunning: false,
      timeRemaining: DURATIONS.work,
      isCompleted: false,
    });
  };

  const switchSession = (type: SessionType) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSession({
      id: crypto.randomUUID(),
      type,
      duration: DURATIONS[type],
      isRunning: false,
      timeRemaining: DURATIONS[type],
      isCompleted: false,
    });
  };

  return {
    session,
    stats,
    toggleTimer,
    resetSession,
    switchSession,
  };
}
