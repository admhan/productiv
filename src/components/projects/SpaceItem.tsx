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
    if (spaceName.trim() && spaceName !== space.name) {
      onRenameSpace(space.id, spaceName.trim());
    }
    setEditing(false);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3.5 group">
        <button onClick={() => setExpanded(!expanded)} className="text-[#9ca3c4] hover:text-[#1a1d2e] transition-colors">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {editing && isOwner ? (
          <input
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="flex-1 bg-transparent text-sm font-semibold text-[#1a1d2e] outline-none border-b-2 border-[#6c5ce7]"
            autoFocus
          />
        ) : (
          <span className="flex-1 text-sm font-semibold text-[#1a1d2e]">{space.name}</span>
        )}

        <span className="text-xs text-[#9ca3c4] font-medium">{filtered.length} projects</span>

        {isOwner && (
          <>
            <button
              onClick={() => setAdding(true)}
              className="opacity-0 group-hover:opacity-100 text-[#9ca3c4] hover:text-[#6c5ce7] p-1 transition-all rounded-lg hover:bg-[#6c5ce7]/8"
              title="Add project"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 text-[#9ca3c4] hover:text-[#6b7194] p-1 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#e2e5ef] rounded-xl shadow-lg py-1 z-20 min-w-[120px]">
                  <button
                    onClick={() => { setEditing(true); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#1a1d2e] hover:bg-[#f8f9fc] flex items-center gap-2"
                  >
                    <Pencil className="w-3 h-3" /> Rename
                  </button>
                  <button
                    onClick={() => { onDeleteSpace(space.id); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#ff6b6b] hover:bg-[#fff5f5] flex items-center gap-2"
                  >
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
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                placeholder="Project name..."
                className="flex-1 px-3.5 py-2 bg-[#f8f9fc] border border-[#e2e5ef] rounded-xl text-sm text-[#1a1d2e] placeholder-[#9ca3c4] outline-none focus:border-[#6c5ce7]"
                autoFocus
              />
              <button onClick={handleAddProject} className="px-3.5 py-2 bg-[#6c5ce7] hover:bg-[#5a4bd6] text-white text-xs rounded-xl transition-colors font-medium">
                Add
              </button>
              <button onClick={() => { setAdding(false); setNewName(''); }} className="px-3.5 py-2 bg-[#f8f9fc] text-[#6b7194] text-xs rounded-xl hover:bg-[#f1f3f9]">
                Cancel
              </button>
            </div>
          )}
          {filtered.length === 0 && <p className="px-4 py-3 text-xs text-[#9ca3c4]">No projects</p>}
          {filtered.map((project) => (
            <ProjectItem key={project.id} project={project} tasks={tasks} isOwner={isOwner} onUpdate={onUpdateProject} onDelete={onDeleteProject} />
          ))}
        </div>
      )}
    </div>
  );
}
