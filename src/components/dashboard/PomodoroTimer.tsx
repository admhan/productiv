import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function playBeep() {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.frequency.value = 880;
  oscillator.type = 'sine';
  gain.gain.value = 0.3;
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  oscillator.stop(ctx.currentTime + 0.8);
}

export function PomodoroTimer() {
  const [isWork, setIsWork] = useState(true);
  const [seconds, setSeconds] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = isWork ? WORK_SECONDS : BREAK_SECONDS;
  const progress = 1 - seconds / total;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const switchMode = useCallback(() => {
    playBeep();
    const nextIsWork = !isWork;
    setIsWork(nextIsWork);
    setSeconds(nextIsWork ? WORK_SECONDS : BREAK_SECONDS);
    setRunning(false);
  }, [isWork]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setRunning(false);
            setTimeout(switchMode, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, switchMode]);

  const reset = () => {
    setRunning(false);
    setSeconds(isWork ? WORK_SECONDS : BREAK_SECONDS);
  };

  return (
    <div className="rounded-lg p-5" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
      <h3 className="text-[13px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
        Pomodoro{' '}
        <span className="text-[12px] font-medium" style={{ color: isWork ? 'var(--color-accent)' : 'var(--color-success)' }}>
          ({isWork ? 'Work' : 'Break'})
        </span>
      </h3>

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--color-bg-active)" strokeWidth="6" />
            <circle
              cx="60" cy="60" r={radius} fill="none"
              stroke={isWork ? 'var(--color-accent)' : 'var(--color-success)'}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setRunning(!running)}
            className="p-3 rounded-full text-white transition-all active:scale-95"
            style={{ background: 'var(--color-accent)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-accent)'}>
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={reset}
            className="p-3 rounded-full transition-all"
            style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}>
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
