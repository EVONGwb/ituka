export default function StatusBadge({ status, type = 'default', size = 'default' }) {
  const getStatusStyles = (status) => {
    const styles = {
      // SOLICITUDES (Paso 6)
      solicitud_recibida: 'bg-blue-50 text-blue-600 border-blue-100', // Nueva -> Azul
      en_conversacion: 'bg-orange-50 text-orange-600 border-orange-100', // En conversación -> Naranja
      confirmado: 'bg-green-50 text-green-600 border-green-100', // Confirmada -> Verde
      cancelado: 'bg-stone-100 text-stone-500 border-stone-200', // Rechazada/Cancelada -> Gris
      convertido: 'bg-emerald-50 text-emerald-700 border-emerald-200', // Convertida -> Verde Oscuro

      // PEDIDOS (Estados adicionales)
      pagado: 'bg-teal-50 text-teal-700 border-teal-200',
      en_preparacion: 'bg-amber-50 text-amber-700 border-amber-200',
      enviado: 'bg-purple-50 text-purple-700 border-purple-200',
      listo_para_recoger: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      entregado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      
      // PRODUCTOS
      active: 'bg-[#E8F5E9] text-ituka-green border-green-200',
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