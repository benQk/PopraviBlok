import { useCallback, useEffect, useState } from 'react';
import { listPendingBuildings, reviewBuilding, PAGE_SIZE } from '../../lib/api/buildings';
import Pagination from '../../components/Pagination';

type Rows = Awaited<ReturnType<typeof listPendingBuildings>>['rows'];

export default function BuildingRequests() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Rows>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await listPendingBuildings(p);
      // stran je po obdelavi izpraznjena: nazaj na zadnjo veljavno
      if (res.rows.length === 0 && p > 0) return setPage(p - 1);
      setRows(res.rows);
      setTotal(res.total);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  async function review(id: string, approve: boolean) {
    setBusyId(id);
    setError(null);
    try {
      await reviewBuilding(id, approve);
      await load(page);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <h1>Zahtevki za bloke</h1>
      {error && <p className="field-error" role="alert">{error}</p>}
      {loading && rows.length === 0 ? (
        <p>Nalaganje…</p>
      ) : rows.length === 0 ? (
        <p>Ni čakajočih zahtevkov.</p>
      ) : (
        <ul className="req-list">
          {rows.map((b) => (
            <li key={b.id} className="req-row">
              <div className="req-main">
                <strong>{b.name}</strong>
                <span>{b.address}</span>
              </div>
              <div className="req-meta">
                <span>{b.profiles?.full_name || '(brez imena)'}</span>
                <span>{b.profiles?.email}</span>
                <span>{new Date(b.created_at).toLocaleString('sl-SI')}</span>
              </div>
              <span className="badge badge-pending">V obravnavi</span>
              <div className="req-actions">
                <button disabled={busyId === b.id} onClick={() => review(b.id, true)}>Odobri</button>
                <button disabled={busyId === b.id} onClick={() => review(b.id, false)}>Zavrni</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
    </>
  );
}