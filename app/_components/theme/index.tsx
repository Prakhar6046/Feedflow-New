'use client'; // Ensure this is a Client Component

import React, { useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import {
  ThemeProvider as MUIThemeProvider,
  ThemeOptions,
  createTheme,
} from '@mui/material/styles';

import customShadows from './customShadows';
import GlobalStyles from './globalStyles';
import componentsOverride from './overrides';
import palette from './palette';
import shadows from './shadows';
import typography from './typography';
import useSettings from '@/app/hooks/useSettings';

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const { themeMode } = useSettings();

  // Determine the mode based on themeMode and system preference
  const mode: 'light' | 'dark' =
    themeMode === 'system'
      ? typeof window !== 'undefined' && window?.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : 'light' // Fallback in case window.matchMedia is not available
      : themeMode;

  // Define theme options using useMemo
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: palette(mode),
      typography,
      shape: { borderRadius: 8 },
      shadows: shadows(mode),
      customShadows: customShadows(mode),
    }),
    [mode],
  );

  // Create the theme and apply component overrides
  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </MUIThemeProvider>
  );
}
