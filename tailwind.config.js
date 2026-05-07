/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#2D6A4F',
          light: '#52B788',
          pale:  '#D8F3DC',
          dark:  '#1B4332',
          50:  '#F0FBF4',
          100: '#D8F3DC',
          200: '#B7E4C7',
          300: '#74C69D',
          400: '#52B788',
          500: '#40916C',
          600: '#2D6A4F',
          700: '#1B4332',
          800: '#133328',
          900: '#0C2A1F',
        },
        yellow: {
          DEFAULT: '#F4A261',
          light:   '#FFDDD2',
          dark:    '#E76F51',
          50:  '#FFF8F3',
          100: '#FFDDD2',
          200: '#FFBC8B',
          300: '#F4A261',
          400: '#E08A45',
          500: '#C96B2A',
        },
        blue: {
          DEFAULT: '#457B9D',
          light:   '#A8DADC',
          pale:    '#E1EEF6',
          50:  '#EAF4FB',
          100: '#BDD7E7',
          200: '#6BAED6',
          300: '#457B9D',
          400: '#2B6CB0',
          500: '#1A4971',
        },
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body:    ['Open Sans', 'sans-serif'],
        sans:    ['Open Sans', 'sans-serif'],
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:  '0 2px 20px rgba(45,106,79,0.08)',
        hover: '0 8px 30px rgba(45,106,79,0.15)',
      },
      animation: {
        'fade-up':  'fadeUp 0.5s ease forwards',
        'fade-in':  'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateX(-20px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}
