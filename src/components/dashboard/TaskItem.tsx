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

const priorityDots: Record<Priority, string> = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-blue-400',
};

export function TaskItem({ task, projects, isOwner, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [showMenu, setShowMenu] = useState(false);

  const project = projects.find((p) => p.id === task.projectId);

  const handleSave = () => {
    if (title.trim() && title !== task.title) {
      onUpdate(task.id, { title: title.trim() });
    }
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors duration-100 group">
      <button
        onClick={() => isOwner && onToggle(task.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
          task.completed
            ? 'bg-green-500 border-green-500'
            : 'border-zinc-600 hover:border-indigo-500'
        }`}
        disabled={!isOwner}
        title={isOwner ? undefined : 'Owner only'}
      >
        {task.completed && <Check className="w-3 h-3 text-white" />}
      </button>

      {editing && isOwner ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="flex-1 bg-transparent text-sm text-zinc-100 outline-none border-b border-indigo-500"
          autoFocus
        />
      ) : (
        <span
          onClick={() => isOwner && setEditing(true)}
          className={`flex-1 text-sm cursor-default ${
            task.completed ? 'text-zinc-600 line-through' : 'text-zinc-200'
          } ${isOwner ? 'cursor-text' : ''}`}
        >
          {task.title}
        </span>
      )}

      <div className="flex items-center gap-2">
        {project && (
          <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{project.name}</span>
        )}
        <span className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`} title={task.priority} />
      </div>

      {isOwner && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-all p-1"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-20 min-w-[140px]">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onUpdate(task.id, { priority: p });
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-700 flex items-center gap-2 ${
                    task.priority === p ? 'text-zinc-100' : 'text-zinc-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${priorityDots[p]}`} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
              <div className="border-t border-zinc-700 my-1" />
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    onUpdate(task.id, { projectId: proj.id });
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-700 ${
                    task.projectId === proj.id ? 'text-indigo-400' : 'text-zinc-400'
                  }`}
                >
                  {proj.name}
                </button>
              ))}
              {task.projectId && (
                <button
                  onClick={() => {
                    onUpdate(task.id, { projectId: null });
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-700"
                >
                  Unlink project
                </button>
              )}
              <div className="border-t border-zinc-700 my-1" />
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
