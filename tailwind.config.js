// const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.js'],
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
  },
  plugins: [],
};
