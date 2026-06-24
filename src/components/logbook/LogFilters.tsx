import type { LogbookFilter, Project } from '../../types';

interface LogFiltersProps {
  timeFilter: LogbookFilter;
  projectFilter: string | null;
  projects: Project[];
  onTimeChange: (filter: LogbookFilter) => void;
  onProjectChange: (projectId: string | null) => void;
}

export function LogFilters({ timeFilter, projectFilter, projects, onTimeChange, onProjectChange }: LogFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-0.5 rounded-md p-0.5"
        style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
        {(['today', 'week', 'all'] as LogbookFilter[]).map((f) => (
          <button key={f} onClick={() => onTimeChange(f)}
            className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
            style={{
              background: timeFilter === f ? 'var(--color-bg-hover)' : 'transparent',
              color: timeFilter === f ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            }}>
            {f === 'today' ? 'Today' : f === 'week' ? 'This Week' : 'All Time'}
          </button>
        ))}
      </div>

      <select value={projectFilter ?? ''} onChange={(e) => onProjectChange(e.target.value || null)}
        className="px-3 py-1.5 rounded-md text-[12px] outline-none"
        style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
        <option value="">All projects</option>
        {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </div>
  );
}
