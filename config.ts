// LAYOUT

import { SettingsValueProps } from './app/_components/settings/types';

export const HEADER = {
  H_MOBILE: 64,
  H_MAIN_DESKTOP: 50,
  H_DASHBOARD_DESKTOP: 50,
  H_DASHBOARD_DESKTOP_OFFSET: 50 - 32,
};

export const NAV = {
  W_BASE: 260,
  W_DASHBOARD: 280,
  W_DASHBOARD_MINI: 88,
  H_DASHBOARD_ITEM: 48,
  H_DASHBOARD_ITEM_SUB: 36,
  H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
  NAV_ITEM: 24,
  NAV_ITEM_HORIZONTAL: 22,
  NAV_ITEM_MINI: 22,
};

// SETTINGS
// Please remove `localStorage` when you change settings.

export const cookiesExpires = 3;

export const cookiesKey = {
  themeMode: 'themeMode',
  autoThemeMode: 'autoThemeMode',
  themeLayout: 'themeLayout',
  themeStretch: 'themeStretch',
};

export const defaultSettings: SettingsValueProps = {
  themeMode: 'light',
  autoThemeMode: true,
  themeStretch: false,
  themeLayout: 'mini',
};

// Remove AUTH_LOGIN_URL and AUTH_VERIFY_URL as they are related to next-auth
// export const AUTH_LOGIN_URL = "/auth/login";
// export const AUTH_VERIFY_URL = "/auth/verify";

// Remove getAuthErrorMessage function as it is specific to next-auth error handling
// export function getAuthErrorMessage(error: string) {
//	switch (error) {
//		case "EmailSignin":
//			return "Sending the verification token to the provided email address failed, this is usually because of an invalid email address.";
//		case "AccessDenied":
//			return "Access to your account has been denied.";
//		case "Verification":
//			return "The verification token has expired or has already been used. This can happen if you click on a verification link in an old email.";
//		case "SessionRequired":
//		case "OAuthSignin":
//		case "OAuthCallback":
//		case "OAuthCreateAccount":
//		case "EmailCreateAccount":
//		case "Callback":
//		case "OAuthAccountNotLinked":
//		case "Configuration":
//		case "Default":
//		default:
//			return "An unexpected error has occurred. Please try again later.";
//	}
// }

export const QUALICHECK_ORGANISATION_ID = 'cl76axbqn000909l79hziigvk';

// Remove reloadSession if it's no longer needed
// export const reloadSession = () => {
//	const event = new Event("visibilitychange");
//	document.dispatchEvent(event);
//};
