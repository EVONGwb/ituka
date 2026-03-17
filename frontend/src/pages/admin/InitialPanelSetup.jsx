import { useMemo, useState } from 'react';
import { SectionHeader, ActionButton } from '../../components/admin/ui';
import { useAdminPreferences } from '../../context/AdminPreferencesContext';
import { Settings2 } from 'lucide-react';

export default function InitialPanelSetup() {
  const { prefs, savePrefs } = useAdminPreferences();
  const [draft, setDraft] = useState(prefs);

  const languages = useMemo(() => ([
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' }
  ]), []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl ituka-card p-10 dark:bg-[#0F172A] dark:border-white/10">
        <SectionHeader
          title="Configuración inicial del panel"
          description="Define tus preferencias básicas para que el panel se sienta completo desde el inicio."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Tema</label>
            <select
              value={draft.theme}
              onChange={(e) => setDraft((p) => ({ ...p, theme: e.target.value }))}
              className="ituka-select dark:bg-white/5 dark:border-white/10 dark:text-stone-100"
            >
              <option value="system">Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Idioma</label>
            <select
              value={draft.language}
              onChange={(e) => setDraft((p) => ({ ...p, language: e.target.value }))}
              className="ituka-select dark:bg-white/5 dark:border-white/10 dark:text-stone-100"
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Formato de fecha</label>
            <select
              value={draft.dateFormat}
              onChange={(e) => setDraft((p) => ({ ...p, dateFormat: e.target.value }))}
              className="ituka-select dark:bg-white/5 dark:border-white/10 dark:text-stone-100"
            >
              <option value="DMY">DD/MM/AAAA</option>
              <option value="MDY">MM/DD/AAAA</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Formato de hora</label>
            <select
              value={draft.timeFormat}
              onChange={(e) => setDraft((p) => ({ ...p, timeFormat: e.target.value }))}
              className="ituka-select dark:bg-white/5 dark:border-white/10 dark:text-stone-100"
            >
              <option value="24h">24h</option>
              <option value="12h">12h</option>
            </select>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 ituka-divider dark:border-white/10 pt-6">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-300 text-sm">
            <Settings2 className="w-4 h-4" />
            Se puede cambiar más tarde en Ajustes.
          </div>
          <ActionButton
            variant="primary"
            onClick={() => savePrefs(draft)}
          >
            Guardar y continuar
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
