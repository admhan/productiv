import { useCallback } from 'react';
import type { Space, Project, ProjectStatus, AppData } from '../types';

export function useProjects(data: AppData, setData: (fn: (prev: AppData) => AppData) => void) {
  const spaces = data.spaces;
  const projects = data.projects;

  const addSpace = useCallback(
    (name: string) => {
      const space: Space = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
      setData((prev) => ({ ...prev, spaces: [...prev.spaces, space] }));
    },
    [setData]
  );

  const renameSpace = useCallback(
    (id: string, name: string) => {
      setData((prev) => ({
        ...prev,
        spaces: prev.spaces.map((s) => (s.id === id ? { ...s, name } : s)),
      }));
    },
    [setData]
  );

  const deleteSpace = useCallback(
    (id: string) => {
      setData((prev) => {
        const projectIds = prev.projects.filter((p) => p.spaceId === id).map((p) => p.id);
        return {
          ...prev,
          spaces: prev.spaces.filter((s) => s.id !== id),
          projects: prev.projects.filter((p) => p.spaceId !== id),
          tasks: prev.tasks.map((t) => (t.projectId && projectIds.includes(t.projectId) ? { ...t, projectId: null } : t)),
        };
      });
    },
    [setData]
  );

  const addProject = useCallback(
    (name: string, spaceId: string) => {
      const project: Project = {
        id: crypto.randomUUID(),
        name,
        spaceId,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setData((prev) => ({ ...prev, projects: [...prev.projects, project] }));
    },
    [setData]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Pick<Project, 'name' | 'status'>>) => {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    },
    [setData]
  );

  const deleteProject = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
        tasks: prev.tasks.map((t) => (t.projectId === id ? { ...t, projectId: null } : t)),
      }));
    },
    [setData]
  );

  const getProjectsBySpace = useCallback(
    (spaceId: string) => projects.filter((p) => p.spaceId === spaceId),
    [projects]
  );

  const filterByStatus = useCallback(
    (status: ProjectStatus | 'all') => (status === 'all' ? projects : projects.filter((p) => p.status === status)),
    [projects]
  );

  return { spaces, projects, addSpace, renameSpace, deleteSpace, addProject, updateProject, deleteProject, getProjectsBySpace, filterByStatus };
}
