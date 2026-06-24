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
  active: 'text-[#00b894] bg-[#00b894]/8',
  'on-hold': 'text-[#e17055] bg-[#e17055]/8',
  done: 'text-[#9ca3c4] bg-[#f8f9fc]',
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
    <div className="px-4 py-3 hover:bg-[#f8f9fc] transition-colors duration-150 group">
      <div className="flex items-center justify-between mb-1.5">
        {editing && isOwner ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="flex-1 bg-transparent text-sm text-[#1a1d2e] outline-none border-b-2 border-[#6c5ce7]"
            autoFocus
          />
        ) : (
          <span className="text-sm text-[#1a1d2e] font-medium">{project.name}</span>
        )}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>
            {project.status}
          </span>
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 text-[#9ca3c4] hover:text-[#6b7194] p-1 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#e2e5ef] rounded-xl shadow-lg py-1 z-20 min-w-[120px]">
                  <button
                    onClick={() => { setEditing(true); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#1a1d2e] hover:bg-[#f8f9fc] flex items-center gap-2"
                  >
                    <Pencil className="w-3 h-3" /> Rename
                  </button>
                  {(['active', 'on-hold', 'done'] as ProjectStatus[]).filter((s) => s !== project.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => { onUpdate(project.id, { status: s }); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#6b7194] hover:bg-[#f8f9fc]"
                    >
                      Set {s}
                    </button>
                  ))}
                  <div className="border-t border-[#eef0f6] my-1" />
                  <button
                    onClick={() => { onDelete(project.id); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#ff6b6b] hover:bg-[#fff5f5] flex items-center gap-2"
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
        <span className="text-[10px] text-[#9ca3c4] w-16 text-right font-medium">{completed}/{total} tasks</span>
      </div>
    </div>
  );
}
