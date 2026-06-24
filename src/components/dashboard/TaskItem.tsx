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
  high: 'bg-[#ff6b6b]',
  medium: 'bg-[#e17055]',
  low: 'bg-[#74b9ff]',
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
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f8f9fc] transition-all duration-150 group">
      <button
        onClick={() => isOwner && onToggle(task.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
          task.completed
            ? 'bg-[#00b894] border-[#00b894]'
            : 'border-[#e2e5ef] hover:border-[#6c5ce7]'
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
          className="flex-1 bg-transparent text-sm text-[#1a1d2e] outline-none border-b-2 border-[#6c5ce7]"
          autoFocus
        />
      ) : (
        <span
          onClick={() => isOwner && setEditing(true)}
          className={`flex-1 text-sm cursor-default ${
            task.completed ? 'text-[#9ca3c4] line-through' : 'text-[#1a1d2e]'
          } ${isOwner ? 'cursor-text' : ''}`}
        >
          {task.title}
        </span>
      )}

      <div className="flex items-center gap-2">
        {project && (
          <span className="text-[10px] text-[#6b7194] bg-[#f1f3f9] px-2 py-0.5 rounded-full font-medium">{project.name}</span>
        )}
        <span className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`} title={task.priority} />
      </div>

      {isOwner && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 text-[#9ca3c4] hover:text-[#6b7194] transition-all p-1"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-[#e2e5ef] rounded-xl shadow-lg py-1 z-20 min-w-[140px]">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onUpdate(task.id, { priority: p });
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#f8f9fc] flex items-center gap-2 ${
                    task.priority === p ? 'text-[#1a1d2e] font-medium' : 'text-[#6b7194]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${priorityDots[p]}`} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
              <div className="border-t border-[#eef0f6] my-1" />
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    onUpdate(task.id, { projectId: proj.id });
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#f8f9fc] ${
                    task.projectId === proj.id ? 'text-[#6c5ce7] font-medium' : 'text-[#6b7194]'
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
                  className="w-full text-left px-3 py-1.5 text-xs text-[#9ca3c4] hover:bg-[#f8f9fc]"
                >
                  Unlink project
                </button>
              )}
              <div className="border-t border-[#eef0f6] my-1" />
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#ff6b6b] hover:bg-[#fff5f5]"
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
