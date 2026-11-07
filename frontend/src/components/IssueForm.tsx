import { useEffect, useState, type FormEvent } from 'react';
import { createIssue, listCategories } from '../lib/api/issues';

const MAX_WORDS = 300;
const countWords = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

type Errors = { category?: string; location?: string; title?: string; description?: string; form?: string };
type Props = { buildingId: string; onDone: (title: string) => void };

export default function IssueForm({ buildingId, onDone }: Props) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [titleTouched, setTitleTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    listCategories().then(setCategories).catch((e) => setErrors({ form: (e as Error).message }));
  }, []);

  const categoryName = categories.find((c) => c.id === categoryId)?.name;
  const autoTitle = [categoryName, location.trim()].filter(Boolean).join(' – ');
  const titleValue = titleTouched ? title : autoTitle;
  const words = countWords(description);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Errors = {};
    if (!categoryId) errs.category = 'Izberite kategorijo.';
    if (!location.trim()) errs.location = 'Lokacija je obvezna.';
    else if (location.trim().length > 50) errs.location = 'Lokacija ima lahko največ 50 znakov.';
    if (!titleValue.trim()) errs.title = 'Naslov je obvezen.';
    else if (titleValue.trim().length > 100) errs.title = 'Naslov ima lahko največ 100 znakov.';
    if (!description.trim()) errs.description = 'Opis je obvezen.';
    else if (words > MAX_WORDS) errs.description = `Opis ima lahko največ ${MAX_WORDS} besed.`;

    if (Object.keys(errs).length > 0) {
      errs.form = 'Obrazec ni popolno izpolnjen. Preverite označena polja.';
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const issue = await createIssue({
        buildingId, categoryId, title: titleValue, description, location,
      });
      onDone(issue.title);
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="modal-form">
      <label>Kategorija
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} aria-invalid={!!errors.category}>
          <option value="">Izberite …</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.category && <span className="field-error">{errors.category}</span>}
      </label>

      <label>Lokacija v bloku
        <input value={location} onChange={(e) => setLocation(e.target.value)} maxLength={50}
               placeholder="npr. klet, 3. nadstropje" aria-invalid={!!errors.location} />
        {errors.location && <span className="field-error">{errors.location}</span>}
      </label>

      <label>Naslov
        <input value={titleValue} maxLength={100} aria-invalid={!!errors.title}
               onChange={(e) => { setTitleTouched(true); setTitle(e.target.value); }} />
        <span className="hint">Samodejno iz kategorije in lokacije, lahko ga uredite.</span>
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>

      <label>Opis
        <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
                  aria-invalid={!!errors.description} />
        <span className={`hint ${words > MAX_WORDS ? 'hint-over' : ''}`}>{words} / {MAX_WORDS} besed</span>
        {errors.description && <span className="field-error">{errors.description}</span>}
      </label>

      {errors.form && <p className="field-error" role="alert">{errors.form}</p>}
      <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
        {busy ? 'Pošiljam…' : 'Oddaj prijavo'}
      </button>
    </form>
  );
}