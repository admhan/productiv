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

export function ProjectPortfolio({
  data,
  isOwner,
  onAddSpace,
  onRenameSpace,
  onDeleteSpace,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}: ProjectPortfolioProps) {
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
          <button
            onClick={() => setAddingSpace(true)}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors duration-150"
          >
            <Plus className="w-4 h-4" />
            New Space
          </button>
        )}
      </div>

      {addingSpace && isOwner && (
        <div className="flex gap-2">
          <input
            value={newSpaceName}
            onChange={(e) => setNewSpaceName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSpace()}
            placeholder="Space name..."
            className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500"
            autoFocus
          />
          <button onClick={handleAddSpace} className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors">
            Create
          </button>
          <button onClick={() => { setAddingSpace(false); setNewSpaceName(''); }} className="px-4 py-2.5 bg-zinc-800 text-zinc-400 text-sm rounded-lg hover:bg-zinc-700">
            Cancel
          </button>
        </div>
      )}

      {data.spaces.length === 0 && (
        <div className="text-center py-12 text-zinc-600">
          <p className="text-sm">No spaces yet</p>
          {isOwner && <p className="text-xs mt-1">Create a space to organize your projects</p>}
        </div>
      )}

      {data.spaces.map((space) => (
        <SpaceItem
          key={space.id}
          space={space}
          projects={data.projects.filter((p) => p.spaceId === space.id)}
          tasks={data.tasks}
          isOwner={isOwner}
          statusFilter={statusFilter}
          onAddProject={onAddProject}
          onUpdateProject={onUpdateProject}
          onDeleteProject={onDeleteProject}
          onRenameSpace={onRenameSpace}
          onDeleteSpace={onDeleteSpace}
        />
      ))}
    </div>
  );
}
