import type { Enums } from './database.types';

export const STATUS_LABEL: Record<Enums<'issue_status'>, { text: string; tone: 'info' | 'warn' | 'ok' | 'muted' }> = {
  NEW: { text: 'Nova', tone: 'info' },
  ASSIGNED: { text: 'Dodeljena', tone: 'info' },
  IN_PROGRESS: { text: 'V delu', tone: 'warn' },
  RESOLVED: { text: 'Rešena', tone: 'ok' },
  CLOSED: { text: 'Zaprta', tone: 'muted' },
  REOPENED: { text: 'Ponovno odprta', tone: 'warn' },
  REJECTED: { text: 'Zavrnjena', tone: 'muted' },
  MERGED: { text: 'Združena', tone: 'muted' },
};

export const PRIORITY_LABEL: Record<Enums<'issue_priority'>, string> = {
  LOW: 'Nizka', NORMAL: 'Običajna', URGENT: 'Nujno',
};