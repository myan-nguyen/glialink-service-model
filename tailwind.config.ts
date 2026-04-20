import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#7c3aed',
          dark: '#5b21b6',
          light: '#a78bfa',
          pale: '#ede9fe',
          ghost: '#f5f3ff',
        },
        ink: {
          DEFAULT: '#111114',
          light: '#2a2a30',
          muted: '#605f6b',
          subtle: '#9d9ba7',
        },
        surface: {
          DEFAULT: '#ffffff',
          tint: '#faf9fc',
          border: '#e8e4ef',
        },
      },
      animation: {
        'fade-in': 'fadeIn 400ms ease-out forwards',
        'fade-up': 'fadeUp 500ms ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config