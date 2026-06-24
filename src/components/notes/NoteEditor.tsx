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
    if (selection) {
      onConvertLineToTask(selection, 'medium', note.projectId);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
      <input
        value={note.title}
        onChange={(e) => isOwner && onUpdate(note.id, { title: e.target.value })}
        disabled={!isOwner}
        className="w-full text-xl font-bold bg-transparent text-zinc-100 outline-none disabled:cursor-default"
        placeholder="Note title..."
      />

      <div className="flex items-center gap-4">
        <select
          value={note.projectId ?? ''}
          onChange={(e) => isOwner && onUpdate(note.id, { projectId: e.target.value || null })}
          disabled={!isOwner}
          className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 outline-none disabled:opacity-60"
        >
          <option value="">No project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={note.type}
          onChange={(e) => isOwner && onUpdate(note.id, { type: e.target.value as 'note' | 'meeting' })}
          disabled={!isOwner}
          className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 outline-none disabled:opacity-60"
        >
          <option value="note">Note</option>
          <option value="meeting">Meeting</option>
        </select>

        {isOwner && (
          <button
            onClick={handleConvertLine}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-zinc-500 hover:text-indigo-400 bg-zinc-800 rounded-lg transition-colors"
            title="Select text in the body, then click to convert to task"
          >
            <ArrowRight className="w-3 h-3" />
            Selection to task
          </button>
        )}
      </div>

      <TagInput
        tags={note.tags}
        onChange={(tags) => isOwner && onUpdate(note.id, { tags })}
        disabled={!isOwner}
      />

      {note.type === 'meeting' && (
        <MeetingFields
          note={note}
          isOwner={isOwner}
          onUpdate={(updates) => onUpdate(note.id, updates)}
        />
      )}

      {isOwner ? (
        <textarea
          value={note.body}
          onChange={(e) => onUpdate(note.id, { body: e.target.value })}
          placeholder="Start writing... (supports **bold**, *italic*, - lists)"
          className="w-full min-h-[300px] bg-zinc-800/30 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none resize-y focus:border-zinc-700 leading-relaxed"
        />
      ) : (
        <div
          className="w-full min-h-[300px] bg-zinc-800/30 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderBody(note.body) || '<span class="text-zinc-600">No content</span>' }}
        />
      )}
    </div>
  );
}
