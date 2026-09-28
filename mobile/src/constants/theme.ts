/**
 * RepPulse Design System & Theme Tokens
 * Modeled after SefMed Enterprise SFA visual aesthetic
 */

export const colors = {
  // Brand Header & Accent
  primary: '#3B82F6',       // Vibrant Medical Sky-Blue
  primaryDark: '#1D4ED8',   // Deep Blue
  primaryLight: '#93C5FD',  // Soft Sky Blue
  primaryHeader: '#60A5FA', // Header Gradient Top
  primaryBackground: '#EFF6FF',

  // Status & Accents
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  info: '#06B6D4',
  infoLight: '#CFFAFE',

  // Tile Pastel Palettes (Matches Screenshot 1)
  tileVisits: '#F3E8FF',    // Soft Lavender / Purple
  tileVisitsIcon: '#8B5CF6',
  tileClients: '#FCE7F3',   // Soft Pink / Rose
  tileClientsIcon: '#EC4899',
  tileFirms: '#DCFCE7',     // Soft Mint Green
  tileFirmsIcon: '#10B981',
  tileHospitals: '#F1F5F9', // Soft Slate / Lavender Grey
  tileHospitalsIcon: '#64748B',
  tileRoutes: '#E0F2FE',    // Soft Cyan / Light Blue
  tileRoutesIcon: '#0EA5E9',
  tileDCR: '#FFEDD5',       // Soft Peach / Orange
  tileDCRIcon: '#F97316',

  // Floating Action Button
  fabOrange: '#F97316',

  // Neutrals & Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  surfaceMuted: '#E2E8F0',

  // Drawer Colors
  drawerBackground: '#93C5FD',
  drawerHeader: '#60A5FA',
  drawerItemText: '#1E3A8A',
  drawerItemActive: '#DBEAFE',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',

  // Typography
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: '#2563EB',
  accentNavy: '#0F172A',
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xxs: 10,
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 22,
    xxl: 26,
    hero: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '900' as const,
  },
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  tile: 22,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  floating: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};
