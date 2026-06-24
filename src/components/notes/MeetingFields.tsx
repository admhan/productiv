import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Note } from '../../types';

interface MeetingFieldsProps {
  note: Note;
  isOwner: boolean;
  onUpdate: (updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
}

function ListField({
  label,
  items,
  isOwner,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  isOwner: boolean;
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
}) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput('');
  };

  return (
    <div>
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
      <div className="mt-1 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded text-sm text-zinc-300">
            <span className="flex-1">{item}</span>
            {isOwner && (
              <button onClick={() => onRemove(i)} className="text-zinc-600 hover:text-red-400">
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
              className="flex-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300 placeholder-zinc-600 outline-none focus:border-indigo-500"
            />
            <button onClick={handleAdd} className="text-zinc-500 hover:text-indigo-400 p-1">
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
    <div className="space-y-4 p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Meeting Details</h4>

      <div>
        <label className="text-xs font-medium text-zinc-500">Date</label>
        <input
          type="date"
          value={note.meetingDate ?? ''}
          onChange={(e) => isOwner && onUpdate({ meetingDate: e.target.value })}
          disabled={!isOwner}
          className="mt-1 w-full px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300 outline-none focus:border-indigo-500 disabled:opacity-60"
        />
      </div>

      <ListField
        label="Participants"
        items={note.participants}
        isOwner={isOwner}
        onAdd={(item) => onUpdate({ participants: [...note.participants, item] })}
        onRemove={(i) => onUpdate({ participants: note.participants.filter((_, idx) => idx !== i) })}
      />

      <ListField
        label="Decisions"
        items={note.decisions}
        isOwner={isOwner}
        onAdd={(item) => onUpdate({ decisions: [...note.decisions, item] })}
        onRemove={(i) => onUpdate({ decisions: note.decisions.filter((_, idx) => idx !== i) })}
      />

      <ListField
        label="Action Items"
        items={note.actionItems}
        isOwner={isOwner}
        onAdd={(item) => onUpdate({ actionItems: [...note.actionItems, item] })}
        onRemove={(i) => onUpdate({ actionItems: note.actionItems.filter((_, idx) => idx !== i) })}
      />
    </div>
  );
}
