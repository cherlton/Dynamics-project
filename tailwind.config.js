/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#080f17',
          900: '#0f1b29', // Deep signature Gaspar navy
          850: '#132235',
          800: '#182a40',
          700: '#233d5d',
          600: '#325682',
          500: '#4876b0',
          200: '#cbdbe9',
          100: '#e5eef7',
          50: '#f5f8fc',
        },
        navy: {
          900: '#0f1b29',
          800: '#152437',
          700: '#1d324b',
        },
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#1E3A8A',
          700: '#0F1B29',
          800: '#0C1622',
          900: '#080E16',
        },
        gray: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        success: '#15803D',
        warning: '#B45309',
        danger: '#B91C1C',
        sidebar: '#0F1B29',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['1.85rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        'section-title': ['1.2rem', { lineHeight: '1.6rem', fontWeight: '600' }],
        'body': ['0.925rem', { lineHeight: '1.45rem' }],
        'helper': ['0.8rem', { lineHeight: '1.15rem' }],
      },
      borderRadius: {
        'none': '0px',
        'card': '0px',
        'sm': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
      },
      maxWidth: {
        'card': '780px',
      },
      boxShadow: {
        'card': '0 20px 40px -15px rgba(15, 27, 41, 0.12), 0 0 0 1px rgba(15, 27, 41, 0.05)',
        'card-hover': '0 24px 48px -12px rgba(15, 27, 41, 0.18)',
        'formal': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'sidebar': '4px 0 16px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'step-next': 'stepNext 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'step-prev': 'stepPrev 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'progress': 'progressFill 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stepNext: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        stepPrev: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
