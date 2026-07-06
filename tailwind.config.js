/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif']
      },
      colors: {
        nz: {
          blue: '#1E50A0',
          'blue-dark': '#163f80',
          'blue-light': '#EAF1FB',
          navy: '#0F2A5F',
          orange: '#F26A21',
          'orange-light': '#FEF0E7',
          green: '#1E8A5F',
          'green-light': '#E7F6EE',
          amber: '#B7791F',
          'amber-light': '#FBF2E2',
          red: '#C23B3B',
          'red-light': '#FBEAEA',
          slate: '#5B6472',
          surface: '#F5F7FA',
          border: '#E2E6EC'
        }
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 42, 95, 0.06), 0 1px 3px 0 rgba(15, 42, 95, 0.08)',
        panel: '0 4px 16px -2px rgba(15, 42, 95, 0.12)',
        phone: '0 20px 60px -10px rgba(15, 42, 95, 0.35)'
      },
      borderRadius: {
        xl2: '1rem'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: 0, transform: 'translateX(24px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideUp: 'slideUp 0.25s ease-out',
        slideInRight: 'slideInRight 0.3s ease-out',
        pulseSoft: 'pulseSoft 1.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
