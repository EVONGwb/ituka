export default function StatusBadge({ status, type = 'default', size = 'default' }) {
  const getStatusStyles = (status) => {
    const styles = {
      // SOLICITUDES (Paso 6)
      solicitud_recibida: 'bg-ituka-info-soft text-ituka-info border-ituka-info/20',
      en_conversacion: 'bg-ituka-warning-soft text-ituka-warning border-ituka-warning/20',
      confirmado: 'bg-ituka-success-soft text-ituka-success border-ituka-success/20',
      cancelado: 'bg-ituka-danger-soft text-ituka-danger border-ituka-danger/20',
      convertido: 'bg-ituka-success-soft text-ituka-success border-ituka-success/20',

      // PEDIDOS (Estados adicionales)
      pagado: 'bg-ituka-success-soft text-ituka-success border-ituka-success/20',
      en_preparacion: 'bg-ituka-warning-soft text-ituka-warning border-ituka-warning/20',
      enviado: 'bg-ituka-info-soft text-ituka-info border-ituka-info/20',
      listo_para_recoger: 'bg-ituka-info-soft text-ituka-info border-ituka-info/20',
      entregado: 'bg-ituka-success-soft text-ituka-success border-ituka-success/20',
      
      // PRODUCTOS
      active: 'bg-ituka-success-soft text-ituka-success border-ituka-success/20',
      inactive: 'bg-stone-100 text-stone-500 border-stone-200',
    };

    return styles[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getLabel = (status) => {
    if (status === true) return 'Visible';
    if (status === false) return 'Oculto';
    
    const labels = {
        solicitud_recibida: 'Nueva',
        en_conversacion: 'Conversando',
        confirmado: 'Confirmada',
        cancelado: 'Rechazada',
        convertido: 'Pedido Creado'
    };

    return labels[status] || status.replace(/_/g, ' ');
  };

  const statusKey = typeof status === 'boolean' ? (status ? 'active' : 'inactive') : status;
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center ${sizeClasses} rounded-full font-bold border uppercase tracking-wide whitespace-nowrap ${getStatusStyles(statusKey)}`}>
      {type === 'dot' && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70`}></span>
      )}
      {getLabel(status)}
    </span>
  );
}
