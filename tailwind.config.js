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
      },
      fontSize: {
        xxs: ['0.625rem', '0.875rem'],
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
