import { Platform } from 'react-native';

/**
 * CORE DESIGN SYSTEM (Prompt.Md Palette + Architectural Precision Geometry)
 * Palette: Moss (#2E4036), Clay (#CC5833), Cream (#F2F0E9), Charcoal (#1A1A1A)
 * Geometry: Sharp, technical, architectural (2px - 6px radii, hairline 1px borders, zero bubble excess)
 */
export const COLORS = {
  moss: '#2E4036',
  mossDark: '#1E2B24',
  mossLight: '#3E5649',
  mossMuted: 'rgba(46, 64, 54, 0.09)',

  clay: '#CC5833',
  clayDark: '#A84322',
  clayLight: '#E0724E',
  clayMuted: 'rgba(204, 88, 51, 0.12)',

  cream: '#F2F0E9',
  creamElevated: '#FAF9F5',
  creamSubtle: '#E6E3D8',
  creamBorder: '#CFCBC0',

  charcoal: '#1A1A1A',
  charcoalElevated: '#242624',
  charcoalBorder: '#353835',
  charcoalMuted: '#5A5D5A',

  white: '#FFFFFF',

  // Status Semantic Colors
  statusOpen: '#CC5833',       // 1. Aberta (Clay)
  statusAnalysis: '#B8821E',   // 2. Em análise (Ochre/Amber)
  statusProgress: '#285F7A',   // 3. Em andamento (Technical Petrol Blue)
  statusResolved: '#2E6B47',   // 4. Resolvida (Botanical Green)

  // Telemetry Indicators
  telemetryGreen: '#2FC474',
  telemetryWarning: '#E5951A',
  telemetryDanger: '#D94426',
};

export const FONTS = {
  sansBold: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: '"Plus Jakarta Sans", "Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
  }),
  sansRegular: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
  }),
  serifItalic: Platform.select({
    ios: 'Georgia-Italic',
    android: 'serif',
    default: '"Cormorant Garamond", Georgia, serif',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: '"JetBrains Mono", Menlo, Consolas, monospace',
  }),
};

/**
 * Architectural & Technical Instrument Radii (No excessive rounded corners)
 */
export const RADII = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 6,
  xxl: 8,
  xxxl: 8,
  pill: 4,
};

export const SHADOWS = {
  card: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  floatingIsland: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  clayGlow: {
    shadowColor: '#CC5833',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
};
