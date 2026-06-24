import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Task, Priority, Project } from '../../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  isOwner: boolean;
  onAdd: (title: string, priority: Priority, projectId: string | null) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Task, 'title' | 'priority' | 'projectId'>>) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, projects, isOwner, onAdd, onToggle, onUpdate, onDelete }: TaskListProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [showAdd, setShowAdd] = useState(false);

  const activeTasks = tasks.filter((t) => !t.completed);
  const doneTasks = tasks.filter((t) => t.completed);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAdd(newTitle.trim(), newPriority, null);
    setNewTitle('');
    setShowAdd(false);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1a1d2e]">
          Tasks <span className="text-[#9ca3c4] font-normal">({activeTasks.length})</span>
        </h3>
        {isOwner && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-[#9ca3c4] hover:text-[#6c5ce7] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {showAdd && isOwner && (
        <div className="flex gap-2 mb-3">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Task title..."
            className="flex-1 px-3.5 py-2.5 bg-[#f8f9fc] border border-[#e2e5ef] rounded-xl text-sm text-[#1a1d2e] placeholder-[#9ca3c4] outline-none focus:border-[#6c5ce7] transition-colors"
            autoFocus
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as Priority)}
            className="px-2 py-2.5 bg-[#f8f9fc] border border-[#e2e5ef] rounded-xl text-sm text-[#1a1d2e] outline-none"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 bg-[#6c5ce7] hover:bg-[#5a4bd6] text-white text-sm rounded-xl transition-colors font-medium"
          >
            Add
          </button>
        </div>
      )}

      <div className="space-y-0.5">
        {activeTasks.length === 0 && doneTasks.length === 0 && (
          <p className="text-xs text-[#9ca3c4] py-4 text-center">No tasks yet</p>
        )}
        {activeTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            projects={projects}
            isOwner={isOwner}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
        {doneTasks.length > 0 && (
          <>
            <div className="pt-3 pb-1">
              <span className="text-[10px] uppercase tracking-wider text-[#9ca3c4] font-semibold">Completed ({doneTasks.length})</span>
            </div>
            {doneTasks.slice(0, 5).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                projects={projects}
                isOwner={isOwner}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
