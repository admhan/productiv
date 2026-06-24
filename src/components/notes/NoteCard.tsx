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
    <div onClick={onClick}
      className="p-3 rounded-lg cursor-pointer transition-all group"
      style={{
        background: isActive ? 'var(--color-accent-subtle)' : 'transparent',
        border: isActive ? '1px solid var(--color-accent-muted)' : '1px solid transparent',
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-1">
          {note.type === 'meeting' ? (
            <Users className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
          ) : (
            <StickyNote className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
          )}
          <span className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{note.title}</span>
        </div>
        {isOwner && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="opacity-0 group-hover:opacity-100 p-0.5 transition-all"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <p className="text-[12px] line-clamp-2 ml-5.5" style={{ color: 'var(--color-text-secondary)' }}>{note.body || 'No content'}</p>
      <div className="flex items-center gap-2 mt-2 ml-5.5">
        <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{new Date(note.updatedAt).toLocaleDateString()}</span>
        {note.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ background: 'var(--color-bg-active)', color: 'var(--color-text-secondary)' }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
