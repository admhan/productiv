import { useCallback } from 'react';
import type { Task, Priority, AppData } from '../types';

export function useTasks(data: AppData, setData: (fn: (prev: AppData) => AppData) => void) {
  const tasks = data.tasks;

  const addTask = useCallback(
    (title: string, priority: Priority, projectId: string | null) => {
      const task: Task = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        priority,
        projectId,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      setData((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
    },
    [setData]
  );

  const toggleTask = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id
            ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null }
            : t
        ),
      }));
    },
    [setData]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Pick<Task, 'title' | 'priority' | 'projectId'>>) => {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));
    },
    [setData]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
    },
    [setData]
  );

  const getTasksByProject = useCallback(
    (projectId: string) => tasks.filter((t) => t.projectId === projectId),
    [tasks]
  );

  return { tasks, addTask, toggleTask, updateTask, deleteTask, getTasksByProject };
}
