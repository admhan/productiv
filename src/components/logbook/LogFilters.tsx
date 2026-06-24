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
      <div className="flex items-center gap-1 bg-[#f8f9fc] rounded-xl p-1 border border-[#eef0f6]">
        {(['today', 'week', 'all'] as LogbookFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => onTimeChange(f)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              timeFilter === f ? 'bg-white text-[#1a1d2e] shadow-sm' : 'text-[#6b7194] hover:text-[#1a1d2e]'
            }`}
          >
            {f === 'today' ? 'Today' : f === 'week' ? 'This Week' : 'All Time'}
          </button>
        ))}
      </div>

      <select
        value={projectFilter ?? ''}
        onChange={(e) => onProjectChange(e.target.value || null)}
        className="px-3.5 py-2 bg-[#f8f9fc] border border-[#eef0f6] rounded-xl text-xs text-[#1a1d2e] outline-none"
      >
        <option value="">All projects</option>
        {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </div>
  );
}
