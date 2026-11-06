import { useState, type FormEvent } from 'react';
import { requestBuilding } from '../lib/api/buildings';

type Errors = { name?: string; address?: string; form?: string };

export default function BuildingRequestForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Errors = {};
    if (!name.trim()) errs.name = 'Naziv bloka je obvezen.';
    if (!address.trim()) errs.address = 'Naslov bloka je obvezen.';
    setErrors(errs);
    if (errs.name || errs.address) return;

    setBusy(true);
    try {
      await requestBuilding(name, address);
      onDone();
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="modal-form">
      <label>Naziv bloka
        <input value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>
      <label>Naslov bloka
        <input value={address} onChange={(e) => setAddress(e.target.value)} aria-invalid={!!errors.address} />
        {errors.address && <span className="field-error">{errors.address}</span>}
      </label>
      {errors.form && <p className="field-error" role="alert">{errors.form}</p>}
      <button type="submit" disabled={busy}>{busy ? 'Pošiljam…' : 'Oddaj zahtevek'}</button>
    </form>
  );
}