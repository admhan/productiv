import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import type { CalendarEvent } from '../../types';
import { parseIcs } from '../../services/icsParser';

interface AgendaViewProps {
  isOwner: boolean;
}

function getWeekDays(baseDate: Date): Date[] {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AgendaView({ isOwner }: AgendaViewProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [icsText, setIcsText] = useState('');

  const baseDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const weekDays = useMemo(() => getWeekDays(baseDate), [baseDate]);
  const today = new Date();

  const handleImport = () => {
    if (!icsText.trim()) return;
    const parsed = parseIcs(icsText);
    setEvents((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const newEvents = parsed.filter((e) => !existingIds.has(e.id));
      return [...prev, ...newEvents];
    });
    setIcsText('');
    setShowImport(false);
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-300">Weekly Agenda</h3>
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={() => setShowImport(!showImport)}
              className="text-zinc-500 hover:text-indigo-400 transition-colors p-1"
              title="Import .ics"
            >
              <Upload className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setWeekOffset((w) => w - 1)} className="text-zinc-500 hover:text-zinc-300 p-1">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="text-xs text-zinc-500 hover:text-zinc-300 px-2"
          >
            Today
          </button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="text-zinc-500 hover:text-zinc-300 p-1">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showImport && isOwner && (
        <div className="mb-4 space-y-2">
          <textarea
            value={icsText}
            onChange={(e) => setIcsText(e.target.value)}
            placeholder="Paste .ics content here..."
            className="w-full h-24 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 placeholder-zinc-600 outline-none focus:border-indigo-500 resize-none font-mono"
          />
          <button
            onClick={handleImport}
            className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded-lg transition-colors"
          >
            Import Events
          </button>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === today.toDateString();
          const dayEvents = events.filter((e) => e.start.toDateString() === day.toDateString());

          return (
            <div key={i} className="min-h-[80px]">
              <div className={`text-center mb-1 ${isToday ? 'text-indigo-400' : 'text-zinc-500'}`}>
                <div className="text-[10px] uppercase">{dayLabels[i]}</div>
                <div
                  className={`text-sm font-medium ${
                    isToday ? 'bg-indigo-500 text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto' : ''
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
              <div className="space-y-0.5">
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="px-1.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] text-indigo-300 truncate"
                    title={`${ev.summary}\n${formatTime(ev.start)} - ${formatTime(ev.end)}`}
                  >
                    {ev.summary}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
