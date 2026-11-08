import { useEffect, useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { listAssignedIssues, ISSUES_PAGE_SIZE } from '../lib/api/issues';
import { useAuth } from '../context/AuthContext';
import IssueCard from './IssueCard';
import Pagination from './Pagination';
import './issues.css';

type Rows = Awaited<ReturnType<typeof listAssignedIssues>>['rows'];

export default function TechnicianIssues() {
  const { session } = useAuth();
  const uid = session!.user.id;
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<Rows>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listAssignedIssues(uid, page, query)
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
  }, [uid, page, query]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setPage(0);
    setQuery(searchInput);
  }

  return (
    <section className="issues">
      <div className="issues-head"><h2>Moje naloge</h2></div>

      <form className="issues-search" onSubmit={onSearch} role="search">
        <input type="search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
               placeholder="Iskanje po naslovu, lokaciji ali opisu …" aria-label="Iskanje nalog" />
        <button type="submit" className="btn"><Search size={16} />Najdi</button>
      </form>

      {error && <p className="field-error" role="alert">{error}</p>}
      {loading && rows.length === 0 ? (
        <p>Nalaganje…</p>
      ) : rows.length === 0 ? (
        <p className="empty">{query ? 'Ni zadetkov.' : 'Trenutno nimate dodeljenih nalog.'}</p>
      ) : (
        <ul className="issue-grid">
          {rows.map((i) => <IssueCard key={i.id} issue={i} forTechnician />)}
        </ul>
      )}
      <Pagination page={page} total={total} pageSize={ISSUES_PAGE_SIZE} onChange={setPage} />
    </section>
  );
}