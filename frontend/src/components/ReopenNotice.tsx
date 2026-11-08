import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { listIssueEvents } from '../lib/api/issues';

export default function ReopenNotice({ issueId }: { issueId: string }) {
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    listIssueEvents(issueId)
      .then((events) => {
        const last = [...events].reverse().find((e) => e.to_status === 'REOPENED');
        setNote(last?.note ?? null);
      })
      .catch(() => setNote(null));
  }, [issueId]);

  if (!note) return null;
  return (
    <div className="notice notice-warn" role="status">
      <RotateCcw size={18} />
      <span><strong>Prijavitelj je zavrnil odpravo:</strong> {note}</span>
    </div>
  );
}