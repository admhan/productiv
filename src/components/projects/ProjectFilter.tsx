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
    <div className="flex items-center gap-1 bg-[#f8f9fc] rounded-xl p-1 border border-[#eef0f6]">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            active === opt.value
              ? 'bg-white text-[#1a1d2e] shadow-sm'
              : 'text-[#6b7194] hover:text-[#1a1d2e]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
