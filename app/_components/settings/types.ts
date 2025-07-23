export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeLayout = 'vertical' | 'horizontal' | 'mini';
export type ThemeStretch = boolean;

export type SettingsValueProps = {
  themeMode: ThemeMode;
  themeLayout: ThemeLayout;
  autoThemeMode: boolean;
  themeStretch: ThemeStretch;
};

export type SettingsContextProps = {
  themeMode: ThemeMode;
  themeLayout: ThemeLayout;
  themeStretch: boolean;

  // Mode
  onToggleMode: VoidFunction;
  onToggleAutoMode: VoidFunction;
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // Layout
  onToggleLayout: VoidFunction;
  onChangeLayout: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // Stretch
  onToggleStretch: VoidFunction;
};
