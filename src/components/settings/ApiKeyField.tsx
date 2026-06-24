import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getApiKey, setApiKey } from '../../services/storage';

export function ApiKeyField() {
  const [key, setKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(getApiKey());
  }, []);

  const handleSave = () => {
    setApiKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const masked = key ? key.slice(0, 8) + '•'.repeat(Math.max(0, key.length - 8)) : '';

  return (
    <div>
      <label className="text-sm font-medium text-zinc-300 block mb-2">API Key</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={visible ? 'text' : 'password'}
            value={visible ? key : masked}
            onChange={(e) => {
              setKey(e.target.value);
              setSaved(false);
            }}
            onFocus={() => setVisible(true)}
            placeholder="Enter API key..."
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 pr-10 font-mono"
          />
          <button
            onClick={() => setVisible(!visible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            saved ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          }`}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
      <p className="text-[11px] text-zinc-600 mt-1.5">Stored locally. Never sent anywhere except the AI processing endpoint.</p>
    </div>
  );
}
