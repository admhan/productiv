import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Space, Project, ProjectStatus, Task } from '../../types';
import { ProjectItem } from './ProjectItem';

interface SpaceItemProps {
  space: Space;
  projects: Project[];
  tasks: Task[];
  isOwner: boolean;
  statusFilter: ProjectStatus | 'all';
  onAddProject: (name: string, spaceId: string) => void;
  onUpdateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'status'>>) => void;
  onDeleteProject: (id: string) => void;
  onRenameSpace: (id: string, name: string) => void;
  onDeleteSpace: (id: string) => void;
}

export function SpaceItem({
  space, projects, tasks, isOwner, statusFilter,
  onAddProject, onUpdateProject, onDeleteProject, onRenameSpace, onDeleteSpace,
}: SpaceItemProps) {
  const [expanded, setExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(false);
  const [spaceName, setSpaceName] = useState(space.name);

  const filtered = statusFilter === 'all' ? projects : projects.filter((p) => p.status === statusFilter);

  const handleAddProject = () => {
    if (!newName.trim()) return;
    onAddProject(newName.trim(), space.id);
    setNewName('');
    setAdding(false);
  };

  const handleRename = () => {
    if (spaceName.trim() && spaceName !== space.name) onRenameSpace(space.id, spaceName.trim());
    setEditing(false);
  };

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center gap-2 px-4 py-3 group">
        <button onClick={() => setExpanded(!expanded)} style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {editing && isOwner ? (
          <input value={spaceName} onChange={(e) => setSpaceName(e.target.value)} onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()} autoFocus
            className="flex-1 bg-transparent text-[13px] font-semibold outline-none"
            style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-accent)' }} />
        ) : (
          <span className="flex-1 text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>{space.name}</span>
        )}

        <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-muted)' }}>{filtered.length} projects</span>

        {isOwner && (
          <>
            <button onClick={() => setAdding(true)} title="Add project"
              className="opacity-0 group-hover:opacity-100 p-1 transition-all"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
              <Plus className="w-4 h-4" />
            </button>
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 p-1 transition-all"
                style={{ color: 'var(--color-text-muted)' }}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 rounded-lg py-1 z-20 min-w-[120px]"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                  <button onClick={() => { setEditing(true); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-[12px] flex items-center gap-2 transition-colors"
                    style={{ color: 'var(--color-text-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <Pencil className="w-3 h-3" /> Rename
                  </button>
                  <button onClick={() => { onDeleteSpace(space.id); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-[12px] flex items-center gap-2 transition-colors"
                    style={{ color: 'var(--color-danger)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-danger-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {expanded && (
        <div>
          {adding && isOwner && (
            <div className="px-4 py-2 flex gap-2">
              <input value={newName} onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddProject()} placeholder="Project name..." autoFocus
                className="flex-1 h-9 px-3 rounded-md text-[13px] outline-none"
                style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              <button onClick={handleAddProject} className="h-9 px-3 rounded-md text-[13px] font-medium text-white"
                style={{ background: 'var(--color-accent)' }}>Add</button>
              <button onClick={() => { setAdding(false); setNewName(''); }}
                className="h-9 px-3 rounded-md text-[13px]"
                style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>Cancel</button>
            </div>
          )}
          {filtered.length === 0 && <p className="px-4 py-3 text-[12px]" style={{ color: 'var(--color-text-muted)' }}>No projects</p>}
          {filtered.map((project) => (
            <ProjectItem key={project.id} project={project} tasks={tasks} isOwner={isOwner} onUpdate={onUpdateProject} onDelete={onDeleteProject} />
          ))}
        </div>
      )}
    </div>
  );
}
