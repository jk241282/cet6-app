/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        sidebar: '#1e1b4b',
        coral: {
          50: '#fff5f5',
          400: '#FF6B6B',
          500: '#FF5252',
        },
        mint: {
          50: '#f0fdfa',
          400: '#4ECDC4',
          500: '#2EC4B6',
        },
        sunny: {
          50: '#fffbeb',
          400: '#FFE66D',
          500: '#FFD93D',
        },
        sky: {
          50: '#f0f9ff',
          400: '#45B7D1',
          500: '#38A3C5',
        },
        cream: '#FFFBF5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        fun: ['Fredoka', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'fun': '0 4px 20px rgba(139, 92, 246, 0.15)',
        'fun-lg': '0 8px 32px rgba(139, 92, 246, 0.2)',
        'coral': '0 4px 16px rgba(255, 107, 107, 0.2)',
        'mint': '0 4px 16px rgba(78, 205, 196, 0.2)',
        'sunny': '0 4px 16px rgba(255, 230, 109, 0.25)',
        'card': '0 2px 16px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pop': 'pop 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
