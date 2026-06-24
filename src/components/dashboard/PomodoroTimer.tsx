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
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">
        Pomodoro <span className={`text-xs font-normal ${isWork ? 'text-indigo-400' : 'text-green-400'}`}>({isWork ? 'Work' : 'Break'})</span>
      </h3>

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#27272a" strokeWidth="6" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={isWork ? '#6366f1' : '#22c55e'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-mono font-bold text-zinc-100">
              {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRunning(!running)}
            className="p-2.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-150"
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={reset}
            className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors duration-150"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
