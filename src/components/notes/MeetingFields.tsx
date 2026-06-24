import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Note } from '../../types';

interface MeetingFieldsProps {
  note: Note;
  isOwner: boolean;
  onUpdate: (updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
}

function ListField({ label, items, isOwner, onAdd, onRemove }: {
  label: string; items: string[]; isOwner: boolean;
  onAdd: (item: string) => void; onRemove: (index: number) => void;
}) {
  const [input, setInput] = useState('');
  const handleAdd = () => { if (!input.trim()) return; onAdd(input.trim()); setInput(''); };

  return (
    <div>
      <label className="text-xs font-semibold text-[#6b7194] uppercase tracking-wider">{label}</label>
      <div className="mt-1.5 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fc] rounded-lg text-sm text-[#1a1d2e]">
            <span className="flex-1">{item}</span>
            {isOwner && (
              <button onClick={() => onRemove(i)} className="text-[#9ca3c4] hover:text-[#ff6b6b]">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {isOwner && (
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder={`Add ${label.toLowerCase()}...`}
              className="flex-1 px-3 py-2 bg-[#f8f9fc] border border-[#e2e5ef] rounded-lg text-xs text-[#1a1d2e] placeholder-[#9ca3c4] outline-none focus:border-[#6c5ce7]"
            />
            <button onClick={handleAdd} className="text-[#9ca3c4] hover:text-[#6c5ce7] p-1">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function MeetingFields({ note, isOwner, onUpdate }: MeetingFieldsProps) {
  return (
    <div className="space-y-4 p-4 bg-[#6c5ce7]/4 rounded-xl border border-[#6c5ce7]/10">
      <h4 className="text-xs font-semibold text-[#6c5ce7] uppercase tracking-wider">Meeting Details</h4>
      <div>
        <label className="text-xs font-semibold text-[#6b7194]">Date</label>
        <input
          type="date"
          value={note.meetingDate ?? ''}
          onChange={(e) => isOwner && onUpdate({ meetingDate: e.target.value })}
          disabled={!isOwner}
          className="mt-1 w-full px-3 py-2 bg-white border border-[#e2e5ef] rounded-lg text-sm text-[#1a1d2e] outline-none focus:border-[#6c5ce7] disabled:opacity-60"
        />
      </div>
      <ListField label="Participants" items={note.participants} isOwner={isOwner}
        onAdd={(item) => onUpdate({ participants: [...note.participants, item] })}
        onRemove={(i) => onUpdate({ participants: note.participants.filter((_, idx) => idx !== i) })} />
      <ListField label="Decisions" items={note.decisions} isOwner={isOwner}
        onAdd={(item) => onUpdate({ decisions: [...note.decisions, item] })}
        onRemove={(i) => onUpdate({ decisions: note.decisions.filter((_, idx) => idx !== i) })} />
      <ListField label="Action Items" items={note.actionItems} isOwner={isOwner}
        onAdd={(item) => onUpdate({ actionItems: [...note.actionItems, item] })}
        onRemove={(i) => onUpdate({ actionItems: note.actionItems.filter((_, idx) => idx !== i) })} />
    </div>
  );
}
