/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'Tajawal-Medium': ['Tajawal-Medium', 'sans-serif'],
        'Arboria-Light': ['Arboria-Light', 'sans-serif'],
        'Arboria-Medium': ['Arboria-Medium', 'sans-serif'],
        GE_SS_Text_Medium: ['GE_SS_Text_Medium', 'sans-serif'],
      },
      fontSize: {
        xxs: '.5rem',
        xs: '.6rem',
        md: '.7rem',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
