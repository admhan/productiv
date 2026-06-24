export type Priority = 'high' | 'medium' | 'low';
export type ProjectStatus = 'active' | 'on-hold' | 'done';
export type NoteType = 'note' | 'meeting';
export type AuthRole = 'owner' | 'guest';
export type LogbookFilter = 'today' | 'week' | 'all';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  projectId: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface InboxItem {
  id: string;
  text: string;
  createdAt: string;
  linkedMeetingId: string | null;
}

export interface Space {
  id: string;
  name: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  spaceId: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  type: NoteType;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
  meetingDate: string | null;
  participants: string[];
  decisions: string[];
  actionItems: string[];
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: Date;
  end: Date;
  description: string;
}

export interface AppData {
  tasks: Task[];
  inbox: InboxItem[];
  spaces: Space[];
  projects: Project[];
  notes: Note[];
}
