export type SessionType = 'work' | 'break' | 'longBreak';

export interface PomodoroSession {
  id: string;
  type: SessionType;
  duration: number;
  isRunning: boolean;
  timeRemaining: number;
  isCompleted: boolean;
}

export interface PomodoroStats {
  sessionsCompleted: number;
  totalFocusTime: number;
  lastSession: number | null;
}
