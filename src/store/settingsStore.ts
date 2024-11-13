import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '../types';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  appName: 'SGP',
  logoUrl: '',
  primaryColor: '#4F46E5',
  companyName: 'Softec Angola',
  contactEmail: 'carlos@softecangola.net',
  dateFormat: 'DD/MM/YYYY',
  timezone: 'Africa/Luanda',
  smtp: {
    host: 'mail.softecangola.net',
    port: 465,
    secure: true,
    username: 'carlos@softecangola.net',
    password: 'Popadic17',
    fromEmail: 'carlos@softecangola.net',
    fromName: 'Sistema de Gestão',
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
            smtp: {
              ...state.settings.smtp,
              ...(newSettings.smtp || {}),
            },
          },
        })),
    }),
    {
      name: 'app-settings',
    }
  )
);