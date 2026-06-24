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
      <div className="w-72 border-r border-[#eef0f6] bg-white/50 flex flex-col shrink-0">
        <div className="p-3 space-y-2 border-b border-[#eef0f6]">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fc] rounded-xl border border-[#eef0f6]">
            <Search className="w-3.5 h-3.5 text-[#9ca3c4]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="flex-1 bg-transparent text-sm text-[#1a1d2e] placeholder-[#9ca3c4] outline-none"
            />
          </div>
          <div className="flex gap-1 bg-[#f8f9fc] rounded-lg p-0.5">
            {(['all', 'note', 'meeting'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`flex-1 py-1.5 text-xs rounded-md font-medium transition-all ${
                  typeFilter === t ? 'bg-white text-[#1a1d2e] shadow-sm' : 'text-[#6b7194] hover:text-[#1a1d2e]'
                }`}
              >
                {t === 'all' ? 'All' : t === 'note' ? 'Notes' : 'Meetings'}
              </button>
            ))}
          </div>
        </div>

        {isOwner && (
          <div className="p-3 flex gap-2 border-b border-[#eef0f6]">
            <button
              onClick={() => handleCreate('note')}
              className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-[#6c5ce7]/8 hover:bg-[#6c5ce7]/15 text-[#6c5ce7] text-xs rounded-xl transition-colors font-medium"
            >
              <Plus className="w-3 h-3" /> Note
            </button>
            <button
              onClick={() => handleCreate('meeting')}
              className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-[#a55eea]/8 hover:bg-[#a55eea]/15 text-[#a55eea] text-xs rounded-xl transition-colors font-medium"
            >
              <Plus className="w-3 h-3" /> Meeting
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 && <p className="text-xs text-[#9ca3c4] text-center py-8">No notes found</p>}
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
        <div className="flex-1 flex items-center justify-center text-[#9ca3c4] text-sm">Select a note to view</div>
      )}
    </div>
  );
}
