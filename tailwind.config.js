// const { colors } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    { pattern: /([a-zA-Z]+)-./ },
    // TODO: Consider to save space
    // { pattern: /(bg|text|border)-./ }
  ],
  // purge: ['./components/**/*.js', './pages/**/*.js'],
  // theme: {
  //   extend: {
  //     fontSize: {
  //       '7xl': '5rem',
  //       '8xl': '7rem',
  //       '9xl': '10rem',
  //       '10xl': '15rem',
  //     },
  //     height: {
  //       '72': '20rem',
  //       '80': '24rem',
  //       '88': '30rem',
  //     },
  //     colors: {
  //       pink: '#e6007e',
  //       purple: '#b71fed',
  //       gray: {
  //         '100': '#f5f5f5',
  //         '200': '#eeeeee',
  //         '300': '#e0e0e0',
  //         '400': '#bdbdbd',
  //         '500': '#9e9e9e',
  //         '600': '#757575',
  //         '700': '#616161',
  //         '800': '#424242',
  //         '900': '#212121',
  //       },
  //     },
  //   },
  // },
  variants: {
    margin: ['responsive', 'first', 'last'],
    borderWidth: ['responsive', 'first', 'last'],
  },
  theme: {
    extend: {
      lineHeight: {
        tight: '1.1',
      },
    },
  },
  plugins: [],
};
