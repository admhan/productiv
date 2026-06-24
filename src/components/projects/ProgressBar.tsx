interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`h-1 rounded-full overflow-hidden ${className}`} style={{ background: 'var(--color-bg-active)' }}>
      <div className="h-full rounded-full transition-all duration-300"
        style={{ width: `${clamped}%`, background: 'var(--color-accent)' }} />
    </div>
  );
}
