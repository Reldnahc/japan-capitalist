/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['"Fredoka One"', 'cursive'], // Add the Fredoka One font
        baloo: ['"Baloo 2"', 'cursive'], // Add Baloo 2 to the font family list
        yuji: ['"Yuji Mai"', 'serif'],
      },
      textShadow: {
        'white-outline': '-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white',
        // Creates white shimmer/outline
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(253, 224, 71, 0.8)' },
          '50%': { boxShadow: '0 0 10px 5px rgba(253, 224, 71, 0.8)' },
        },
      },
      animation: {
        glow: 'glow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),

  ],
}

