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

      <div className="rounded-lg overflow-hidden" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
        {entries.length === 0 && (
          <div className="text-center py-16 text-[13px]" style={{ color: 'var(--color-text-muted)' }}>No completed tasks</div>
        )}
        {entries.map((task, i) => (
          <div key={task.id}>
            {i > 0 && <div style={{ borderTop: '1px solid var(--color-border)' }} />}
            <LogEntry task={task} project={data.projects.find((p) => p.id === task.projectId)} />
          </div>
        ))}
      </div>
    </div>
  );
}
