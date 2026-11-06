import { Navigate, Outlet } from 'react-router-dom';
import { useIsAdmin } from '../hooks/useIsAdmin';

export default function AdminRoute() {
  const { loading, isAdmin } = useIsAdmin();
  if (loading) return <p>Nalaganje…</p>;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}