import { StickyNote, Users, Trash2 } from 'lucide-react';
import type { Note } from '../../types';

interface NoteCardProps {
  note: Note;
  isOwner: boolean;
  isActive: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, isOwner, isActive, onClick, onDelete }: NoteCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-colors duration-100 group ${
        isActive ? 'bg-indigo-500/10 border border-indigo-500/30' : 'hover:bg-zinc-800/50 border border-transparent'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-1">
          {note.type === 'meeting' ? (
            <Users className="w-3.5 h-3.5 text-violet-400" />
          ) : (
            <StickyNote className="w-3.5 h-3.5 text-indigo-400" />
          )}
          <span className="text-sm font-medium text-zinc-200 truncate">{note.title}</span>
        </div>
        {isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 p-0.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <p className="text-xs text-zinc-500 line-clamp-2 ml-5.5">
        {note.body || 'No content'}
      </p>
      <div className="flex items-center gap-2 mt-2 ml-5.5">
        <span className="text-[10px] text-zinc-600">{new Date(note.updatedAt).toLocaleDateString()}</span>
        {note.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
