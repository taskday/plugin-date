const colors = require("tailwindcss/colors");
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./vendor/laravel/jetstream/**/*.blade.php",
    "./resources/**/*.blade.php",
    "./resources/**/*.{ts,js,vue}",
    "./vendor/taskday/**/resources/**/*.{ts,js,vue}",
    "./storage/framework/views/*.php",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans]
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            color: "inherit",
            strong: {
              color: "inherit"
            },
            a: {
              color: "inherit"
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'inherit'
            },
            "ul li p": {
              margin: 0
            }
          }
        }
      }),
      colors: {
        gray: {
         '050': '#F8FAFC',
         '100': '#EAEFF4',
         '200': '#CFD6DE',
         '300': '#AEB7C3',
         '400': '#86909D',
         '500': '#606A77',
         '600': '#404955',
         '700': '#272E38',
         '800': '#171C24',
         '900': '#0C1016'
        }
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography")({
      className: 'ProseMirror',
    }),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/forms")
  ]
};
