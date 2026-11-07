import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { addTechnician, listTechnicians } from '../lib/api/technicians';
import { listCategories } from '../lib/api/issues';
import Modal from './Modal';

type Errors = { email?: string; category?: string; form?: string };
type Tech = Awaited<ReturnType<typeof listTechnicians>>;

export default function TechniciansModal({ buildingId, onClose }: { buildingId: string; onClose: () => void }) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [techs, setTechs] = useState<Tech>([]);
  const [email, setEmail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(
    () => listTechnicians(buildingId).then(setTechs).catch((e) => setErrors({ form: (e as Error).message })),
    [buildingId]
  );

  useEffect(() => {
    listCategories().then(setCategories).catch((e) => setErrors({ form: (e as Error).message }));
    reload();
  }, [reload]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const errs: Errors = {};
    if (!email.trim()) errs.email = 'E-naslov je obvezen.';
    else if (!email.includes('@')) errs.email = 'Vnesite veljaven e-naslov.';
    if (!categoryId) errs.category = 'Izberite stroko.';
    setErrors(errs);
    if (errs.email || errs.category) return;

    setBusy(true);
    try {
      await addTechnician(buildingId, email, categoryId);
      setSuccess(`Serviser ${email.trim()} je dodan.`);
      setEmail('');
      setCategoryId('');
      await reload();
    } catch (err) {
      const msg = (err as Error).message;
      // napaka o e-naslovu se izpiše ob polju, ostale pod obrazcem
      if (msg.startsWith('Uporabnik s tem e-naslovom')) setErrors({ email: msg });
      else setErrors({ form: msg });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Serviserji bloka" onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="modal-form">
        <label>E-naslov registriranega uporabnika
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 aria-invalid={!!errors.email} autoComplete="off" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>Stroka
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} aria-invalid={!!errors.category}>
            <option value="">Izberite …</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </label>
        {errors.form && <p className="field-error" role="alert">{errors.form}</p>}
        {success && <p className="notice" role="status"><CheckCircle2 size={18} /><span>{success}</span></p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Dodajam…' : 'Dodaj serviserja'}
        </button>
      </form>

      <h3 style={{ margin: '1.5rem 0 0', fontSize: '1rem' }}>Trenutni serviserji</h3>
      {techs.length === 0 ? (
        <p className="hint" style={{ marginTop: '.5rem' }}>V bloku še ni serviserjev.</p>
      ) : (
        <ul className="tech-list">
          {techs.map((t) => (
            <li key={t.id}>
              <span>{t.profiles?.full_name || '(brez imena)'}<small>{t.profiles?.email}</small></span>
              <span className="badge badge-info">{t.categories?.name}</span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}