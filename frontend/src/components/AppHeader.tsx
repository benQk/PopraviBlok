import { Link } from 'react-router-dom';
import { Building2, LogOut, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useIsAdmin } from '../hooks/useIsAdmin';

export default function AppHeader({ name }: { name?: string }) {
  const { isAdmin } = useIsAdmin();
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark"><Building2 size={18} /></span>PopraviBlok
      </Link>
      <div className="topbar-right">
        {name && <span className="topbar-user">{name}</span>}
        {isAdmin && <Link to="/admin" className="btn btn-sm"><Shield size={16} />Administracija</Link>}
        <button className="btn btn-sm" onClick={() => supabase.auth.signOut()}>
          <LogOut size={16} />Odjava
        </button>
      </div>
    </header>
  );
}