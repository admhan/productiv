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
      <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
        {(['today', 'week', 'all'] as LogbookFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => onTimeChange(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
              timeFilter === f ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {f === 'today' ? 'Today' : f === 'week' ? 'This Week' : 'All Time'}
          </button>
        ))}
      </div>

      <select
        value={projectFilter ?? ''}
        onChange={(e) => onProjectChange(e.target.value || null)}
        className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 outline-none"
      >
        <option value="">All projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}
