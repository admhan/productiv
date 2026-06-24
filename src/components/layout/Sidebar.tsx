import { LayoutDashboard, FolderKanban, StickyNote, BookOpen, Settings, LogOut, Zap } from 'lucide-react';

export type TabId = 'dashboard' | 'projects' | 'notes' | 'logbook' | 'settings';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isOwner: boolean;
  onLogout: () => void;
}

const navItems: { id: TabId; label: string; icon: typeof LayoutDashboard; ownerOnly?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'logbook', label: 'Logbook', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings, ownerOnly: true },
];

export function Sidebar({ activeTab, onTabChange, isOwner, onLogout }: SidebarProps) {
  const visibleItems = navItems.filter((item) => !item.ownerOnly || isOwner);

  return (
    <aside className="w-60 h-screen bg-white/80 backdrop-blur-xl border-r border-[#e2e5ef] flex flex-col shrink-0">
      <div className="p-5 border-b border-[#eef0f6]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-[#1a1d2e]">Productiv</h1>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-[#6c5ce7]/10 to-[#6c5ce7]/5 text-[#6c5ce7] shadow-sm'
                  : 'text-[#6b7194] hover:text-[#1a1d2e] hover:bg-[#f8f9fc]'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#eef0f6]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#9ca3c4] hover:text-[#ff6b6b] hover:bg-[#fff5f5] transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
