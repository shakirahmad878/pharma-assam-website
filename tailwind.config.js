/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1724',
          900: '#10243A', // Primary Midnight Navy
          800: '#182F49', // Secondary Deep Navy
          700: '#234468',
          600: '#325C8A',
        },
        teal: {
          accent: '#18A6A6', // Primary Teal Accent
          deep: '#137F83',   // Deep Teal
          light: '#E6F7F7',  // Soft Teal Surface
          50: '#F0FAFA',
          100: '#D5F2F2',
          500: '#18A6A6',
          600: '#137F83',
          700: '#0E6063',
        },
        clinical: {
          white: '#FFFFFF',     // Clinical White
          bg: '#F5F8FA',        // Soft Background
          surface: '#FFFFFF',   // Surface Card
          muted: '#F1F6F8',     // Muted Surface
          border: '#DCE4EB',    // Subtle Borders
          borderDark: '#CBD5E1',// Defined border
          lightBlue: '#E8EEF4', // Light Blue-Gray
          textPrimary: '#1E293B',   // Primary Text
          textSecondary: '#64748B', // Secondary Text
          textMuted: '#94A3B8',     // Muted Text
        },
        neu: {
          bg: '#F5F8FA',
          surface: '#FFFFFF',
          surfaceLight: '#F8FAFC',
          border: '#DCE4EB',
          borderLight: '#E2E8F0',
          primary: '#10243A',
          primaryLight: '#182F49',
          primaryDark: '#0B1724',
          accent: '#18A6A6',
          accentLight: '#22B8B8',
          accentDark: '#137F83',
          textPrimary: '#1E293B',
          textSecondary: '#64748B',
          textMuted: '#94A3B8',
        },
      },
      boxShadow: {
        'neu-flat': '5px 5px 12px #040403, -5px -5px 12px #141410',
        'neu-raised': '7px 7px 16px #030302, -7px -7px 16px #171611',
        'neu-pressed': 'inset 4px 4px 8px #040403, inset -4px -4px 8px #181712',
        'neu-sunken': 'inset 6px 6px 14px #030302, inset -6px -6px 14px #1c1a14',
        'neu-gold': '0 4px 20px -2px rgba(185, 157, 115, 0.25), 4px 4px 10px #030302',
        'neu-button': '4px 4px 10px #040403, -3px -3px 8px #1c1b14',
        'neu-button-active': 'inset 3px 3px 6px #040403, inset -3px -3px 6px #1c1b14',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"SF Mono"', 'Consolas', 'Monaco', 'monospace'],
      }
    },
  },
  plugins: [],
}
