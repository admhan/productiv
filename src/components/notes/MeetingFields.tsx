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
      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
      <div className="mt-1.5 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px]"
            style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}>
            <span className="flex-1">{item}</span>
            {isOwner && (
              <button onClick={() => onRemove(i)} style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {isOwner && (
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder={`Add ${label.toLowerCase()}...`}
              className="flex-1 px-3 py-2 rounded-md text-[12px] outline-none"
              style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            <button onClick={handleAdd} style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              className="p-1"><Plus className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
}

export function MeetingFields({ note, isOwner, onUpdate }: MeetingFieldsProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg" style={{ background: 'var(--color-accent-muted)', border: '1px solid var(--color-accent-subtle)' }}>
      <h4 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>Meeting Details</h4>
      <div>
        <label className="text-[11px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>Date</label>
        <input type="date" value={note.meetingDate ?? ''}
          onChange={(e) => isOwner && onUpdate({ meetingDate: e.target.value })} disabled={!isOwner}
          className="mt-1 w-full px-3 py-2 rounded-md text-[13px] outline-none disabled:opacity-60"
          style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
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
