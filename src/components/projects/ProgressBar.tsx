interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`h-1.5 bg-[#eef0f6] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] rounded-full transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
