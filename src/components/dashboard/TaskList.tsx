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
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-300">
          Tasks <span className="text-zinc-600 font-normal">({activeTasks.length})</span>
        </h3>
        {isOwner && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-zinc-500 hover:text-indigo-400 transition-colors"
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
            className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 transition-colors"
            autoFocus
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as Priority)}
            className="px-2 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 outline-none"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      )}

      <div className="space-y-0.5">
        {activeTasks.length === 0 && doneTasks.length === 0 && (
          <p className="text-xs text-zinc-600 py-4 text-center">No tasks yet</p>
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
            <div className="pt-2 pb-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">Completed ({doneTasks.length})</span>
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
