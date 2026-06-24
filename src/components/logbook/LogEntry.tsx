import { CheckCircle2 } from 'lucide-react';
import type { Task, Project } from '../../types';

interface LogEntryProps {
  task: Task & { completedAt: string };
  project: Project | undefined;
}

export function LogEntry({ task, project }: LogEntryProps) {
  const date = new Date(task.completedAt);
  return (
    <div className="flex items-center gap-3 px-5 py-3 transition-colors"
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--color-success)' }} />
      <span className="flex-1 text-[13px]" style={{ color: 'var(--color-text-primary)' }}>{task.title}</span>
      {project && (
        <span className="text-[10px] px-2 py-0.5 rounded font-medium"
          style={{ background: 'var(--color-bg-active)', color: 'var(--color-text-secondary)' }}>{project.name}</span>
      )}
      <span className="text-[12px] shrink-0" style={{ color: 'var(--color-text-muted)' }}>
        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
