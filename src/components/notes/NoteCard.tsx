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
      className={`p-3 rounded-xl cursor-pointer transition-all duration-150 group ${
        isActive ? 'bg-[#6c5ce7]/8 border border-[#6c5ce7]/20 shadow-sm' : 'hover:bg-[#f8f9fc] border border-transparent'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-1">
          {note.type === 'meeting' ? (
            <Users className="w-3.5 h-3.5 text-[#a55eea]" />
          ) : (
            <StickyNote className="w-3.5 h-3.5 text-[#6c5ce7]" />
          )}
          <span className="text-sm font-medium text-[#1a1d2e] truncate">{note.title}</span>
        </div>
        {isOwner && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="opacity-0 group-hover:opacity-100 text-[#9ca3c4] hover:text-[#ff6b6b] p-0.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <p className="text-xs text-[#6b7194] line-clamp-2 ml-5.5">{note.body || 'No content'}</p>
      <div className="flex items-center gap-2 mt-2 ml-5.5">
        <span className="text-[10px] text-[#9ca3c4]">{new Date(note.updatedAt).toLocaleDateString()}</span>
        {note.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[#f1f3f9] text-[#6b7194] rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  );
}
