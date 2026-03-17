function getLocale(language) {
  if (language === 'en') return 'en-US';
  return 'es-ES';
}

function normalizeDate(input) {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatParts(date, locale) {
  const parts = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(date);
  const out = {};
  for (const p of parts) {
    if (p.type === 'day' || p.type === 'month' || p.type === 'year') out[p.type] = p.value;
  }
  return out;
}

export function formatDate(input, prefs) {
  const date = normalizeDate(input);
  if (!date) return '';
  const locale = getLocale(prefs?.language);
  const { day, month, year } = formatParts(date, locale);
  if (prefs?.dateFormat === 'MDY') return `${month}/${day}/${year}`;
  return `${day}/${month}/${year}`;
}

export function formatTime(input, prefs) {
  const date = normalizeDate(input);
  if (!date) return '';
  const locale = getLocale(prefs?.language);
  const hour12 = prefs?.timeFormat === '12h';
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12 }).format(date);
}

export function formatDateTime(input, prefs) {
  const date = normalizeDate(input);
  if (!date) return '';
  return `${formatDate(date, prefs)} ${formatTime(date, prefs)}`;
}
