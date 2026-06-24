import { useState } from 'react';
import type { LogbookFilter, AppData } from '../../types';
import { LogEntry } from './LogEntry';
import { LogFilters } from './LogFilters';
import { useLogbook } from '../../hooks/useLogbook';

interface LogbookProps {
  data: AppData;
}

export function Logbook({ data }: LogbookProps) {
  const [timeFilter, setTimeFilter] = useState<LogbookFilter>('all');
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const { filterTasks } = useLogbook(data);

  const entries = filterTasks(timeFilter, projectFilter);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <LogFilters
        timeFilter={timeFilter}
        projectFilter={projectFilter}
        projects={data.projects}
        onTimeChange={setTimeFilter}
        onProjectChange={setProjectFilter}
      />

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800/50">
        {entries.length === 0 && (
          <div className="text-center py-12 text-zinc-600 text-sm">No completed tasks</div>
        )}
        {entries.map((task) => (
          <LogEntry
            key={task.id}
            task={task}
            project={data.projects.find((p) => p.id === task.projectId)}
          />
        ))}
      </div>
    </div>
  );
}
