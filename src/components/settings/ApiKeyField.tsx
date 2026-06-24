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
      <label className="text-[13px] font-semibold block mb-2" style={{ color: 'var(--color-text-primary)' }}>API Key</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input type={visible ? 'text' : 'password'}
            value={visible ? key : masked}
            onChange={(e) => { setKey(e.target.value); setSaved(false); }}
            onFocus={() => setVisible(true)} placeholder="Enter API key..."
            className="w-full h-9 px-3 rounded-md text-[13px] outline-none pr-10 font-mono"
            style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          <button onClick={() => setVisible(!visible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            style={{ color: 'var(--color-text-muted)' }}>
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button onClick={handleSave}
          className="h-9 px-3 rounded-md text-[13px] font-medium transition-colors"
          style={saved
            ? { background: 'rgba(70, 167, 88, 0.12)', color: 'var(--color-success)' }
            : { background: 'var(--color-accent)', color: 'white' }}>
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
      <p className="text-[11px] mt-1.5" style={{ color: 'var(--color-text-muted)' }}>Stored locally. Never sent anywhere except the AI processing endpoint.</p>
    </div>
  );
}
