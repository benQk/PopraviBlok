import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useMyBuildingState } from '../hooks/useMyBuildingState';
import Modal from '../components/Modal';
import BuildingRequestForm from '../components/BuildingRequestForm';
import './home.css';
import { Link } from 'react-router-dom';
import { useIsAdmin } from '../hooks/useIsAdmin';

type StatusItem = { key: string; tone: 'pending' | 'ok' | 'rejected'; text: string; code?: string };

export default function Home() {
  const { loading, error, fullName, memberships, requests, reload } = useMyBuildingState();
  const [modal, setModal] = useState<'join' | 'request' | null>(null);

  const items: StatusItem[] = [];

  const { isAdmin } = useIsAdmin();

  for (const b of requests) {
    if (b.status === 'PENDING')
      items.push({ key: `b-${b.id}`, tone: 'pending', text: `Zahtevek za blok »${b.name}« je v obravnavi.` });
    if (b.status === 'REJECTED')
      items.push({ key: `b-${b.id}`, tone: 'rejected', text: `Zahtevek za blok »${b.name}« je bil zavrnjen.` });
    // APPROVED pokrije članstvo MANAGER spodaj
  }

  for (const m of memberships) {
    const name = m.buildings?.name ?? 'blok';
    if (m.status === 'PENDING')
      items.push({ key: `m-${m.id}`, tone: 'pending', text: `Vaša prošnja za pridružitev bloku »${name}« je v obdelavi.` });
    else if (m.status === 'REJECTED')
      items.push({ key: `m-${m.id}`, tone: 'rejected', text: `Prošnja za pridružitev bloku »${name}« je bila zavrnjena.` });
    else if (m.role === 'MANAGER')
      items.push({ key: `m-${m.id}`, tone: 'ok', text: `Vaš blok »${name}« je odobren.`, code: m.buildings?.invite_code ?? undefined });
    else
      items.push({ key: `m-${m.id}`, tone: 'ok', text: `Prijavljeni ste v blok »${name}«.` });
  }

  const hasActive = items.some((i) => i.tone !== 'rejected');

  if (loading) return <p className="home-msg">Nalaganje…</p>;
  if (error) return <p className="home-msg field-error">{error}</p>;

  return (
    <main className="home">
      <header className="home-header">
        <div>
          <h1>Dobrodošli, {fullName || 'uporabnik'}</h1>
          {!hasActive && <p>Za začetek izberite, kaj želite storiti.</p>}
        </div>
        {isAdmin && <Link to="/admin">Administracija</Link>}
        <button onClick={() => supabase.auth.signOut()}>Odjava</button>
      </header>

      {items.map((i) => (
        <div key={i.key} className={`status status-${i.tone}`}>
          <p>{i.text}</p>
          {i.code && <p>Koda bloka za stanovalce: <strong>{i.code}</strong></p>}
        </div>
      ))}

      {!hasActive && (
        <section className="choices">
          <button className="choice choice-join" onClick={() => setModal('join')}>
            <span className="choice-img" aria-hidden>🏠</span>
            <span className="choice-label">Pridružite se bloku</span>
            <span className="choice-sub">Imam kodo bloka</span>
          </button>
          <button className="choice choice-request" onClick={() => setModal('request')}>
            <span className="choice-img" aria-hidden>🏢</span>
            <span className="choice-label">Registrirajte blok</span>
            <span className="choice-sub">Želim upravljati nov blok</span>
          </button>
        </section>
      )}

      {modal === 'request' && (
        <Modal title="Zahtevek za nov blok" onClose={() => setModal(null)}>
          <BuildingRequestForm onDone={() => { setModal(null); reload(); }} />
        </Modal>
      )}
      {modal === 'join' && (
        <Modal title="Pridružitev bloku" onClose={() => setModal(null)}>
          <p>Obrazec sledi v issue 14.</p>
        </Modal>
      )}
    </main>
  );
}