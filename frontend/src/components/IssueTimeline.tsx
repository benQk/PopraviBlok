import { useEffect, useState } from 'react';
import { CheckCircle2, FilePlus, GitMerge, Hammer, Lock, RotateCcw, UserCheck, XCircle, type LucideIcon } from 'lucide-react';
import { listIssueEvents } from '../lib/api/issues';
import { STATUS_LABEL } from '../lib/issueLabels';
import type { Enums } from '../lib/database.types';

type Status = Enums<'issue_status'>;
type Ev = Awaited<ReturnType<typeof listIssueEvents>>[number];

const ICONS: Record<Status, LucideIcon> = {
  NEW: FilePlus, ASSIGNED: UserCheck, IN_PROGRESS: Hammer, RESOLVED: CheckCircle2,
  CLOSED: Lock, REOPENED: RotateCcw, REJECTED: XCircle, MERGED: GitMerge,
};

function eventTitle(ev: Ev) {
  if (ev.from_status === null) return 'Prijava oddana';
  if (ev.from_status === 'ASSIGNED' && ev.to_status === 'NEW') return 'Serviser je zavrnil nalog';
  return STATUS_LABEL[ev.to_status].text;
}

export default function IssueTimeline({ issueId }: { issueId: string }) {
  const [events, setEvents] = useState<Ev[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listIssueEvents(issueId).then(setEvents).catch((e) => setError((e as Error).message));
  }, [issueId]);

  if (error) return <p className="field-error" role="alert">{error}</p>;
  if (!events) return <p>Nalaganje …</p>;

  return (
    <ol className="timeline">
      {events.map((ev) => {
        const Icon = ICONS[ev.to_status];
        return (
          <li key={ev.id} className={`tl-item tl-${STATUS_LABEL[ev.to_status].tone}`}>
            <span className="tl-dot"><Icon size={16} aria-hidden /></span>
            <div className="tl-body">
              <div className="tl-head">
                <strong>{eventTitle(ev)}</strong>
                <time dateTime={ev.created_at}>{new Date(ev.created_at).toLocaleString('sl-SI')}</time>
              </div>
              {ev.actor?.full_name && <p className="tl-actor">{ev.actor.full_name}</p>}
              {ev.note && <p className="tl-note">{ev.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}