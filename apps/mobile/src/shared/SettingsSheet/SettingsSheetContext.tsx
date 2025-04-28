import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type SettingsSheetContextType = {
  visible: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const SettingsSheetContext = createContext<SettingsSheetContextType | undefined>(undefined);

export const useSettingsSheet = (): SettingsSheetContextType => {
  const ctx = useContext(SettingsSheetContext);
  if (!ctx) throw new Error('useSettingsSheet must be used within a SettingsSheetProvider');
  return ctx;
};

export const SettingsSheetProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);

  const openSettings = useCallback(() => setVisible(true), []);
  const closeSettings = useCallback(() => setVisible(false), []);

  return (
    <SettingsSheetContext.Provider value={{ visible, openSettings, closeSettings }}>
      {children}
    </SettingsSheetContext.Provider>
  );
};