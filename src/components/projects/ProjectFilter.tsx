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
    <div className="flex items-center gap-0.5 rounded-md p-0.5" style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
      {options.map((opt) => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
          style={{
            background: active === opt.value ? 'var(--color-bg-hover)' : 'transparent',
            color: active === opt.value ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          }}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
