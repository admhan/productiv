import type { CalendarEvent } from '../types';

function parseIcsDate(value: string): Date {
  const clean = value.replace(/[^0-9T]/g, '');
  if (clean.length >= 15) {
    const y = clean.slice(0, 4);
    const m = clean.slice(4, 6);
    const d = clean.slice(6, 8);
    const h = clean.slice(9, 11);
    const min = clean.slice(11, 13);
    const s = clean.slice(13, 15);
    return new Date(`${y}-${m}-${d}T${h}:${min}:${s}`);
  }
  if (clean.length >= 8) {
    const y = clean.slice(0, 4);
    const m = clean.slice(4, 6);
    const d = clean.slice(6, 8);
    return new Date(`${y}-${m}-${d}T00:00:00`);
  }
  return new Date(value);
}

export function parseIcs(text: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const blocks = text.split('BEGIN:VEVENT');

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split('END:VEVENT')[0];
    const lines = block.split(/\r?\n/);

    let summary = '';
    let dtstart = '';
    let dtend = '';
    let description = '';
    let uid = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('SUMMARY:')) summary = trimmed.slice(8);
      else if (trimmed.startsWith('SUMMARY;')) summary = trimmed.split(':').slice(1).join(':');
      else if (trimmed.startsWith('DTSTART:')) dtstart = trimmed.slice(8);
      else if (trimmed.startsWith('DTSTART;')) dtstart = trimmed.split(':').slice(1).join(':');
      else if (trimmed.startsWith('DTEND:')) dtend = trimmed.slice(6);
      else if (trimmed.startsWith('DTEND;')) dtend = trimmed.split(':').slice(1).join(':');
      else if (trimmed.startsWith('DESCRIPTION:')) description = trimmed.slice(12);
      else if (trimmed.startsWith('UID:')) uid = trimmed.slice(4);
    }

    if (summary && dtstart) {
      const start = parseIcsDate(dtstart);
      const end = dtend ? parseIcsDate(dtend) : new Date(start.getTime() + 3600000);
      events.push({
        id: uid || crypto.randomUUID(),
        summary,
        start,
        end,
        description: description.replace(/\\n/g, '\n').replace(/\\,/g, ','),
      });
    }
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}
