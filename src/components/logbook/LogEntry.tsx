import { CheckCircle2 } from 'lucide-react';
import type { Task, Project } from '../../types';

interface LogEntryProps {
  task: Task & { completedAt: string };
  project: Project | undefined;
}

export function LogEntry({ task, project }: LogEntryProps) {
  const date = new Date(task.completedAt);
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/30 transition-colors duration-100">
      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
      <span className="flex-1 text-sm text-zinc-300">{task.title}</span>
      {project && (
        <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded-full">{project.name}</span>
      )}
      <span className="text-xs text-zinc-600 shrink-0">
        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
