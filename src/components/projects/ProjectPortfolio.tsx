import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Project, ProjectStatus, AppData } from '../../types';
import { SpaceItem } from './SpaceItem';
import { ProjectFilter } from './ProjectFilter';

interface ProjectPortfolioProps {
  data: AppData;
  isOwner: boolean;
  onAddSpace: (name: string) => void;
  onRenameSpace: (id: string, name: string) => void;
  onDeleteSpace: (id: string) => void;
  onAddProject: (name: string, spaceId: string) => void;
  onUpdateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'status'>>) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectPortfolio({ data, isOwner, onAddSpace, onRenameSpace, onDeleteSpace, onAddProject, onUpdateProject, onDeleteProject }: ProjectPortfolioProps) {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [addingSpace, setAddingSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');

  const handleAddSpace = () => {
    if (!newSpaceName.trim()) return;
    onAddSpace(newSpaceName.trim());
    setNewSpaceName('');
    setAddingSpace(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <ProjectFilter active={statusFilter} onChange={setStatusFilter} />
        {isOwner && (
          <button onClick={() => setAddingSpace(true)}
            className="flex items-center gap-2 h-9 px-3 rounded-md text-[13px] font-medium text-white transition-colors"
            style={{ background: 'var(--color-accent)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-accent)'}>
            <Plus className="w-4 h-4" /> New Space
          </button>
        )}
      </div>

      {addingSpace && isOwner && (
        <div className="flex gap-2">
          <input value={newSpaceName} onChange={(e) => setNewSpaceName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSpace()} placeholder="Space name..." autoFocus
            className="flex-1 h-9 px-3 rounded-md text-[13px] outline-none"
            style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          <button onClick={handleAddSpace} className="h-9 px-3 rounded-md text-[13px] font-medium text-white"
            style={{ background: 'var(--color-accent)' }}>Create</button>
          <button onClick={() => { setAddingSpace(false); setNewSpaceName(''); }}
            className="h-9 px-3 rounded-md text-[13px]"
            style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>Cancel</button>
        </div>
      )}

      {data.spaces.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--color-text-muted)' }}>
          <p className="text-[13px]">No spaces yet</p>
          {isOwner && <p className="text-[12px] mt-1">Create a space to organize your projects</p>}
        </div>
      )}

      {data.spaces.map((space) => (
        <SpaceItem key={space.id} space={space}
          projects={data.projects.filter((p) => p.spaceId === space.id)}
          tasks={data.tasks} isOwner={isOwner} statusFilter={statusFilter}
          onAddProject={onAddProject} onUpdateProject={onUpdateProject} onDeleteProject={onDeleteProject}
          onRenameSpace={onRenameSpace} onDeleteSpace={onDeleteSpace} />
      ))}
    </div>
  );
}
