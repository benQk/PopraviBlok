import { MapPin, Tag, Wrench } from 'lucide-react';
import { PRIORITY_LABEL, STATUS_LABEL } from '../lib/issueLabels';
import type { listIssues } from '../lib/api/issues';

type Issue = Awaited<ReturnType<typeof listIssues>>['rows'][number];

export default function IssueCard({ issue }: { issue: Issue }) {
  const status = STATUS_LABEL[issue.status];
  return (
    <li className="issue-card card" tabIndex={0}>
      <div className="issue-thumb">
        <Wrench size={40} aria-hidden />
        <div className="issue-hover"><p>{issue.description}</p></div>
      </div>
      <div className="issue-body">
        <div className="issue-badges">
          <span className={`badge badge-${status.tone}`}>{status.text}</span>
          {issue.priority !== 'NORMAL' && (
            <span className={`badge ${issue.priority === 'URGENT' ? 'badge-urgent' : 'badge-muted'}`}>
              {PRIORITY_LABEL[issue.priority]}
            </span>
          )}
        </div>
        <h3>{issue.title}</h3>
        <p className="issue-meta"><MapPin size={14} aria-hidden />{issue.location}</p>
        <p className="issue-meta">
          <Tag size={14} aria-hidden />{issue.categories?.name} · {new Date(issue.created_at).toLocaleDateString('sl-SI')}
        </p>
        {issue.reporter?.full_name && <p className="issue-meta">Prijavil: {issue.reporter.full_name}</p>}
      </div>
    </li>
  );
}