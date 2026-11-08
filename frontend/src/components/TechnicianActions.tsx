import { useState } from 'react';
import { transitionIssue } from '../lib/api/issues';
import type { Enums } from '../lib/database.types';
import TransitionModal from './TransitionModal';

type Props = {
  issueId: string;
  status: Enums<'issue_status'>;
  // leave = true: serviser prijave po dejanju ne vidi več (zavrnjen nalog)
  onDone: (message: string, leave: boolean) => void;
};

export default function TechnicianActions({ issueId, status, onDone }: Props) {
  const [modal, setModal] = useState<'reject' | 'resolve' | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status !== 'ASSIGNED' && status !== 'IN_PROGRESS') return null;

  async function accept() {
    setBusy(true);
    setError(null);
    try {
      await transitionIssue(issueId, 'IN_PROGRESS');
      onDone('Nalog je sprejet.', false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card side-card">
      <h2>Moj nalog</h2>
      <div className="status-actions">
        {status === 'ASSIGNED' && (
          <>
            <button className="btn btn-primary btn-block" onClick={accept} disabled={busy}>
              {busy ? 'Shranjujem…' : 'Sprejmi nalog'}
            </button>
            <button className="btn btn-danger btn-block" onClick={() => setModal('reject')} disabled={busy}>
              Zavrni nalog
            </button>
          </>
        )}
        {status === 'IN_PROGRESS' && (
          <button className="btn btn-primary btn-block" onClick={() => setModal('resolve')}>
            Označi kot odpravljeno
          </button>
        )}
      </div>
      {error && <p className="field-error" role="alert" style={{ marginTop: '.75rem' }}>{error}</p>}

      {modal === 'reject' && (
        <TransitionModal
          issueId={issueId} to="NEW" title="Zavrnitev naloga"
          noteLabel="Razlog zavrnitve" noteRequired submitLabel="Zavrni nalog" danger
          onClose={() => setModal(null)}
          onDone={() => { setModal(null); onDone('Nalog je zavrnjen in vrnjen upravniku.', true); }}
        />
      )}
      {modal === 'resolve' && (
        <TransitionModal
          issueId={issueId} to="RESOLVED" title="Težava odpravljena"
          noteLabel="Komentar (neobvezno)" noteRequired={false} submitLabel="Označi kot odpravljeno"
          onClose={() => setModal(null)}
          onDone={() => { setModal(null); onDone('Prijava je označena kot odpravljena.', false); }}
        />
      )}
    </div>
  );
}