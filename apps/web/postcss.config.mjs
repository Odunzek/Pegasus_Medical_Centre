/*
  PostCSS setup for the website. Its only job is to run Tailwind CSS v4, which reads
  src/app/globals.css (the design tokens in @theme) and generates the utility classes
  the components use. There is no tailwind.config.js in Tailwind v4; see CLAUDE.md "Code rules".
*/
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
