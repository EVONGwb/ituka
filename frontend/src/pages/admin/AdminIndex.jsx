import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { can, isStaff } from '../../lib/permissions';

export default function AdminIndex() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user || !isStaff(user.role)) {
      navigate('/login', { replace: true });
      return;
    }

    if (user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    if (can(user.role, 'chats:read')) {
      navigate('/admin/chats', { replace: true });
      return;
    }
    if (can(user.role, 'requests:read')) {
      navigate('/admin/requests', { replace: true });
      return;
    }
    if (can(user.role, 'analytics:read')) {
      navigate('/admin/analytics', { replace: true });
      return;
    }
    if (can(user.role, 'orders:read')) {
      navigate('/admin/orders', { replace: true });
      return;
    }

    navigate('/', { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c5a25a]"></div>
    </div>
  );
}
