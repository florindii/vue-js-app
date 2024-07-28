// Locale
// import { en } from '../../locale'
import colors from "vuetify/lib/util/colors";
export const themeConfig = {
  disableCustomizer: true, // options[Boolean] : true, false(default)

  rtl: false, // options[Boolean] : true, false(default)
  verticalSidebarMini: false, // options[Boolean] : true, false(default)
  verticalSidebarDrawer: true, // options[Boolean] : true, false(default)
  verticalCompactSidebarDrawer: true, // options[Boolean] : true, false(default)
  verticalSaasSidebarDrawer: true, // options[Boolean] : true, false(default)
  showBreadcrumb: true, // options[Boolean] : true, false(default)

  layout: "VerticalWhiteSidebar", //VerticalCompactSidebar,VerticalSaasLayout,VerticalSidebar,HorizontalBar
  isLoading: false,

  isDark: true,
  verticalSidebarDrawerColor: "dark", // primary,white,sucsess,warning,etc
  appBarColor: "white" // primary,white,sucsess,warning,etc
};

const mq = window.matchMedia("(prefers-color-scheme: light)");

// export const vuetify = new Vuetify({
//   theme: { dark: mq.matches }
// });

// console.log(mq);

// mq.addEventListener("change", e => {
//   console.log(mq);
//   this.$vuetify.theme.dark = e.matches;
// });

export const themePreset = {
  breakpoint: {
    scrollBarWidth: 16,
    thresholds: {
      xs: 600,
      sm: 960,
      md: 1280,
      lg: 1920
    }
  },
  rtl: false,
  theme: {
    dark: true, // Force dark theme
    default: "dark",
    disable: false,
    options: {
      cspNonce: undefined,
      customProperties: true,
      minifyTheme: undefined,
      themeCache: undefined
    },
    themes: {
      dark: {
        primary: colors.green,
        secondary: colors.blue,
        success: colors.green,
        danger: colors.red,
        warning: colors.deepOrange,
        info: colors.indigo
      }
    }
  }
};
