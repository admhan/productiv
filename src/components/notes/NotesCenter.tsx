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
      <div className="w-72 border-r border-zinc-800 flex flex-col shrink-0">
        <div className="p-3 space-y-2 border-b border-zinc-800">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg">
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none"
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'note', 'meeting'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`flex-1 py-1 text-xs rounded ${
                  typeFilter === t ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t === 'all' ? 'All' : t === 'note' ? 'Notes' : 'Meetings'}
              </button>
            ))}
          </div>
        </div>

        {isOwner && (
          <div className="p-3 flex gap-2 border-b border-zinc-800">
            <button
              onClick={() => handleCreate('note')}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs rounded-lg transition-colors"
            >
              <Plus className="w-3 h-3" /> Note
            </button>
            <button
              onClick={() => handleCreate('meeting')}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs rounded-lg transition-colors"
            >
              <Plus className="w-3 h-3" /> Meeting
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 && (
            <p className="text-xs text-zinc-600 text-center py-8">No notes found</p>
          )}
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isOwner={isOwner}
              isActive={note.id === selectedId}
              onClick={() => setSelectedId(note.id)}
              onDelete={onDeleteNote}
            />
          ))}
        </div>
      </div>

      {selectedNote ? (
        <NoteEditor
          note={selectedNote}
          projects={data.projects}
          isOwner={isOwner}
          onUpdate={onUpdateNote}
          onConvertLineToTask={onConvertToTask}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
          Select a note to view
        </div>
      )}
    </div>
  );
}
