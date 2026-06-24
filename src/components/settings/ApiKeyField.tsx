import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getApiKey, setApiKey } from '../../services/storage';

export function ApiKeyField() {
  const [key, setKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setKey(getApiKey()); }, []);

  const handleSave = () => {
    setApiKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const masked = key ? key.slice(0, 8) + '•'.repeat(Math.max(0, key.length - 8)) : '';

  return (
    <div>
      <label className="text-sm font-semibold text-[#1a1d2e] block mb-2">API Key</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={visible ? 'text' : 'password'}
            value={visible ? key : masked}
            onChange={(e) => { setKey(e.target.value); setSaved(false); }}
            onFocus={() => setVisible(true)}
            placeholder="Enter API key..."
            className="w-full px-3.5 py-2.5 bg-[#f8f9fc] border border-[#e2e5ef] rounded-xl text-sm text-[#1a1d2e] placeholder-[#9ca3c4] outline-none focus:border-[#6c5ce7] pr-10 font-mono"
          />
          <button
            onClick={() => setVisible(!visible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9ca3c4] hover:text-[#6b7194] p-1"
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved ? 'bg-[#00b894]/10 text-[#00b894]' : 'bg-[#6c5ce7] hover:bg-[#5a4bd6] text-white'
          }`}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
      <p className="text-[11px] text-[#9ca3c4] mt-1.5">Stored locally. Never sent anywhere except the AI processing endpoint.</p>
    </div>
  );
}
