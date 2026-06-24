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
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Inbox</h3>

      {isOwner && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Quick capture..."
            className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 transition-colors duration-150"
          />
          <button
            type="submit"
            disabled={processing || !input.trim()}
            className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg transition-colors duration-150 flex items-center gap-1"
          >
            {processing ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Plus className="w-4 h-4" />}
          </button>
        </form>
      )}

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {inbox.length === 0 && (
          <p className="text-xs text-zinc-600 py-2 text-center">No items in inbox</p>
        )}
        {inbox.map((item) => (
          <div key={item.id} className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg group">
            <span className="flex-1 text-sm text-zinc-300 truncate">{item.text}</span>
            {isOwner && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    onConvertToTask(item.text);
                    onRemove(item.id);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-500/10"
                  title="Convert to task"
                >
                  Task
                </button>
                {meetingNotes.length > 0 && (
                  <button
                    onClick={() => setLinkingId(linkingId === item.id ? null : item.id)}
                    className="text-zinc-500 hover:text-zinc-300 p-0.5"
                    title="Link to meeting"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-zinc-500 hover:text-red-400 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {linkingId === item.id && (
              <div className="absolute mt-20 ml-24 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-2 z-10">
                {meetingNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      onLinkToMeeting(item.id, n.id);
                      setLinkingId(null);
                    }}
                    className="block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 rounded"
                  >
                    {n.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
