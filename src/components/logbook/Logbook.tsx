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
      <LogFilters timeFilter={timeFilter} projectFilter={projectFilter} projects={data.projects}
        onTimeChange={setTimeFilter} onProjectChange={setProjectFilter} />

      <div className="card divide-y divide-[#eef0f6]">
        {entries.length === 0 && (
          <div className="text-center py-16 text-[#9ca3c4] text-sm">No completed tasks</div>
        )}
        {entries.map((task) => (
          <LogEntry key={task.id} task={task} project={data.projects.find((p) => p.id === task.projectId)} />
        ))}
      </div>
    </div>
  );
}
