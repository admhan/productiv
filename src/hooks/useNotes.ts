import { useCallback } from 'react';
import type { Note, NoteType, AppData } from '../types';

export function useNotes(data: AppData, setData: (fn: (prev: AppData) => AppData) => void) {
  const notes = data.notes;

  const addNote = useCallback(
    (title: string, type: NoteType, projectId: string | null) => {
      const note: Note = {
        id: crypto.randomUUID(),
        title,
        body: '',
        tags: [],
        type,
        projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        meetingDate: type === 'meeting' ? new Date().toISOString().slice(0, 10) : null,
        participants: [],
        decisions: [],
        actionItems: [],
      };
      setData((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
      return note.id;
    },
    [setData]
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
      setData((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        ),
      }));
    },
    [setData]
  );

  const deleteNote = useCallback(
    (id: string) => {
      setData((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }));
    },
    [setData]
  );

  return { notes, addNote, updateNote, deleteNote };
}
