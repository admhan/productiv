import { useState } from 'react';
import { Plus, Sparkles, X, Link2 } from 'lucide-react';
import type { InboxItem, Note } from '../../types';
import { processWithAI } from '../../services/ai';

interface InboxCaptureProps {
  inbox: InboxItem[];
  notes: Note[];
  isOwner: boolean;
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  onLinkToMeeting: (inboxId: string, meetingId: string) => void;
  onConvertToTask: (text: string) => void;
}

export function InboxCapture({ inbox, notes, isOwner, onAdd, onRemove, onLinkToMeeting, onConvertToTask }: InboxCaptureProps) {
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const meetingNotes = notes.filter((n) => n.type === 'meeting');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isOwner) return;
    setProcessing(true);
    const processed = await processWithAI(input.trim());
    onAdd(processed);
    setInput('');
    setProcessing(false);
  };

  return (
    <div className="rounded-lg p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
      <h3 className="text-[13px] font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Inbox</h3>

      {isOwner && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Quick capture…"
            className="flex-1 h-9 px-3 rounded-md text-[13px] outline-none transition-colors"
            style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
          <button type="submit" disabled={processing || !input.trim()}
            className="h-9 w-9 rounded-md flex items-center justify-center text-white transition-colors disabled:opacity-30"
            style={{ background: 'var(--color-accent)' }}>
            {processing ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Plus className="w-4 h-4" />}
          </button>
        </form>
      )}

      <div className="space-y-1 max-h-48 overflow-y-auto">
        {inbox.length === 0 && <p className="text-[12px] py-3 text-center" style={{ color: 'var(--color-text-muted)' }}>No items</p>}
        {inbox.map((item) => (
          <div key={item.id} className="flex items-center gap-2 h-9 px-3 rounded-md group relative"
            style={{ background: 'var(--color-bg-tertiary)' }}>
            <span className="flex-1 text-[13px] truncate" style={{ color: 'var(--color-text-primary)' }}>{item.text}</span>
            {isOwner && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { onConvertToTask(item.text); onRemove(item.id); }}
                  className="text-[11px] font-medium px-1.5 py-0.5 rounded"
                  style={{ color: 'var(--color-accent)', background: 'var(--color-accent-subtle)' }}>Task</button>
                {meetingNotes.length > 0 && (
                  <button onClick={() => setLinkingId(linkingId === item.id ? null : item.id)}
                    style={{ color: 'var(--color-text-muted)' }}><Link2 className="w-3.5 h-3.5" /></button>
                )}
                <button onClick={() => onRemove(item.id)} style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}><X className="w-3.5 h-3.5" /></button>
              </div>
            )}
            {linkingId === item.id && (
              <div className="absolute top-full left-0 mt-1 rounded-lg p-1 z-10 min-w-[160px]"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                {meetingNotes.map((n) => (
                  <button key={n.id} onClick={() => { onLinkToMeeting(item.id, n.id); setLinkingId(null); }}
                    className="block w-full text-left px-3 py-1.5 text-[12px] rounded-md transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>{n.title}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
