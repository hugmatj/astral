const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: ['./resources/js/**/*.vue', './resources/views/**/*.blade.php'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: colors.emerald,
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        orbitron: ['Orbitron', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: ['0.625rem', '0.875rem'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(-7%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
    },
  },

  plugins: [
    require('tailwindcss-scoped-groups')({
      groups: ['one', 'two'],
    }),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
