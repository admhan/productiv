import { Search } from 'lucide-react';
import type { TabId } from './Sidebar';

interface TopBarProps {
  activeTab: TabId;
  onOpenCommand: () => void;
}

const titles: Record<TabId, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  notes: 'Notes & Meetings',
  logbook: 'Logbook',
  settings: 'Settings',
};

export function TopBar({ activeTab, onOpenCommand }: TopBarProps) {
  return (
    <header
      className="h-[52px] flex items-center justify-between px-6 shrink-0"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <h2 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {titles[activeTab]}
      </h2>
      <button
        onClick={onOpenCommand}
        className="flex items-center gap-2 h-8 px-3 rounded-md text-[12px] transition-colors"
        style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
      >
        <Search className="w-3.5 h-3.5" />
        Search
        <kbd className="text-[11px] ml-1.5 opacity-50">⌘K</kbd>
      </button>
    </header>
  );
}
