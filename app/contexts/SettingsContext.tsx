'use client';
import Cookies from 'js-cookie';
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

import { defaultSettings, cookiesExpires, cookiesKey } from '@/config';
import {
  SettingsContextProps,
  SettingsValueProps,
  ThemeLayout,
  ThemeMode,
} from '../_components/settings/types';

const initialState: SettingsContextProps = {
  ...defaultSettings,
  onToggleMode: () => undefined,
  onChangeMode: () => undefined,
  onToggleAutoMode: () => undefined,
  onToggleLayout: () => undefined,
  onChangeLayout: () => undefined,
  onToggleStretch: () => undefined,
};

const SettingsContext = createContext(initialState);

type SettingsProviderProps = {
  children: ReactNode;
  defaultSettings: SettingsValueProps;
};

function SettingsProvider({
  children,
  defaultSettings,
}: SettingsProviderProps) {
  const [settings, setSettings] = useSettingCookies(defaultSettings);

  useEffect(() => {
    setSettings((settings) =>
      settings.autoThemeMode
        ? {
            ...settings,
            themeMode:
              typeof window !== 'undefined' &&
              window?.matchMedia &&
              window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light',
          }
        : settings,
    );
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings((settings) =>
        settings.autoThemeMode
          ? { ...settings, themeMode: e.matches ? 'dark' : 'light' }
          : settings,
      );
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const onToggleMode = () => {
    setSettings((settings) => ({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    }));
  };

  const onToggleAutoMode = () => {
    setSettings((settings) => ({
      ...settings,
      autoThemeMode: !settings.autoThemeMode,
      themeMode: !settings.autoThemeMode
        ? typeof window !== 'undefined' &&
          window?.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : settings.themeMode,
    }));
  };

  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const themeMode = event.target.value as ThemeMode;
    setSettings((settings) => ({
      ...settings,
      themeMode,
      autoThemeMode: false,
    }));
  };

  const onToggleLayout = () => {
    setSettings((settings) => ({
      ...settings,
      themeLayout: settings.themeLayout === 'vertical' ? 'mini' : 'vertical',
    }));
  };

  const onChangeLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((settings) => ({
      ...settings,
      themeLayout: event.target.value as ThemeLayout,
    }));
  };

  const onToggleStretch = () => {
    setSettings((settings) => ({
      ...settings,
      themeStretch: !settings.themeStretch,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        onToggleMode,
        onToggleAutoMode,
        onChangeMode,
        onToggleLayout,
        onChangeLayout,
        onToggleStretch,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };

function useSettingCookies(
  defaultSettings: SettingsValueProps,
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);

  useEffect(() => {
    Cookies.set(cookiesKey.themeMode, settings.themeMode, {
      expires: cookiesExpires,
    });
    Cookies.set(cookiesKey.autoThemeMode, String(settings.autoThemeMode), {
      expires: cookiesExpires,
    });
    Cookies.set(cookiesKey.themeLayout, settings.themeLayout, {
      expires: cookiesExpires,
    });
    Cookies.set(
      cookiesKey.themeStretch,
      JSON.stringify(settings.themeStretch),
      {
        expires: cookiesExpires,
      },
    );
  }, [settings]);

  return [settings, setSettings];
}
