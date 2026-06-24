import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Note, NoteType, Priority, AppData } from '../../types';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';

interface NotesCenterProps {
  data: AppData;
  isOwner: boolean;
  onAddNote: (title: string, type: NoteType, projectId: string | null) => string;
  onUpdateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  onDeleteNote: (id: string) => void;
  onConvertToTask: (title: string, priority: Priority, projectId: string | null) => void;
}

export function NotesCenter({ data, isOwner, onAddNote, onUpdateNote, onDeleteNote, onConvertToTask }: NotesCenterProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<NoteType | 'all'>('all');

  const filtered = data.notes.filter((n) => {
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.tags.some((t) => t.includes(q));
    }
    return true;
  });

  const selectedNote = data.notes.find((n) => n.id === selectedId) ?? null;

  const handleCreate = (type: NoteType) => {
    const id = onAddNote(type === 'meeting' ? 'New Meeting' : 'New Note', type, null);
    setSelectedId(id);
  };

  return (
    <div className="flex h-full">
      <div className="w-72 flex flex-col shrink-0" style={{ borderRight: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
        <div className="p-3 space-y-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
            <Search className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..."
              className="flex-1 bg-transparent text-[13px] outline-none"
              style={{ color: 'var(--color-text-primary)' }} />
          </div>
          <div className="flex gap-0.5 rounded-md p-0.5" style={{ background: 'var(--color-bg-tertiary)' }}>
            {(['all', 'note', 'meeting'] as const).map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className="flex-1 py-1.5 text-[12px] rounded font-medium transition-colors"
                style={{
                  background: typeFilter === t ? 'var(--color-bg-hover)' : 'transparent',
                  color: typeFilter === t ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                }}>
                {t === 'all' ? 'All' : t === 'note' ? 'Notes' : 'Meetings'}
              </button>
            ))}
          </div>
        </div>

        {isOwner && (
          <div className="p-3 flex gap-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <button onClick={() => handleCreate('note')}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-[12px] font-medium transition-colors"
              style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>
              <Plus className="w-3 h-3" /> Note
            </button>
            <button onClick={() => handleCreate('meeting')}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-[12px] font-medium transition-colors"
              style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>
              <Plus className="w-3 h-3" /> Meeting
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 && <p className="text-[12px] text-center py-8" style={{ color: 'var(--color-text-muted)' }}>No notes found</p>}
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} isOwner={isOwner} isActive={note.id === selectedId}
              onClick={() => setSelectedId(note.id)} onDelete={onDeleteNote} />
          ))}
        </div>
      </div>

      {selectedNote ? (
        <NoteEditor note={selectedNote} projects={data.projects} isOwner={isOwner}
          onUpdate={onUpdateNote} onConvertLineToTask={onConvertToTask} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-[13px]" style={{ color: 'var(--color-text-muted)' }}>Select a note to view</div>
      )}
    </div>
  );
}
