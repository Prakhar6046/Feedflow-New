import { CssBaseline } from '@mui/material';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from './StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    absolute: '',
    default: 'Feedflow ',
    template: '%s | Feedflow',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <CssBaseline />
        <body className={inter.className}>
          {children}
          <SpeedInsights />
        </body>
      </StoreProvider>
    </html>
  );
}
