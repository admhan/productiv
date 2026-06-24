import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { useProjects } from './hooks/useProjects';
import { useNotes } from './hooks/useNotes';
import { loadData, saveData } from './services/storage';
import { AuthGate } from './components/auth/AuthGate';
import { GuestBanner } from './components/auth/GuestBanner';
import { Sidebar } from './components/layout/Sidebar';
import type { TabId } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { CommandPalette } from './components/layout/CommandPalette';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectPortfolio } from './components/projects/ProjectPortfolio';
import { NotesCenter } from './components/notes/NotesCenter';
import { Logbook } from './components/logbook/Logbook';
import { Settings } from './components/settings/Settings';
import type { AppData, InboxItem } from './types';

export default function App() {
  const { authenticated, isOwner, login, enterGuest, logout } = useAuth();
  const [data, setDataState] = useState<AppData>(loadData);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [commandOpen, setCommandOpen] = useState(false);

  const setData = useCallback((fn: (prev: AppData) => AppData) => {
    setDataState((prev) => {
      const next = fn(prev);
      saveData(next);
      return next;
    });
  }, []);

  const { addTask, toggleTask, updateTask, deleteTask } = useTasks(data, setData);
  const { addSpace, renameSpace, deleteSpace, addProject, updateProject, deleteProject } = useProjects(data, setData);
  const { addNote, updateNote, deleteNote } = useNotes(data, setData);

  const addInboxItem = useCallback(
    (text: string) => {
      const item: InboxItem = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString(), linkedMeetingId: null };
      setData((prev) => ({ ...prev, inbox: [item, ...prev.inbox] }));
    },
    [setData]
  );

  const removeInboxItem = useCallback(
    (id: string) => {
      setData((prev) => ({ ...prev, inbox: prev.inbox.filter((i) => i.id !== id) }));
    },
    [setData]
  );

  const linkInboxToMeeting = useCallback(
    (inboxId: string, meetingId: string) => {
      setData((prev) => ({
        ...prev,
        inbox: prev.inbox.map((i) => (i.id === inboxId ? { ...i, linkedMeetingId: meetingId } : i)),
      }));
    },
    [setData]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!authenticated) {
    return <AuthGate onLogin={login} onGuest={enterGuest} />;
  }

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOwner={isOwner} onLogout={logout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isOwner && <GuestBanner />}
        <TopBar activeTab={activeTab} onOpenCommand={() => setCommandOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              data={data}
              isOwner={isOwner}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onAddInbox={addInboxItem}
              onRemoveInbox={removeInboxItem}
              onLinkInboxToMeeting={linkInboxToMeeting}
            />
          )}
          {activeTab === 'projects' && (
            <ProjectPortfolio
              data={data}
              isOwner={isOwner}
              onAddSpace={addSpace}
              onRenameSpace={renameSpace}
              onDeleteSpace={deleteSpace}
              onAddProject={addProject}
              onUpdateProject={updateProject}
              onDeleteProject={deleteProject}
            />
          )}
          {activeTab === 'notes' && (
            <NotesCenter
              data={data}
              isOwner={isOwner}
              onAddNote={addNote}
              onUpdateNote={updateNote}
              onDeleteNote={deleteNote}
              onConvertToTask={addTask}
            />
          )}
          {activeTab === 'logbook' && <Logbook data={data} />}
          {activeTab === 'settings' && isOwner && (
            <Settings onImport={(imported) => setDataState(imported)} />
          )}
        </main>
      </div>
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        data={data}
        isOwner={isOwner}
        onAddInboxItem={addInboxItem}
        onNavigate={(tab) => setActiveTab(tab as TabId)}
      />
    </div>
  );
}
