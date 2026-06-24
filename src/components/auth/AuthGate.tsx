import { useState } from 'react';
import { Eye } from 'lucide-react';

interface AuthGateProps {
  onLogin: (pin: string) => boolean;
  onGuest: () => void;
}

export function AuthGate({ onLogin, onGuest }: AuthGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(pin)) {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="h-full flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-[320px] px-6">
        <div className="text-center mb-10">
          <div className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Productiv
          </div>
          <div className="text-[13px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Enter your PIN to continue
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            placeholder="••••••••"
            className="w-full h-10 px-3 rounded-lg text-[13px] text-center tracking-[0.25em] outline-none transition-colors"
            style={{
              background: 'var(--color-bg-tertiary)',
              border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
              color: 'var(--color-text-primary)',
            }}
            onFocus={(e) => { if (!error) e.target.style.borderColor = 'var(--color-accent)'; }}
            onBlur={(e) => { if (!error) e.target.style.borderColor = 'var(--color-border)'; }}
            autoFocus
          />
          {error && (
            <p className="text-[12px] text-center" style={{ color: 'var(--color-danger)' }}>Wrong PIN</p>
          )}
          <button
            type="submit"
            className="w-full h-10 rounded-lg text-[13px] font-medium text-white transition-colors"
            style={{ background: 'var(--color-accent)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-accent)'}
          >
            Continue
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={onGuest}
            className="w-full h-10 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 transition-colors"
            style={{
              background: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
          >
            <Eye className="w-[14px] h-[14px]" />
            Guest access
          </button>
        </div>
      </div>
    </div>
  );
}
