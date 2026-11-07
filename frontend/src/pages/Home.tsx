import { useState } from 'react';
import { useMyBuildingState } from '../hooks/useMyBuildingState';
import Modal from '../components/Modal';
import BuildingRequestForm from '../components/BuildingRequestForm';
import './home.css';
import JoinBuildingForm from '../components/JoinBuildingForm';
import ManagerPanel from '../components/ManagerPanel';
import { Building2, CheckCircle2, Clock, KeyRound, XCircle } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import BuildingIssues from '../components/BuildingIssues';

const ICONS = { pending: Clock, ok: CheckCircle2, rejected: XCircle };

type StatusItem = { key: string; tone: 'pending' | 'ok' | 'rejected'; text: string; code?: string };

export default function Home() {
  const { loading, error, fullName, memberships, requests, reload } = useMyBuildingState();
  const [modal, setModal] = useState<'join' | 'request' | null>(null);

  const items: StatusItem[] = [];

  const [panelOpen, setPanelOpen] = useState(false);

  const managed = memberships
    .filter((m) => m.role === 'MANAGER' && m.status === 'APPROVED' && m.buildings)
    .map((m) => ({ id: m.building_id, name: m.buildings!.name }));

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
    else if (m.role === 'TECHNICIAN')
      items.push({ key: `m-${m.id}`, tone: 'ok', text: `Prijavljeni ste v blok »${name}« kot serviser.` });
    else
      items.push({ key: `m-${m.id}`, tone: 'ok', text: `Prijavljeni ste v blok »${name}«.` });
  }

  const hasActive = items.some((i) => i.tone !== 'rejected');

  if (loading) return <p className="home-msg">Nalaganje…</p>;
  if (error) return <p className="home-msg field-error">{error}</p>;

 return (
  <>
    <AppHeader name={fullName} />
    <main className="home">
      <section className="hero">
        <h1>Dobrodošli, {fullName || 'uporabnik'}</h1>
        {!hasActive && <p>Za začetek izberite, kaj želite storiti.</p>}
      </section>

      {items.length > 0 && (
        <div className="statuses">
          {items.map((i) => {
            const Icon = ICONS[i.tone];
            return (
              <div key={i.key} className={`status status-${i.tone}`}>
                <Icon size={22} />
                <div>
                  <p>{i.text}</p>
                  {i.code && <p className="status-code">Koda bloka za stanovalce: <code>{i.code}</code></p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {memberships
      .filter((m) => m.status === 'APPROVED' && m.buildings && (m.role === 'RESIDENT' || m.role === 'MANAGER'))
      .map((m) => (
        <BuildingIssues
          key={m.id}
          buildingId={m.building_id}
          buildingName={m.buildings!.name}
          canReport={m.role === 'RESIDENT'}
          isManager={m.role === 'MANAGER'}
        />
      ))}

      {!hasActive && (
        <section className="choices">
          <button className="choice" onClick={() => setModal('join')}>
            <span className="choice-icon"><KeyRound size={32} /></span>
            <span className="choice-label">Pridružite se bloku</span>
            <span className="choice-sub">Imam kodo, ki mi jo je posredoval upravnik</span>
          </button>
          <button className="choice" onClick={() => setModal('request')}>
            <span className="choice-icon"><Building2 size={32} /></span>
            <span className="choice-label">Registrirajte blok</span>
            <span className="choice-sub">Želim upravljati nov blok</span>
          </button>
        </section>
      )}
    </main>

    {modal === 'request' && (
      <Modal title="Zahtevek za nov blok" onClose={() => setModal(null)}>
        <BuildingRequestForm onDone={() => { setModal(null); reload(); }} />
      </Modal>
    )}
    {modal === 'join' && (
      <Modal title="Pridružitev bloku" onClose={() => setModal(null)}>
        <JoinBuildingForm onDone={() => { setModal(null); reload(); }} />
      </Modal>
    )}

    {managed.length > 0 && (
      <>
        {!panelOpen && (
          <button className="slider-handle" onClick={() => setPanelOpen(true)}>Prijave bloka</button>
        )}
        <ManagerPanel buildings={managed} open={panelOpen} onClose={() => setPanelOpen(false)} />
      </>
    )}
  </>
);
}