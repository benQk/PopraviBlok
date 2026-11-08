import { useCallback, useEffect, useState } from 'react';
import { Link,useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Wrench } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getIssue } from '../lib/api/issues';
import { PRIORITY_LABEL, STATUS_LABEL } from '../lib/issueLabels';
import AppHeader from '../components/AppHeader';
import TriagePanel from '../components/TriagePanel';
import './issue.css';
import IssueTimeline from '../components/IssueTimeline';
import StatusActions from '../components/StatusActions';
import TechnicianActions from '../components/TechnicianActions';

type Issue = NonNullable<Awaited<ReturnType<typeof getIssue>>>;
const fmt = (s: string) => new Date(s).toLocaleString('sl-SI');

export default function IssueDetail() {
  const { id } = useParams();
  const { session } = useAuth();
  const uid = session!.user.id;
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const data = await getIssue(id!);
      if (!data) {
        setIssue(null);
        setError('Prijava ne obstaja ali nimate dostopa do nje.');
        return;
      }
      const { data: m } = await supabase.from('memberships').select('role')
        .eq('user_id', uid).eq('building_id', data.building_id).eq('status', 'APPROVED').maybeSingle();
      setIssue(data);
      setIsManager(m?.role === 'MANAGER');
      setError(null);
    } catch {
      setError('Prijave ni bilo mogoče naložiti.');
    } finally {
      setLoading(false);
    }
  }, [id, uid]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <AppHeader />
      <main className="issue-page">
        <Link to="/" className="back-link"><ArrowLeft size={16} />Nazaj na težave bloka</Link>

        {loading ? <p>Nalaganje…</p> : error || !issue ? (
          <p className="empty">{error}</p>
        ) : (
          <div className="issue-layout">
            <article className="issue-main">
              <div className="issue-hero" aria-hidden><Wrench size={56} /></div>
              <div className="issue-badges" style={{ marginTop: '1.25rem' }}>
                <span className={`badge badge-${STATUS_LABEL[issue.status].tone}`}>{STATUS_LABEL[issue.status].text}</span>
                <span className={`badge ${issue.priority === 'URGENT' ? 'badge-urgent' : 'badge-muted'}`}>
                  Prioriteta: {PRIORITY_LABEL[issue.priority]}
                </span>
              </div>
              <h1>{issue.title}</h1>
              <p className="issue-desc">{issue.description}</p>
              <h2 className="section-title">Potek obravnave</h2>
              <IssueTimeline key={issue.updated_at} issueId={issue.id} />
            </article>

            <aside className="issue-side">
              {notice && (
                <p className="notice" role="status"><CheckCircle2 size={18} /><span>{notice}</span></p>
              )}

              {isManager && (issue.status === 'NEW' || issue.status === 'REOPENED') && (
                <TriagePanel
                  issueId={issue.id}
                  buildingId={issue.building_id}
                  categoryId={issue.category_id}
                  categoryName={issue.categories?.name ?? ''}
                  initialPriority={issue.priority}
                  onDone={() => { setNotice('Prijava je dodeljena serviserju.'); load(); }}
                />
              )}
              {isManager && (
                <StatusActions
                  issueId={issue.id}
                  status={issue.status}
                  onDone={(msg) => { setNotice(msg); load(); }}
                />    
              )}
              {issue.assignee_id === uid && (
                <TechnicianActions
                  issueId={issue.id}
                  status={issue.status}
                  onDone={(msg, leave) => {
                    if (leave) navigate('/');   // po zavrnitvi prijave serviser ne sme več brati
                    else { setNotice(msg); load(); }
                  }}
                />
              )}

              <div className="card side-card">
                <h2>Podrobnosti</h2>
                <dl className="facts">
                  <div><dt>Blok</dt><dd>{issue.buildings?.name}</dd></div>
                  <div><dt>Kategorija</dt><dd>{issue.categories?.name}</dd></div>
                  <div><dt>Lokacija</dt><dd>{issue.location}</dd></div>
                  <div><dt>Prijavljeno</dt><dd>{fmt(issue.created_at)}</dd></div>
                  {issue.reporter && (
                    <div><dt>Prijavitelj</dt>
                      <dd>{issue.reporter.full_name || '(brez imena)'}<span>{issue.reporter.email}</span></dd>
                    </div>
                  )}
                  <div><dt>Serviser</dt>
                    <dd>
                      {issue.assignee
                        ? <>{issue.assignee.full_name || '(brez imena)'}<span>{issue.assignee.email}</span></>
                        : issue.assignee_id ? 'Dodeljeno serviserju' : 'Ni dodeljen'}
                    </dd>
                  </div>
                  <div><dt>Zadnja sprememba</dt><dd>{fmt(issue.updated_at)}</dd></div>
                  {issue.resolved_at && <div><dt>Rešeno</dt><dd>{fmt(issue.resolved_at)}</dd></div>}
                </dl>
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}