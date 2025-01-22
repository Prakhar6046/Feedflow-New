import { CssBaseline } from "@mui/material";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SettingsValueProps } from "./_components/settings/types";
import "./globals.css";
import StoreProvider from "./StoreProvider";
// Define the default settings according to SettingsValueProps
const settings: SettingsValueProps = {
  themeMode: "light",
  themeLayout: "horizontal",
  autoThemeMode: true,
  themeStretch: false,
};

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "Feedflow ",
    template: "%s | Feedflow",
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
        <SpeedInsights />
        {/* <SettingsProvider defaultSettings={settings}>
        <ThemeProvider> */}
        <CssBaseline />
        <body className={inter.className}>{children}</body>
        {/* </ThemeProvider>
      </SettingsProvider> */}
      </StoreProvider>
    </html>
  );
}
