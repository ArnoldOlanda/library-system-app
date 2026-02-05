import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useContext } from 'react';
import { AbilityContext } from '@/rbac/AbilityContext';

interface ProtectedRouteProps {
  action: string;
  subject: string;
  children: React.ReactNode;
}

export function ProtectedRoute({ action, subject, children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const ability = useContext(AbilityContext);

  // Redirige si no esta autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirige si no tiene el permiso
  if (!ability.can(action, subject)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
