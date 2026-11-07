import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Plus, Search, X, UserPlus } from 'lucide-react';
import { listIssues, ISSUES_PAGE_SIZE } from '../lib/api/issues';
import IssueCard from './IssueCard';
import IssueForm from './IssueForm';
import Modal from './Modal';
import Pagination from './Pagination';
import './issues.css';
import TechniciansModal from './TechniciansModal';

type Rows = Awaited<ReturnType<typeof listIssues>>['rows'];
type Props = { buildingId: string; buildingName: string; canReport: boolean; isManager: boolean };


export default function BuildingIssues({ buildingId, buildingName, canReport, isManager }: Props) {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<Rows>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [techOpen, setTechOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listIssues(buildingId, page, query)
      .then((res) => {
        if (cancelled) return;
        if (res.rows.length === 0 && page > 0) return setPage(page - 1);
        setRows(res.rows);
        setTotal(res.total);
        setError(null);
      })
      .catch((e) => !cancelled && setError((e as Error).message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [buildingId, page, query, reloadKey]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setPage(0);
    setQuery(searchInput);
  }

  function onCreated(title: string) {
    setFormOpen(false);
    setConfirmation(title);
    // nova prijava je najnovejša: počisti iskanje, pojdi na prvo stran in znova preberi
    setSearchInput('');
    setQuery('');
    setPage(0);
    setReloadKey((k) => k + 1);
  }

  return (
    <section className="issues">
      <div className="issues-actions">
        {isManager && (
          <button className="btn" onClick={() => setTechOpen(true)}>
            <UserPlus size={18} />Dodaj serviserja
          </button>
        )}
        {canReport && (
          <button className="btn btn-primary" onClick={() => { setConfirmation(null); setFormOpen(true); }}>
            <Plus size={18} />Prijavi težavo
          </button>
        )}
      </div>

      {confirmation && (
        <div className="notice" role="status">
          <CheckCircle2 size={20} />
          <span>Prijava »{confirmation}« je bila oddana.</span>
          <button onClick={() => setConfirmation(null)} aria-label="Zapri"><X size={16} /></button>
        </div>
      )}

      <form className="issues-search" onSubmit={onSearch} role="search">
        <input type="search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
               placeholder="Iskanje po naslovu, lokaciji ali opisu …" aria-label="Iskanje prijav" />
        <button type="submit" className="btn"><Search size={16} />Najdi</button>
      </form>

      {error && <p className="field-error" role="alert">{error}</p>}
      {loading && rows.length === 0 ? (
        <p>Nalaganje…</p>
      ) : rows.length === 0 ? (
        <p className="empty">{query ? 'Ni zadetkov.' : 'V tem bloku ni aktivnih težav.'}</p>
      ) : (
        <ul className="issue-grid">
          {rows.map((i) => <IssueCard key={i.id} issue={i} />)}
        </ul>
      )}
      <Pagination page={page} total={total} pageSize={ISSUES_PAGE_SIZE} onChange={setPage} />

      {formOpen && (
        <Modal title="Prijava težave" onClose={() => setFormOpen(false)}>
          <IssueForm buildingId={buildingId} onDone={onCreated} />
        </Modal>
      )}
      {techOpen && <TechniciansModal buildingId={buildingId} onClose={() => setTechOpen(false)} />}
    </section>
  );
}