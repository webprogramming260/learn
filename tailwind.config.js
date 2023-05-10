/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/*.{html,tsx,jsx}', './index.html'],
  theme: {
    extend: {
      animation: {
        wiggle: 'wiggle 1s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)',
          },

          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)',
          },

          '30%, 50%, 70%': {
            transform: 'translate3d(-3px, 0, 0)',
          },

          '40%, 60%': {
            transform: 'translate3d(3px, 0, 0)',
          },
        },
      },
    },
  },
  plugins: [],
};
