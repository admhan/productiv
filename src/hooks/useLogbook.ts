import { useMemo } from 'react';
import type { Task, LogbookFilter, AppData } from '../types';

export function useLogbook(data: AppData) {
  const completedTasks = useMemo(
    () =>
      data.tasks
        .filter((t): t is Task & { completedAt: string } => t.completed && t.completedAt !== null)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()),
    [data.tasks]
  );

  const filterTasks = (filter: LogbookFilter, projectId: string | null) => {
    let filtered = completedTasks;
    if (projectId) {
      filtered = filtered.filter((t) => t.projectId === projectId);
    }
    const now = new Date();
    if (filter === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter((t) => new Date(t.completedAt) >= start);
    } else if (filter === 'week') {
      const start = new Date(now);
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((t) => new Date(t.completedAt) >= start);
    }
    return filtered;
  };

  return { completedTasks, filterTasks };
}
