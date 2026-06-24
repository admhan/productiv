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
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const q = query.toLowerCase().trim();

  const results: ResultItem[] = [];

  if (q) {
    data.tasks
      .filter((t) => t.title.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((item) => results.push({ type: 'task', item }));

    data.notes
      .filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((item) => results.push({ type: 'note', item }));

    data.projects
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((item) => results.push({ type: 'project', item }));
  } else {
    results.push(
      { type: 'action', label: 'Go to Dashboard', tab: 'dashboard' },
      { type: 'action', label: 'Go to Projects', tab: 'projects' },
      { type: 'action', label: 'Go to Notes', tab: 'notes' },
      { type: 'action', label: 'Go to Logbook', tab: 'logbook' }
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && q && isOwner) {
      onAddInboxItem(q);
      onClose();
    }
  };

  const handleResultClick = (r: ResultItem) => {
    if (r.type === 'action') {
      onNavigate(r.tab);
    } else if (r.type === 'task') {
      onNavigate('dashboard');
    } else if (r.type === 'note') {
      onNavigate('notes');
    } else if (r.type === 'project') {
      onNavigate('projects');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-[#1a1d2e]/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-white border border-[#e2e5ef] rounded-2xl shadow-2xl shadow-[#6c5ce7]/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-[#eef0f6]">
          <Search className="w-4 h-4 text-[#9ca3c4]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isOwner ? 'Search or type to capture to inbox...' : 'Search...'}
            className="flex-1 py-3.5 bg-transparent text-[#1a1d2e] placeholder-[#9ca3c4] outline-none text-sm"
          />
          <button onClick={onClose} className="text-[#9ca3c4] hover:text-[#6b7194] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto py-2">
          {results.length === 0 && q && (
            <div className="px-4 py-6 text-center text-[#9ca3c4] text-sm">
              {isOwner ? 'Press Enter to capture to inbox' : 'No results found'}
            </div>
          )}
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => handleResultClick(r)}
              className="w-full text-left px-4 py-2.5 hover:bg-[#f8f9fc] transition-colors duration-100 flex items-center gap-3"
            >
              <span className="text-[10px] uppercase tracking-wider text-[#9ca3c4] font-semibold w-14 shrink-0">
                {r.type === 'action' ? 'nav' : r.type}
              </span>
              <span className="text-sm text-[#1a1d2e] truncate">
                {r.type === 'action' ? r.label : r.type === 'task' ? r.item.title : r.type === 'note' ? r.item.title : r.type === 'project' ? r.item.name : r.item.text}
              </span>
            </button>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-[#eef0f6] text-[11px] text-[#9ca3c4] flex gap-4">
          <span><kbd className="text-[#6b7194] bg-[#f8f9fc] px-1 rounded">↵</kbd> {isOwner ? 'capture' : 'select'}</span>
          <span><kbd className="text-[#6b7194] bg-[#f8f9fc] px-1 rounded">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
