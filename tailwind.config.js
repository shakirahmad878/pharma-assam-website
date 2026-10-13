/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          bg: '#090907',          // Base deep obsidian dark
          surface: '#11110e',     // Slightly elevated dark surface
          surfaceLight: '#181712',// Higher card layer
          border: '#282319',      // Subtle edge highlight
          borderLight: '#3d3424', // Neomorphic light rim
          primary: '#6C5636',     // Rich deep warm bronze / amber brass
          primaryLight: '#8A7049',// Elevated bronze highlight
          primaryDark: '#4A3B24', // Deep recessed bronze shadow
          accent: '#B99D73',      // Soft champagne golden sand highlight
          accentLight: '#D4BD95', // Gleam champagne
          accentDark: '#8F7550',  // Muted antique gold
          textPrimary: '#F2ECE1', // Warm pearlescent ivory white
          textSecondary: '#B99D73',// Champagne subtitle / muted text
          textMuted: '#857866',    // Dark antique gold muted text
        },
        pharma: {
          50: '#f7f4ed',
          100: '#eee7d8',
          200: '#dfd2b7',
          300: '#cbb68f',
          400: '#B99D73',
          500: '#6C5636',
          600: '#5c482c',
          700: '#4b3a23',
          800: '#382b1a',
          900: '#1d170d',
          950: '#090907',
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
