import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { can, isStaff } from '../../lib/permissions';
import AccessDenied from '../../pages/admin/AccessDenied';

export default function RequirePermission({ permission, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c5a25a]"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isStaff(user.role)) return <Navigate to="/" replace />;

  if (permission && !can(user.role, permission)) return <AccessDenied />;

  return children;
}
