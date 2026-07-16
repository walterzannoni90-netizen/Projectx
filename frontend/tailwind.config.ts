import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6FAF7', 100: '#B3EFE7', 200: '#80E4D7', 300: '#4DD9C7',
          400: '#1ACDB6', 500: '#00BFA6', 600: '#00A58F', 700: '#008B79',
          800: '#007162', 900: '#00574C', 950: '#003D35',
        },
        secondary: { 300: '#31A8B1', 400: '#168F9A', 500: '#007C87', 600: '#006B74', 700: '#005A62' },
        magenta: { 300: '#FF70B4', 400: '#FF4FA2', 500: '#FF2D8F', 600: '#E61978' },
        orange: { 300: '#FFB04D', 400: '#FF9D26', 500: '#FF8A00', 600: '#E67C00' },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
