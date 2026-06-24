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
  const active = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  const handleAdd = () => { if (!newTitle.trim()) return; onAdd(newTitle.trim(), newPriority, null); setNewTitle(''); setShowAdd(false); };

  return (
    <div className="rounded-lg p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Tasks <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>({active.length})</span>
        </h3>
        {isOwner && (
          <button onClick={() => setShowAdd(!showAdd)} style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {showAdd && isOwner && (
        <div className="flex gap-2 mb-3">
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="Task title…" autoFocus
            className="flex-1 h-9 px-3 rounded-md text-[13px] outline-none"
            style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)}
            className="h-9 px-2 rounded-md text-[12px] outline-none"
            style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
            <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
          <button onClick={handleAdd} className="h-9 px-3 rounded-md text-[13px] font-medium text-white"
            style={{ background: 'var(--color-accent)' }}>Add</button>
        </div>
      )}

      <div>
        {active.length === 0 && done.length === 0 && (
          <p className="text-[12px] py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>No tasks yet</p>
        )}
        {active.map((t) => <TaskItem key={t.id} task={t} projects={projects} isOwner={isOwner} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />)}
        {done.length > 0 && (
          <>
            <div className="mt-3 mb-1 px-2">
              <span className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>Done ({done.length})</span>
            </div>
            {done.slice(0, 5).map((t) => <TaskItem key={t.id} task={t} projects={projects} isOwner={isOwner} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />)}
          </>
        )}
      </div>
    </div>
  );
}
