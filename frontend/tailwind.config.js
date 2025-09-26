/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: '#FFFFFF',
        primary: {
          DEFAULT: '#1E3A8A',
          hover: '#1E40AF',
          light: '#DBEAFE',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#EFF6FF',
          foreground: '#FFFFFF'
        },
        neutral: {
          DEFAULT: '#64748B',
          dark: '#1E293B',
          border: '#E2E8F0',
          bg: '#F1F5F9'
        },
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#059669'
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706'
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#DC2626'
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}