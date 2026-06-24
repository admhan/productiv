import type { Note, Project, Priority } from '../../types';
import { TagInput } from './TagInput';
import { MeetingFields } from './MeetingFields';
import { ArrowRight } from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  projects: Project[];
  isOwner: boolean;
  onUpdate: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  onConvertLineToTask: (title: string, priority: Priority, projectId: string | null) => void;
}

function renderBody(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc ml-4">$1</ul>')
    .replace(/\n/g, '<br />');
}

export function NoteEditor({ note, projects, isOwner, onUpdate, onConvertLineToTask }: NoteEditorProps) {
  const handleConvertLine = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) onConvertLineToTask(selection, 'medium', note.projectId);
  };

  return (
    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
      <input value={note.title}
        onChange={(e) => isOwner && onUpdate(note.id, { title: e.target.value })} disabled={!isOwner}
        className="w-full text-xl font-bold bg-transparent outline-none disabled:cursor-default"
        style={{ color: 'var(--color-text-primary)' }} placeholder="Note title..." />

      <div className="flex items-center gap-3">
        <select value={note.projectId ?? ''}
          onChange={(e) => isOwner && onUpdate(note.id, { projectId: e.target.value || null })} disabled={!isOwner}
          className="px-3 py-2 rounded-md text-[12px] outline-none disabled:opacity-60"
          style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
          <option value="">No project</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select value={note.type}
          onChange={(e) => isOwner && onUpdate(note.id, { type: e.target.value as 'note' | 'meeting' })} disabled={!isOwner}
          className="px-3 py-2 rounded-md text-[12px] outline-none disabled:opacity-60"
          style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
          <option value="note">Note</option>
          <option value="meeting">Meeting</option>
        </select>

        {isOwner && (
          <button onClick={handleConvertLine}
            className="flex items-center gap-1 px-3 py-2 text-[12px] rounded-md transition-colors"
            style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
            title="Select text in the body, then click to convert to task"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
            <ArrowRight className="w-3 h-3" /> Selection to task
          </button>
        )}
      </div>

      <TagInput tags={note.tags} onChange={(tags) => isOwner && onUpdate(note.id, { tags })} disabled={!isOwner} />

      {note.type === 'meeting' && (
        <MeetingFields note={note} isOwner={isOwner} onUpdate={(updates) => onUpdate(note.id, updates)} />
      )}

      {isOwner ? (
        <textarea value={note.body} onChange={(e) => onUpdate(note.id, { body: e.target.value })}
          placeholder="Start writing... (supports **bold**, *italic*, - lists)"
          className="w-full min-h-[300px] rounded-md p-4 text-[13px] outline-none resize-y leading-relaxed"
          style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
      ) : (
        <div className="w-full min-h-[300px] rounded-md p-4 text-[13px] leading-relaxed"
          style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
          dangerouslySetInnerHTML={{ __html: renderBody(note.body) || '<span style="color:var(--color-text-muted)">No content</span>' }} />
      )}
    </div>
  );
}
