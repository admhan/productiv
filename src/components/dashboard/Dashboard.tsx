import { InboxCapture } from './InboxCapture';
import { TaskList } from './TaskList';
import { PomodoroTimer } from './PomodoroTimer';
import { AgendaView } from './AgendaView';
import type { Task, Priority, AppData } from '../../types';

interface DashboardProps {
  data: AppData;
  isOwner: boolean;
  onAddTask: (title: string, priority: Priority, projectId: string | null) => void;
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'priority' | 'projectId'>>) => void;
  onDeleteTask: (id: string) => void;
  onAddInbox: (text: string) => void;
  onRemoveInbox: (id: string) => void;
  onLinkInboxToMeeting: (inboxId: string, meetingId: string) => void;
}

export function Dashboard({
  data,
  isOwner,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onAddInbox,
  onRemoveInbox,
  onLinkInboxToMeeting,
}: DashboardProps) {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InboxCapture
            inbox={data.inbox}
            notes={data.notes}
            isOwner={isOwner}
            onAdd={onAddInbox}
            onRemove={onRemoveInbox}
            onLinkToMeeting={onLinkInboxToMeeting}
            onConvertToTask={(text) => onAddTask(text, 'medium', null)}
          />
          <TaskList
            tasks={data.tasks}
            projects={data.projects}
            isOwner={isOwner}
            onAdd={onAddTask}
            onToggle={onToggleTask}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        </div>
        <div className="space-y-6">
          <PomodoroTimer />
          <AgendaView isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
}
