import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/AuthShell';

export default function Register() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to="/" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setBusy(false);
    if (error) return setError(error.message);
    if (data.session) navigate('/', { replace: true });
    else setInfo('Poslali smo vam potrditveno e-pošto.');
  }

 return (
    <AuthShell
      title="Registracija"
      subtitle="Ustvarite račun in začnite."
      footer={<>
        <p>Že imate račun?</p>
        <Link to="/login" className="btn btn-block">Prijava</Link>
      </>}
    >
      <form onSubmit={onSubmit}>
        <label>E-pošta
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email" />
        </label>
        <label>Polno ime
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                required autoComplete="name" />
        </label>
        <label>Geslo
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required minLength={6} autoComplete="new-password" />
        </label>

        {error && <p className="auth-error" role="alert">{error}</p>}
        {info && <p className="auth-info">{info}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Registriram…' : 'Registracija'}
        </button>
      </form>
    </AuthShell>
  );
}

