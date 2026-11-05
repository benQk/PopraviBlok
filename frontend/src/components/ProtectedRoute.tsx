import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { session, loading } = useAuth();
  if (loading) return <p>Nalaganje…</p>;
  return session ? <Outlet /> : <Navigate to="/login" replace />;
}