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
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-[#1a1d2e] mb-3">Inbox</h3>

      {isOwner && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Quick capture..."
            className="flex-1 px-3.5 py-2.5 bg-[#f8f9fc] border border-[#e2e5ef] rounded-xl text-sm text-[#1a1d2e] placeholder-[#9ca3c4] outline-none focus:border-[#6c5ce7] focus:shadow-[0_0_0_3px_rgba(108,92,231,0.08)] transition-all duration-200"
          />
          <button
            type="submit"
            disabled={processing || !input.trim()}
            className="px-3.5 py-2.5 bg-gradient-to-r from-[#6c5ce7] to-[#a55eea] hover:from-[#5a4bd6] hover:to-[#9645d9] disabled:opacity-40 text-white rounded-xl transition-all duration-200 flex items-center gap-1 shadow-sm"
          >
            {processing ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Plus className="w-4 h-4" />}
          </button>
        </form>
      )}

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {inbox.length === 0 && (
          <p className="text-xs text-[#9ca3c4] py-3 text-center">No items in inbox</p>
        )}
        {inbox.map((item) => (
          <div key={item.id} className="flex items-center gap-2 px-3.5 py-2.5 bg-[#f8f9fc] rounded-xl group relative">
            <span className="flex-1 text-sm text-[#1a1d2e] truncate">{item.text}</span>
            {isOwner && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    onConvertToTask(item.text);
                    onRemove(item.id);
                  }}
                  className="text-xs text-[#6c5ce7] hover:text-[#5a4bd6] px-2 py-0.5 rounded-lg bg-[#6c5ce7]/8 font-medium"
                  title="Convert to task"
                >
                  Task
                </button>
                {meetingNotes.length > 0 && (
                  <button
                    onClick={() => setLinkingId(linkingId === item.id ? null : item.id)}
                    className="text-[#9ca3c4] hover:text-[#6b7194] p-0.5"
                    title="Link to meeting"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-[#9ca3c4] hover:text-[#ff6b6b] p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {linkingId === item.id && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-[#e2e5ef] rounded-xl shadow-lg p-2 z-10">
                {meetingNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      onLinkToMeeting(item.id, n.id);
                      setLinkingId(null);
                    }}
                    className="block w-full text-left px-3 py-1.5 text-xs text-[#1a1d2e] hover:bg-[#f8f9fc] rounded-lg"
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
