import { useState, type FormEvent } from 'react';
import { transitionIssue } from '../lib/api/issues';
import type { Enums } from '../lib/database.types';
import Modal from './Modal';

type Props = {
  issueId: string;
  to: Enums<'issue_status'>;
  title: string;
  noteLabel: string;
  noteRequired: boolean;
  submitLabel: string;
  danger?: boolean;
  onClose: () => void;
  onDone: () => void;
};

export default function TransitionModal(p: Props) {
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (p.noteRequired && !note.trim()) return setNoteError('Razlog je obvezen.');
    setNoteError(null);
    setBusy(true);
    try {
      await transitionIssue(p.issueId, p.to, note);
      p.onDone();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={p.title} onClose={p.onClose}>
      <form onSubmit={onSubmit} noValidate className="modal-form">
        <label>{p.noteLabel}
          <textarea rows={4} value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)}
                    aria-invalid={!!noteError} />
          {noteError && <span className="field-error">{noteError}</span>}
        </label>
        {formError && <p className="field-error" role="alert">{formError}</p>}
        <button type="submit" disabled={busy}
                className={`btn btn-block ${p.danger ? 'btn-danger' : 'btn-primary'}`}>
          {busy ? 'Shranjujem…' : p.submitLabel}
        </button>
      </form>
    </Modal>
  );
}