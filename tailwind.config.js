// const { colors } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // { pattern: /([a-zA-Z]+)-./ },
    { pattern: /(mt|mr|mb|ml|)-./ },
    { pattern: /(pt|pr|pb|pl|)-./ },
    {
      pattern: /(bg|text|border|w|h|opacity|font|leading)-./,
    },
    'block',
    'flex',
    'grid',
    'relative',
    'absolute',
    'sticky',
    'uppercase',
    'lowercase',
    'capitalize',
    'normal-case',
  ],
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
