import { NavLink, Outlet, Link } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import './admin.css';

const MENU = [{ to: '/admin/buildings', label: 'Zahtevki za bloke', icon: Building2 }];


export default function AdminLayout() {
  return (
    <div className="admin">
      <aside className="admin-menu">
        <h2>Administracija</h2>
        <nav>
          {MENU.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="admin-back"><ArrowLeft size={16} />Nazaj na domačo stran</Link>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}