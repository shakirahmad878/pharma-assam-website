/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pharma: {
          50: '#f0f6fa',
          100: '#e0edf5',
          200: '#c2dcee',
          300: '#94c2e2',
          400: '#5fa3d1',
          500: '#3b86be',
          600: '#2b6ba1',
          700: '#245683',
          800: '#1e4468',
          900: '#0f2d4a',
          950: '#0a192f',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#059669',
          600: '#047857',
          700: '#065f46',
        },
        tealbrand: {
          50: '#f0fdfa',
          500: '#0d9488',
          600: '#0f766e',
          700: '#115e59',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"SF Mono"', 'Consolas', 'Monaco', 'monospace'],
      }
    },
  },
  plugins: [],
}
