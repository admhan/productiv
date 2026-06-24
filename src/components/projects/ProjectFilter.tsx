import type { ProjectStatus } from '../../types';

type FilterOption = ProjectStatus | 'all';

interface ProjectFilterProps {
  active: FilterOption;
  onChange: (value: FilterOption) => void;
}

const options: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'done', label: 'Done' },
];

export function ProjectFilter({ active, onChange }: ProjectFilterProps) {
  return (
    <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
            active === opt.value
              ? 'bg-zinc-700 text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
