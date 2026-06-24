import { useState } from 'react';
import { Lock, Eye } from 'lucide-react';

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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className={`w-full max-w-sm p-8 ${shake ? 'animate-shake' : ''}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Productiv</h1>
          <p className="text-zinc-500 text-sm mt-1">Personal productivity hub</p>
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
              className={`w-full px-4 py-3 bg-zinc-900 border rounded-lg text-zinc-100 placeholder-zinc-600 outline-none transition-colors duration-150 text-center tracking-[0.3em] text-lg ${
                error ? 'border-red-500' : 'border-zinc-800 focus:border-indigo-500'
              }`}
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-2 text-center">Invalid PIN</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors duration-150"
          >
            Enter
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800">
          <button
            onClick={onGuest}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Continue as Guest
          </button>
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
