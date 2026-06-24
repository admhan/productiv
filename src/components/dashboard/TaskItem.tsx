import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { Task, Priority, Project } from '../../types';

interface TaskItemProps {
  task: Task;
  projects: Project[];
  isOwner: boolean;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Task, 'title' | 'priority' | 'projectId'>>) => void;
  onDelete: (id: string) => void;
}

const dots: Record<Priority, string> = { high: '#e5484d', medium: '#f5a623', low: '#3b82f6' };

export function TaskItem({ task, projects, isOwner, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [showMenu, setShowMenu] = useState(false);
  const project = projects.find((p) => p.id === task.projectId);

  const handleSave = () => {
    if (title.trim() && title !== task.title) onUpdate(task.id, { title: title.trim() });
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-3 h-9 px-2 rounded-md group transition-colors"
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <button onClick={() => isOwner && onToggle(task.id)} disabled={!isOwner}
        className="w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-all"
        style={{
          borderColor: task.completed ? 'var(--color-success)' : 'var(--color-border-light)',
          background: task.completed ? 'var(--color-success)' : 'transparent',
        }}>
        {task.completed && <Check className="w-3 h-3 text-white" />}
      </button>

      {editing && isOwner ? (
        <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()} autoFocus
          className="flex-1 bg-transparent text-[13px] outline-none"
          style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-accent)' }} />
      ) : (
        <span onClick={() => isOwner && setEditing(true)}
          className={`flex-1 text-[13px] ${isOwner ? 'cursor-text' : ''}`}
          style={{ color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)', textDecoration: task.completed ? 'line-through' : 'none' }}>
          {task.title}
        </span>
      )}

      {project && (
        <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: 'var(--color-bg-active)', color: 'var(--color-text-muted)' }}>
          {project.name}
        </span>
      )}
      <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: dots[task.priority] }} />

      {isOwner && (
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
            style={{ color: 'var(--color-text-muted)' }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 rounded-lg py-1 z-20 min-w-[140px]"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button key={p} onClick={() => { onUpdate(task.id, { priority: p }); setShowMenu(false); }}
                  className="w-full text-left px-3 h-7 text-[12px] flex items-center gap-2 transition-colors"
                  style={{ color: task.priority === p ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <span className="w-[6px] h-[6px] rounded-full" style={{ background: dots[p] }} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
              <div className="my-1" style={{ borderTop: '1px solid var(--color-border)' }} />
              {projects.map((proj) => (
                <button key={proj.id} onClick={() => { onUpdate(task.id, { projectId: proj.id }); setShowMenu(false); }}
                  className="w-full text-left px-3 h-7 text-[12px] transition-colors"
                  style={{ color: task.projectId === proj.id ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>{proj.name}</button>
              ))}
              {task.projectId && (
                <button onClick={() => { onUpdate(task.id, { projectId: null }); setShowMenu(false); }}
                  className="w-full text-left px-3 h-7 text-[12px] transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Unlink</button>
              )}
              <div className="my-1" style={{ borderTop: '1px solid var(--color-border)' }} />
              <button onClick={() => { onDelete(task.id); setShowMenu(false); }}
                className="w-full text-left px-3 h-7 text-[12px] transition-colors"
                style={{ color: 'var(--color-danger)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-danger-subtle)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
