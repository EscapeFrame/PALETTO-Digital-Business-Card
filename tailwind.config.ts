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
        paletto: {
          sky: '#87CEEB',
          'sky-light': '#B0E0E6',
          'sky-dark': '#5DADE2',
          white: '#FFFFFF',
          'white-soft': '#F8FBFF',
        },
      },
      backgroundImage: {
        'gradient-paletto': 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #FFFFFF 100%)',
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #E0F4FF 50%, #87CEEB 100%)',
        'gradient-soft': 'linear-gradient(180deg, #F8FBFF 0%, #E0F4FF 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
