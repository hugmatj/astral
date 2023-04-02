import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

export default {
  content: ['./resources/views/**/*.vue', './resources/views/**/*.blade.php'],
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
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config
