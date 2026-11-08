import { useState } from 'react';
import { STATUS_LABEL } from '../lib/issueLabels';
import type { Enums } from '../lib/database.types';
import TransitionModal from './TransitionModal';

type Status = Enums<'issue_status'>;
type Action = {
  to: Status; label: string; title: string; noteLabel: string;
  noteRequired: boolean; danger?: boolean;
};

const ACTIONS: Partial<Record<Status, Action[]>> = {
  NEW: [
    { to: 'REJECTED', label: 'Zavrni prijavo', title: 'Zavrnitev prijave',
      noteLabel: 'Razlog zavrnitve', noteRequired: true, danger: true },
  ],
};

type Props = { issueId: string; status: Status; onDone: (message: string) => void };

export default function StatusActions({ issueId, status, onDone }: Props) {
  const [active, setActive] = useState<Action | null>(null);
  const actions = ACTIONS[status];
  if (!actions) return null;

  return (
    <div className="card side-card">
      <h2>Dejanja</h2>
      <div className="status-actions">
        {actions.map((a) => (
          <button key={a.to} className={`btn btn-block ${a.danger ? 'btn-danger' : ''}`}
                  onClick={() => setActive(a)}>
            {a.label}
          </button>
        ))}
      </div>
      {active && (
        <TransitionModal
          issueId={issueId} to={active.to} title={active.title} noteLabel={active.noteLabel}
          noteRequired={active.noteRequired} submitLabel={active.label} danger={active.danger}
          onClose={() => setActive(null)}
          onDone={() => { setActive(null); onDone(`Status prijave je zdaj »${STATUS_LABEL[active.to].text}«.`); }}
        />
      )}
    </div>
  );
}