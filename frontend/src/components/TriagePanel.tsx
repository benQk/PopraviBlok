import { useEffect, useState, type FormEvent } from 'react';
import { triageIssue } from '../lib/api/issues';
import { listTechnicians } from '../lib/api/technicians';
import { PRIORITY_LABEL } from '../lib/issueLabels';
import type { Enums } from '../lib/database.types';

type Priority = Enums<'issue_priority'>;
type Props = {
  issueId: string; buildingId: string; categoryId: string; categoryName: string;
  initialPriority: Priority; onDone: () => void;
};

export default function TriagePanel({ issueId, buildingId, categoryId, categoryName, initialPriority, onDone }: Props) {
  const [priority, setPriority] = useState<Priority>(initialPriority);
  const [techs, setTechs] = useState<Awaited<ReturnType<typeof listTechnicians>> | null>(null);
  const [assignee, setAssignee] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // AC2: samo serviserji tega bloka z enako stroko, kot je kategorija prijave
    listTechnicians(buildingId, categoryId).then(setTechs).catch((e) => setError((e as Error).message));
  }, [buildingId, categoryId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!assignee) return setError('Izberite serviserja.');
    setBusy(true);
    setError(null);
    try {
      await triageIssue(issueId, priority, assignee);
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card side-card triage" noValidate>
      <h2>Triaža in dodelitev</h2>
      <label>Prioriteta
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          {(Object.entries(PRIORITY_LABEL) as [Priority, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </label>

      {techs && techs.length === 0 ? (
        <p className="hint">
          V bloku ni serviserja za stroko »{categoryName}«. Dodajte ga na domači strani z gumbom »Dodaj serviserja«.
        </p>
      ) : (
        <label>Serviser ({categoryName})
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} aria-invalid={!!error && !assignee}>
            <option value="">Izberite …</option>
            {techs?.map((t) => (
              <option key={t.id} value={t.user_id}>
                {t.profiles?.full_name || t.profiles?.email}
              </option>
            ))}
          </select>
        </label>
      )}

      {error && <p className="field-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary btn-block"
              disabled={busy || !techs || techs.length === 0}>
        {busy ? 'Dodeljujem…' : 'Dodeli serviserju'}
      </button>
    </form>
  );
}