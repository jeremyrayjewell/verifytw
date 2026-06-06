/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-ink': '#102A43',
        'civic-blue': '#2563A6',
        'data-teal': '#159A9C',
        'data-teal-text': '#0B6F71',
        'island-green': '#4F8F6B',
        'stamp-red': '#C94C4C',
        'stamp-red-text': '#9F2F2F',
        'rice-paper': '#F8F3E7',
        'form-gray': '#E7E2D8',
        'support-blue-gray': '#DCE6F1',
        surface: '#FFFFFF',
        neutral: {
          50: '#F9F8F6',
          100: '#F4F2ED',
          200: '#E7E2D8',
          300: '#D9D4C8',
          400: '#CCCAB1',
          500: '#B8B39A',
          600: '#8E8B7A',
          700: '#696660',
          800: '#4A4743',
          900: '#2C2824',
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans TC"',
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        serif: ['"Noto Serif TC"', 'system-ui', 'serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '0' }],
        sm: ['14px', { lineHeight: '18px', letterSpacing: '0' }],
        base: ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        lg: ['18px', { lineHeight: '28px', letterSpacing: '0' }],
        xl: ['20px', { lineHeight: '28px', letterSpacing: '0' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '0' }],
        '3xl': ['32px', { lineHeight: '40px', letterSpacing: '0' }],
        '4xl': ['40px', { lineHeight: '48px', letterSpacing: '0' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '64px',
      },
      borderRadius: {
        none: '0',
        xs: '4px',
        sm: '6px',
        base: '8px',
        md: '12px',
        lg: '16px',
        full: '9999px',
      },
      transitionDuration: {
        fast: '120ms',
        base: '180ms',
        slow: '250ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        enter: 'cubic-bezier(0, 0, 0.2, 1)',
        exit: 'cubic-bezier(0.4, 0, 1, 1)',
        emphasized: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(16, 42, 67, 0.06)',
        base: '0 2px 8px 0 rgba(16, 42, 67, 0.08)',
        md: '0 4px 12px 0 rgba(16, 42, 67, 0.1)',
        lg: '0 8px 24px 0 rgba(16, 42, 67, 0.12)',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.focus-ring': {
          '@apply outline-none ring-2 ring-civic-blue ring-offset-2': {},
        },
        '.truncate-lines-2': {
          '@apply line-clamp-2': {},
        },
        '.truncate-lines-3': {
          '@apply line-clamp-3': {},
        },
      });
    },
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'animate-reduced': () => ({
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }),
        },
        { values: theme('animation') }
      );
    },
  ],
};

module.exports = config;
