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
  space,
  projects,
  tasks,
  isOwner,
  statusFilter,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onRenameSpace,
  onDeleteSpace,
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
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 group">
        <button onClick={() => setExpanded(!expanded)} className="text-zinc-500 hover:text-zinc-300">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {editing && isOwner ? (
          <input
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="flex-1 bg-transparent text-sm font-semibold text-zinc-100 outline-none border-b border-indigo-500"
            autoFocus
          />
        ) : (
          <span className="flex-1 text-sm font-semibold text-zinc-200">{space.name}</span>
        )}

        <span className="text-xs text-zinc-600">{filtered.length} projects</span>

        {isOwner && (
          <>
            <button
              onClick={() => setAdding(true)}
              className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-indigo-400 p-1 transition-all"
              title="Add project"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 p-1 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-20 min-w-[120px]">
                  <button
                    onClick={() => { setEditing(true); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 flex items-center gap-2"
                  >
                    <Pencil className="w-3 h-3" /> Rename
                  </button>
                  <button
                    onClick={() => { onDeleteSpace(space.id); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-700 flex items-center gap-2"
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
                className="flex-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500"
                autoFocus
              />
              <button
                onClick={handleAddProject}
                className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => { setAdding(false); setNewName(''); }}
                className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs rounded-lg hover:bg-zinc-700"
              >
                Cancel
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <p className="px-4 py-3 text-xs text-zinc-600">No projects</p>
          )}

          {filtered.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              tasks={tasks}
              isOwner={isOwner}
              onUpdate={onUpdateProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
