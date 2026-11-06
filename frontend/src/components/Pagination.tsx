type Props = { page: number; total: number; pageSize: number; onChange: (p: number) => void };

export default function Pagination({ page, total, pageSize, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="pagination">
      <button className="btn btn-sm" onClick={() => onChange(page - 1)} disabled={page === 0}>‹ Prejšnja</button>
      <span>Stran {page + 1} od {pages} ({total})</span>
      <button className="btn btn-sm" onClick={() => onChange(page + 1)} disabled={page >= pages - 1}>Naslednja ›</button>
    </div>
  );
}