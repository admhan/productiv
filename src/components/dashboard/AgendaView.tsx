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
    <div className="rounded-lg p-5" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>Weekly Agenda</h3>
        <div className="flex items-center gap-1">
          {isOwner && (
            <button onClick={() => setShowImport(!showImport)} title="Import .ics"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              className="p-1.5 rounded-md transition-colors">
              <Upload className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-1.5 rounded-md"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setWeekOffset(0)}
            className="text-[12px] px-2 py-1 rounded-md font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
            Today
          </button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-1.5 rounded-md"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showImport && isOwner && (
        <div className="mb-4 space-y-2">
          <textarea value={icsText} onChange={(e) => setIcsText(e.target.value)}
            placeholder="Paste .ics content here..."
            className="w-full h-24 px-3 py-2 rounded-md text-[12px] outline-none resize-none font-mono"
            style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          <button onClick={handleImport}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white"
            style={{ background: 'var(--color-accent)' }}>
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
              <div className="text-center mb-1.5" style={{ color: isToday ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                <div className="text-[10px] uppercase font-semibold">{dayLabels[i]}</div>
                <div className={`text-[13px] font-medium ${isToday ? 'text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto' : ''}`}
                  style={isToday ? { background: 'var(--color-accent)' } : {}}>
                  {day.getDate()}
                </div>
              </div>
              <div className="space-y-0.5">
                {dayEvents.map((ev) => (
                  <div key={ev.id}
                    className="px-1.5 py-1 rounded text-[10px] truncate font-medium"
                    style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-muted)' }}
                    title={`${ev.summary}\n${formatTime(ev.start)} - ${formatTime(ev.end)}`}>
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
