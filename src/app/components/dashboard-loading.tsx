import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAppStore } from '../store';
import { LoadingScreen } from './loading-screen';

export function DashboardLoadingPage() {
  const { isAuthenticated } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <LoadingScreen />;
}
