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
          <button
            onClick={() => setAddingSpace(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#6c5ce7] to-[#a55eea] hover:from-[#5a4bd6] hover:to-[#9645d9] text-white text-sm rounded-xl transition-all duration-200 font-medium shadow-sm shadow-[#6c5ce7]/20"
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
            className="flex-1 px-4 py-2.5 bg-white border border-[#e2e5ef] rounded-xl text-sm text-[#1a1d2e] placeholder-[#9ca3c4] outline-none focus:border-[#6c5ce7] focus:shadow-[0_0_0_3px_rgba(108,92,231,0.08)]"
            autoFocus
          />
          <button onClick={handleAddSpace} className="px-4 py-2.5 bg-[#6c5ce7] hover:bg-[#5a4bd6] text-white text-sm rounded-xl transition-colors font-medium">Create</button>
          <button onClick={() => { setAddingSpace(false); setNewSpaceName(''); }} className="px-4 py-2.5 bg-[#f8f9fc] text-[#6b7194] text-sm rounded-xl hover:bg-[#f1f3f9]">Cancel</button>
        </div>
      )}

      {data.spaces.length === 0 && (
        <div className="text-center py-16 text-[#9ca3c4]">
          <p className="text-sm">No spaces yet</p>
          {isOwner && <p className="text-xs mt-1">Create a space to organize your projects</p>}
        </div>
      )}

      {data.spaces.map((space) => (
        <SpaceItem
          key={space.id} space={space}
          projects={data.projects.filter((p) => p.spaceId === space.id)}
          tasks={data.tasks} isOwner={isOwner} statusFilter={statusFilter}
          onAddProject={onAddProject} onUpdateProject={onUpdateProject} onDeleteProject={onDeleteProject}
          onRenameSpace={onRenameSpace} onDeleteSpace={onDeleteSpace}
        />
      ))}
    </div>
  );
}
