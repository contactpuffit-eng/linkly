import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect based on user role
  if (profile.role === 'vendor') {
    return <Navigate to="/vendor" replace />;
  } else if (profile.role === 'affiliate') {
    return <Navigate to="/affiliate" replace />;
  } else if (profile.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/auth" replace />;
}