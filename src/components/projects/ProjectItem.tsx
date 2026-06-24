import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Project, ProjectStatus, Task } from '../../types';
import { ProgressBar } from './ProgressBar';

interface ProjectItemProps {
  project: Project;
  tasks: Task[];
  isOwner: boolean;
  onUpdate: (id: string, updates: Partial<Pick<Project, 'name' | 'status'>>) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<ProjectStatus, { color: string; bg: string }> = {
  active: { color: 'var(--color-success)', bg: 'rgba(70, 167, 88, 0.12)' },
  'on-hold': { color: 'var(--color-warning)', bg: 'rgba(245, 166, 35, 0.12)' },
  done: { color: 'var(--color-text-muted)', bg: 'var(--color-bg-active)' },
};

export function ProjectItem({ project, tasks, isOwner, onUpdate, onDelete }: ProjectItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completed = projectTasks.filter((t) => t.completed).length;
  const total = projectTasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const handleRename = () => {
    if (name.trim() && name !== project.name) onUpdate(project.id, { name: name.trim() });
    setEditing(false);
  };

  const ss = statusStyles[project.status];

  return (
    <div className="px-4 py-3 transition-colors group"
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <div className="flex items-center justify-between mb-1.5">
        {editing && isOwner ? (
          <input value={name} onChange={(e) => setName(e.target.value)} onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()} autoFocus
            className="flex-1 bg-transparent text-[13px] outline-none"
            style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-accent)' }} />
        ) : (
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{project.name}</span>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full"
            style={{ color: ss.color, background: ss.bg }}>
            {project.status}
          </span>
          {isOwner && (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 p-1 transition-all"
                style={{ color: 'var(--color-text-muted)' }}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 rounded-lg py-1 z-20 min-w-[120px]"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                  <button onClick={() => { setEditing(true); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-[12px] flex items-center gap-2 transition-colors"
                    style={{ color: 'var(--color-text-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <Pencil className="w-3 h-3" /> Rename
                  </button>
                  {(['active', 'on-hold', 'done'] as ProjectStatus[]).filter((s) => s !== project.status).map((s) => (
                    <button key={s} onClick={() => { onUpdate(project.id, { status: s }); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 text-[12px] transition-colors"
                      style={{ color: 'var(--color-text-secondary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      Set {s}
                    </button>
                  ))}
                  <div className="my-1" style={{ borderTop: '1px solid var(--color-border)' }} />
                  <button onClick={() => { onDelete(project.id); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-[12px] flex items-center gap-2 transition-colors"
                    style={{ color: 'var(--color-danger)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-danger-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ProgressBar value={progress} className="flex-1" />
        <span className="text-[10px] w-16 text-right font-medium" style={{ color: 'var(--color-text-muted)' }}>{completed}/{total} tasks</span>
      </div>
    </div>
  );
}
