import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#1a1814',
          light: '#3d3a35',
          muted: '#6b6760',
          subtle: '#9e9b97',
        },
        parchment: {
          DEFAULT: '#fafaf8',
          dark: '#f0efe9',
          border: '#e4e2dc',
        },
        gold: {
          DEFAULT: '#c8922a',
          light: '#e8b84b',
          muted: '#d4a853',
        },
      },
    },
  },
  plugins: [],
}

export default config