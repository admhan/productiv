import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import type { Task, Note, Project, InboxItem, AppData } from '../../types';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  data: AppData;
  isOwner: boolean;
  onAddInboxItem: (text: string) => void;
  onNavigate: (tab: string) => void;
}

type ResultItem =
  | { type: 'task'; item: Task }
  | { type: 'note'; item: Note }
  | { type: 'project'; item: Project }
  | { type: 'inbox'; item: InboxItem }
  | { type: 'action'; label: string; tab: string };

export function CommandPalette({ open, onClose, data, isOwner, onAddInboxItem, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  if (!open) return null;

  const q = query.toLowerCase().trim();
  const results: ResultItem[] = [];

  if (q) {
    data.tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 5).forEach((item) => results.push({ type: 'task', item }));
    data.notes.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)).slice(0, 5).forEach((item) => results.push({ type: 'note', item }));
    data.projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5).forEach((item) => results.push({ type: 'project', item }));
  } else {
    results.push(
      { type: 'action', label: 'Go to Dashboard', tab: 'dashboard' },
      { type: 'action', label: 'Go to Projects', tab: 'projects' },
      { type: 'action', label: 'Go to Notes', tab: 'notes' },
      { type: 'action', label: 'Go to Logbook', tab: 'logbook' },
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && q && isOwner) { onAddInboxItem(q); onClose(); }
  };

  const handleClick = (r: ResultItem) => {
    onNavigate(r.type === 'action' ? r.tab : r.type === 'task' ? 'dashboard' : r.type === 'note' ? 'notes' : 'projects');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
      <div
        className="relative w-full max-w-[480px] rounded-xl overflow-hidden"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-11" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Search className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
          <input
            ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={isOwner ? 'Search or capture to inbox…' : 'Search…'}
            className="flex-1 bg-transparent text-[13px] outline-none"
            style={{ color: 'var(--color-text-primary)' }}
          />
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X className="w-4 h-4" /></button>
        </div>
        <div className="max-h-[240px] overflow-y-auto py-1">
          {results.length === 0 && q && (
            <div className="px-4 py-6 text-center text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
              {isOwner ? 'Press Enter to capture to inbox' : 'No results'}
            </div>
          )}
          {results.map((r, i) => (
            <button key={i} onClick={() => handleClick(r)}
              className="w-full text-left px-4 h-9 flex items-center gap-3 transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span className="text-[10px] uppercase tracking-wider w-12 shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                {r.type === 'action' ? 'nav' : r.type}
              </span>
              <span className="text-[13px] truncate">
                {r.type === 'action' ? r.label : r.type === 'task' ? r.item.title : r.type === 'note' ? r.item.title : r.type === 'project' ? r.item.name : r.item.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
