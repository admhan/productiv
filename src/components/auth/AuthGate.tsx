import { useState } from 'react';
import { Zap, Eye } from 'lucide-react';

interface AuthGateProps {
  onLogin: (pin: string) => boolean;
  onGuest: () => void;
}

export function AuthGate({ onLogin, onGuest }: AuthGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(pin);
    if (!success) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(108,92,231,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(0,206,201,0.12),transparent_50%)]" />

      <div className={`relative w-full max-w-sm p-8 ${shake ? 'animate-shake' : ''}`}>
        <div className="card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center mb-4 shadow-lg shadow-[#6c5ce7]/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1d2e]">Productiv</h1>
            <p className="text-[#6b7194] text-sm mt-1">Personal productivity hub</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Enter PIN"
                className={`w-full px-4 py-3.5 bg-[#f8f9fc] border-2 rounded-xl text-[#1a1d2e] placeholder-[#9ca3c4] outline-none transition-all duration-200 text-center tracking-[0.3em] text-lg ${
                  error ? 'border-[#ff6b6b] bg-[#fff5f5]' : 'border-[#e2e5ef] focus:border-[#6c5ce7] focus:shadow-[0_0_0_3px_rgba(108,92,231,0.1)]'
                }`}
                autoFocus
              />
              {error && <p className="text-[#ff6b6b] text-xs mt-2 text-center font-medium">Invalid PIN</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#6c5ce7] to-[#a55eea] hover:from-[#5a4bd6] hover:to-[#9645d9] text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-[#6c5ce7]/25 hover:shadow-lg hover:shadow-[#6c5ce7]/30 active:scale-[0.98]"
            >
              Enter
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#eef0f6]">
            <button
              onClick={onGuest}
              className="w-full py-3 bg-[#f8f9fc] hover:bg-[#f1f3f9] text-[#6b7194] hover:text-[#1a1d2e] font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Continue as Guest
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
