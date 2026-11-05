import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import './auth.css';

export default function Login() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to="/" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError('Napačna e-pošta ali geslo.');
    else navigate('/', { replace: true });
  }

  return (
    <main className="auth">
      <h2 className="auth-title">Prijava</h2>
      <div className="auth-logo" aria-hidden />
      <h1 className="auth-brand">POPRAVIBLOK</h1>

      <form onSubmit={onSubmit}>
        <label>E-pošta
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 required autoComplete="email" />
        </label>
        <label>Geslo
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                 required autoComplete="current-password" />
        </label>

        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Prijavljam…' : 'Prijava'}</button>
      </form>

      <hr />
      <p className="auth-switch">Še nimate računa?</p>
      <Link to="/register" className="auth-link-button">Registracija</Link>
    </main>
  );
}