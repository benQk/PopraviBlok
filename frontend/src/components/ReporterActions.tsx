import { useState } from 'react';
import TransitionModal from './TransitionModal';

type Props = { issueId: string; onDone: (message: string) => void };

export default function ReporterActions({ issueId, onDone }: Props) {
  const [modal, setModal] = useState<'confirm' | 'reject' | null>(null);

  return (
    <div className="card side-card">
      <h2>Odprava težave</h2>
      <p className="hint" style={{ margin: '0 0 .85rem' }}>
        Serviser je označil težavo kot odpravljeno. Potrdite, če je res rešena, sicer odpravo zavrnite.
      </p>
      <div className="status-actions">
        <button className="btn btn-primary btn-block" onClick={() => setModal('confirm')}>Potrdi odpravo</button>
        <button className="btn btn-danger btn-block" onClick={() => setModal('reject')}>Zavrni odpravo</button>
      </div>

      {modal === 'confirm' && (
        <TransitionModal
          issueId={issueId} to="CLOSED" title="Potrditev odprave"
          noteLabel="Opomba (neobvezno)" noteRequired={false} submitLabel="Potrdi odpravo"
          onClose={() => setModal(null)}
          onDone={() => { setModal(null); onDone('Odprava je potrjena, prijava je zaprta.'); }}
        />
      )}
      {modal === 'reject' && (
        <TransitionModal
          issueId={issueId} to="REOPENED" title="Zavrnitev odprave"
          noteLabel="Zakaj težava ni odpravljena?" noteRequired minLength={10}
          submitLabel="Zavrni odpravo" danger
          onClose={() => setModal(null)}
          onDone={() => { setModal(null); onDone('Odprava je zavrnjena, prijava je ponovno odprta.'); }}
        />
      )}
    </div>
  );
}