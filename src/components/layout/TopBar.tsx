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
    <header className="h-14 border-b border-[#eef0f6] bg-white/60 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
      <h2 className="text-lg font-semibold text-[#1a1d2e]">{titles[activeTab]}</h2>
      <button
        onClick={onOpenCommand}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f8f9fc] hover:bg-[#f1f3f9] border border-[#e2e5ef] text-[#6b7194] text-sm transition-all duration-200 hover:shadow-sm"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search</span>
        <kbd className="flex items-center gap-0.5 text-xs text-[#9ca3c4] ml-2 bg-white px-1.5 py-0.5 rounded-md border border-[#e2e5ef]">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>
    </header>
  );
}
