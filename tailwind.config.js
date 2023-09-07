// const { colors } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Using cdn.tailwindcss.com so no need for config right now
    // All styles - do not use!
    // { pattern: /([a-zA-Z]+)-./ },
    // Subset patters - really slow to compile
    // { pattern: /(mt|mr|mb|ml|)-./ },
    // { pattern: /(pt|pr|pb|pl|)-./ },
    // {
    //   pattern: /(bg|text|border|w|h|opacity|font|leading)-./,
    // },
    // Much faster, but need to list every variation
    // 'block',
    // 'flex',
    // 'grid',
    // 'relative',
    // 'absolute',
    // 'sticky',
    // 'uppercase',
    // 'lowercase',
    // 'capitalize',
    // 'normal-case',
  ],
  plugins: [],
};
