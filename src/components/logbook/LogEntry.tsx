import { CheckCircle2 } from 'lucide-react';
import type { Task, Project } from '../../types';

interface LogEntryProps {
  task: Task & { completedAt: string };
  project: Project | undefined;
}

export function LogEntry({ task, project }: LogEntryProps) {
  const date = new Date(task.completedAt);
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#f8f9fc] transition-colors duration-150">
      <CheckCircle2 className="w-4 h-4 text-[#00b894] shrink-0" />
      <span className="flex-1 text-sm text-[#1a1d2e]">{task.title}</span>
      {project && (
        <span className="text-[10px] px-2 py-0.5 bg-[#f1f3f9] text-[#6b7194] rounded-full font-medium">{project.name}</span>
      )}
      <span className="text-xs text-[#9ca3c4] shrink-0">
        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
