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
          blue: '#0164A9',
          'blue-dark': '#005298',
          'blue-light': '#DCEEFB',
          navy: '#212529',
          orange: '#66CC33',
          'orange-light': '#EAF7DC',
          green: '#71B32F',
          'green-light': '#EAF7E2',
          amber: '#B7791F',
          'amber-light': '#FBF2E2',
          red: '#C23B3B',
          'red-light': '#FBEAEA',
          slate: '#5B6472',
          surface: '#EDF7FF',
          border: '#D1D1D1'
        }
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(33, 37, 41, 0.06), 0 1px 3px 0 rgba(33, 37, 41, 0.08)',
        panel: '0 4px 16px -2px rgba(33, 37, 41, 0.12)',
        phone: '0 20px 60px -10px rgba(33, 37, 41, 0.35)'
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
