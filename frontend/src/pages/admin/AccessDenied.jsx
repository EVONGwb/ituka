import { ShieldAlert } from 'lucide-react';
import { ActionButton, EmptyState } from '../../components/admin/ui';

export default function AccessDenied() {
  return (
    <EmptyState
      icon={ShieldAlert}
      title="Acceso denegado"
      description="No tienes permisos para ver esta sección."
      action={
        <ActionButton to="/admin" variant="secondary">
          Volver al panel
        </ActionButton>
      }
    />
  );
}
