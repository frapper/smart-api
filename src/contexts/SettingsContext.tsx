/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface Settings {
  pageSize: number;
  studentRoleId: string;
  defaultGroupTypeId: string;
}

interface SettingsContextType {
  settings: Settings;
  updatePageSize: (pageSize: number) => void;
  updateStudentRoleId: (studentRoleId: string) => void;
  updateDefaultGroupTypeId: (defaultGroupTypeId: string) => void;
}

const DEFAULT_SETTINGS: Settings = {
  pageSize: 50,
  studentRoleId: '',
  defaultGroupTypeId: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'smart-api-settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load settings from localStorage on initialization
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updatePageSize = (pageSize: number) => {
    setSettings(prev => ({ ...prev, pageSize }));
  };

  const updateStudentRoleId = (studentRoleId: string) => {
    setSettings(prev => ({ ...prev, studentRoleId }));
  };

  const updateDefaultGroupTypeId = (defaultGroupTypeId: string) => {
    setSettings(prev => ({ ...prev, defaultGroupTypeId }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updatePageSize, updateStudentRoleId, updateDefaultGroupTypeId }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
