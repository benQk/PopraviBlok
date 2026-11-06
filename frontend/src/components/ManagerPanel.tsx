import { useCallback, useEffect, useState } from 'react';
import { listPendingMemberships, reviewMembership, PAGE_SIZE } from '../lib/api/buildings';
import Pagination from './Pagination';
import { X } from 'lucide-react';

type Rows = Awaited<ReturnType<typeof listPendingMemberships>>['rows'];
type Props = { buildings: { id: string; name: string }[]; open: boolean; onClose: () => void };

export default function ManagerPanel({ buildings, open, onClose }: Props) {
  const [buildingId, setBuildingId] = useState(buildings[0].id);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Rows>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await listPendingMemberships(buildingId, p);
      if (res.rows.length === 0 && p > 0) return setPage(p - 1);
      setRows(res.rows);
      setTotal(res.total);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [buildingId]);

  // seznam se prebere ob vsakem odprtju panela
  useEffect(() => { if (open) load(page); }, [open, page, load]);

  function changeBuilding(id: string) {
    setBuildingId(id);
    setPage(0);
  }

  async function review(id: string, approve: boolean) {
    setBusyId(id);
    setError(null);
    try {
      await reviewMembership(id, approve);
      await load(page);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <aside className={`slider ${open ? 'slider-open' : ''}`} aria-hidden={!open}>
      <div className="slider-head">
        <h2>Prijave bloka</h2>
        <button onClick={onClose} aria-label="Zapri"><X size={18} /></button>
      </div>

      {buildings.length > 1 && (
        <select value={buildingId} onChange={(e) => changeBuilding(e.target.value)}>
          {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      )}
      {buildings.length === 1 && <p className="slider-building">{buildings[0].name}</p>}

      {error && <p className="field-error" role="alert">{error}</p>}
      {loading && rows.length === 0 ? (
        <p>Nalaganje…</p>
      ) : rows.length === 0 ? (
        <p className="empty">Ni čakajočih zahtevkov.</p>
      ) : (
        <ul className="req-list">
          {rows.map((m) => (
            <li key={m.id} className="slider-row">
              <div className="req-main">
                <strong>{m.profiles?.full_name || '(brez imena)'}</strong>
                <span>{m.profiles?.email}</span>
              </div>
              <div className="req-meta">
                <span>Stanovanje: {m.apartment}</span>
                <span>{new Date(m.created_at).toLocaleString('sl-SI')}</span>
              </div>
              <span className="badge badge-pending">V obravnavi</span>
              <div className="req-actions">
                <button className="btn btn-sm btn-primary" disabled={busyId === m.id} onClick={() => review(m.id, true)}>Sprejmi</button>
                <button className="btn btn-sm btn-danger" disabled={busyId === m.id} onClick={() => review(m.id, false)}>Zavrni</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
    </aside>
  );
}