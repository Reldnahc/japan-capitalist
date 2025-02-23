/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['"Fredoka One"', 'cursive'],
        baloo: ['"Baloo 2"', 'cursive'],
        yuji: ['"Yuji Mai"', 'serif'],
      },
      textShadow: {
        'white-outline': '-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white',
        'gold': '0px 1px 2px rgba(255, 215, 0, 0.9), 0px 3px 5px rgba(0, 0, 0, 0.8)'
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(253, 224, 71, 0.8)' },
          '50%': { boxShadow: '0 0 10px 5px rgba(253, 224, 71, 0.8)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'gold-glow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        lightningFlash: {
        '0%, 100%': { opacity: '0' },
        '2%': { opacity: '1' },
        '4%': { opacity: '0' },
        '6%': { opacity: '1' },
        '8%': { opacity: '0' },
        },
        click: {
          '0%': {
            transform: 'scale(1)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(2.5)',
            opacity: '0',
          },
        },
      },
      animation: {
        glow: 'glow 1.5s ease-in-out infinite',
        shine: 'shine 2s infinite',
        'gold-glow': 'gold-glow 3s ease infinite',
        lightningFlash: 'lightningFlash 4s infinite',
        click: 'click 0.6s ease-out',

      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(45deg, #ccac00, #d4af37, #f6e27a, #b08904)',
        'gold-hover': 'linear-gradient(45deg, #ccac00, #d4af37, #f6e27a, #b08904)',
      },
      boxShadow: {
        'gold-inner': 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.4)',
        'gold-outer': '0 4px 6px rgba(0, 0, 0, 0.6)'
      }
    }
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
}