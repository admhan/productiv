import { Search, Command } from 'lucide-react';
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
    <header className="h-14 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <h2 className="text-lg font-semibold text-zinc-100">{titles[activeTab]}</h2>
      <button
        onClick={onOpenCommand}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors duration-150"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search</span>
        <kbd className="flex items-center gap-0.5 text-xs text-zinc-500 ml-2">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>
    </header>
  );
}
