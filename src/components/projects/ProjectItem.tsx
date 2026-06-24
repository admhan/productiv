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

const statusColors: Record<ProjectStatus, string> = {
  active: 'text-green-400',
  'on-hold': 'text-amber-400',
  done: 'text-zinc-500',
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
    if (name.trim() && name !== project.name) {
      onUpdate(project.id, { name: name.trim() });
    }
    setEditing(false);
  };

  return (
    <div className="px-4 py-3 hover:bg-zinc-800/50 transition-colors duration-100 group">
      <div className="flex items-center justify-between mb-1.5">
        {editing && isOwner ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="flex-1 bg-transparent text-sm text-zinc-100 outline-none border-b border-indigo-500"
            autoFocus
          />
        ) : (
          <span className="text-sm text-zinc-200">{project.name}</span>
        )}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase ${statusColors[project.status]}`}>
            {project.status}
          </span>
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 p-1 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-20 min-w-[120px]">
                  <button
                    onClick={() => { setEditing(true); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 flex items-center gap-2"
                  >
                    <Pencil className="w-3 h-3" /> Rename
                  </button>
                  {(['active', 'on-hold', 'done'] as ProjectStatus[]).filter((s) => s !== project.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => { onUpdate(project.id, { status: s }); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700"
                    >
                      Set {s}
                    </button>
                  ))}
                  <div className="border-t border-zinc-700 my-1" />
                  <button
                    onClick={() => { onDelete(project.id); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-700 flex items-center gap-2"
                  >
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
        <span className="text-[10px] text-zinc-500 w-16 text-right">{completed}/{total} tasks</span>
      </div>
    </div>
  );
}
