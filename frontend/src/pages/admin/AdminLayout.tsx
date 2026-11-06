import { NavLink, Outlet, Link } from 'react-router-dom';
import './admin.css';

const MENU = [{ to: '/admin/buildings', label: 'Zahtevki za bloke' }];

export default function AdminLayout() {
  return (
    <div className="admin">
      <aside className="admin-menu">
        <h2>Administracija</h2>
        <nav>
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {m.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="admin-back">← Nazaj na domačo stran</Link>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}