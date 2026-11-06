import { useState, type FormEvent } from 'react';
import { joinBuilding } from '../lib/api/buildings';

type Errors = { code?: string; apartment?: string; form?: string };

export default function JoinBuildingForm({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState('');
  const [apartment, setApartment] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Errors = {};
    if (!code.trim()) errs.code = 'Koda bloka je obvezna.';
    if (!apartment.trim()) errs.apartment = 'Številka stanovanja je obvezna.';
    setErrors(errs);
    if (errs.code || errs.apartment) return;

    setBusy(true);
    try {
      await joinBuilding(code, apartment);
      onDone();
    } catch (err) {
      const msg = (err as Error).message;
      // napaka o kodi se izpiše ob polju s kodo, ostale pod obrazcem
      if (msg === 'Koda bloka ne obstaja') setErrors({ code: msg });
      else setErrors({ form: msg });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="modal-form">
      <label>Koda bloka
        <input value={code} onChange={(e) => setCode(e.target.value)}
               autoCapitalize="characters" aria-invalid={!!errors.code} />
        {errors.code && <span className="field-error">{errors.code}</span>}
      </label>
      <label>Številka stanovanja
        <input value={apartment} onChange={(e) => setApartment(e.target.value)}
               aria-invalid={!!errors.apartment} />
        {errors.apartment && <span className="field-error">{errors.apartment}</span>}
      </label>
      {errors.form && <p className="field-error" role="alert">{errors.form}</p>}
      <button className="btn btn-primary btn-block" type="submit" disabled={busy}>{busy ? 'Pošiljam…' : 'Pošlji prošnjo'}</button>
    </form>
  );
}