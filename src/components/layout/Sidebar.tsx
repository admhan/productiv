import { LayoutDashboard, FolderKanban, StickyNote, BookOpen, Settings, LogOut } from 'lucide-react';

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
    <aside className="w-56 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
      <div className="p-5 border-b border-zinc-800">
        <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Productiv
        </h1>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                active
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
