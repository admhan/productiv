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
  return (
    <aside
      className="w-[220px] h-full flex flex-col shrink-0"
      style={{ background: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)' }}
    >
      <div className="h-[52px] flex items-center px-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <span className="text-[15px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>Productiv</span>
      </div>

      <nav className="flex-1 py-2 px-2 space-y-px">
        {navItems.filter((item) => !item.ownerOnly || isOwner).map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="w-full flex items-center gap-2.5 h-8 px-2.5 rounded-md text-[13px] font-medium transition-colors"
              style={{
                background: active ? 'var(--color-bg-active)' : 'transparent',
                color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon className="w-4 h-4" style={{ opacity: active ? 1 : 0.6 }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-2 pb-3" style={{ borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 h-8 px-2.5 rounded-md text-[13px] font-medium mt-2 transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-danger)'; e.currentTarget.style.background = 'var(--color-danger-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
