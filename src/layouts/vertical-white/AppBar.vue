<template>
  <div>
    <v-sheet class="header-backup"></v-sheet>
    <v-app-bar
      :color="$vuetify.theme.dark ? 'dark' : getThemeMode.appBarColor"
      :dark="getThemeMode.appBarColor != 'white' ? true : false"
      app
      class="px-sm text-left shadow-sm ma-4 rounded-lg"
      flat
      height="75"
      title="title"
    >

      <v-progress-linear
        :active="getThemeMode.isLoading"
        :indeterminate="getThemeMode.isLoading"
        absolute
        bottom
        color="primary"
      />
      <v-btn icon @click="$router.go(-1)" v-if="shouldShowBackBtn">
        <v-icon>mdi-chevron-left</v-icon>
        <span>{{lastVisitedPage}}</span>
      </v-btn>

      <h4 class="page-title">{{ currentRouteName }}</h4>
     <search-bar v-if="shouldShowSearchBar" />
        
      </v-chip>

    </v-app-bar>

    <!-- userDrawer -->
    
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SearchBar from "../../components/custom_components/SearchBar.vue";
export default {
  name: "VerticallAppBar",
  components: {
    SearchBar,
    UserDrawer: () => import("../common-drawer/UserDrawer.vue"),
  },
  computed: {
    ...mapGetters(["getThemeMode", "getSearchquery"]),
    currentRouteName() {
      console.log("routeParams: ", this.$route.params);
      const titleParam = this.$route.params.title;

      if (this.$route.name === "BaumKontrollDetails") {
        return `Baumkontrolle (${this.$route.params.treeName})`;
      } else {
        return titleParam || this.$route.name;
      }
    },
    shouldShowSearchBar() {
      const pagesWithSearchBar = [
        "Baumartliste",
        "Insektenlist",
        "Massnahme",
        "Holzzersetzende Pilze",
        "Bewuchs",
        "Vogel",
        "Kafer",
        "Spinnentiere",
        "Säugetiere",
        "Weitere Stoffeinträge",
        "Standort/Sozialgefüge",
        "Bedeckung",
        "Gesundheit",
        "Parasit",
        "Verkehrssicherheit",
        "Benutzerliste",
        "Inventar",
        "Pflegeplan",
        "Baumliste",
        "Baumkontrolle"
      ];
      return pagesWithSearchBar.includes(this.$route.name);
    },

    shouldShowBackBtn() {
      const pagesWithoutBackbtn = [
        "Inventar",
        "Baumliste",
        "Pflegeplan",
        "Baumkontrolle",
        "Berichte generieren",
        "Suchen",
        "Verwaltung",
      ];
      return !pagesWithoutBackbtn.includes(this.$route.name);
    },
  },
  searchBaumartListe(query) {
    console.log("Searching in the Tree Type List", query);
  },

  data() {
    return {
      workTypes: [],
      baumarts: [],
      // getSearchquery:'',
      pageTitle: "Default Title",
      lastVisitedPage: "",
      userDrawer: false,
      notificationDrawer: false,
      searchDrawer: false,
      navbarOptions: {
        elementId: "main-navbar",
        isUsingVueRouter: true,
        mobileBreakpoint: 992,
        brandImagePath: "./",
        brandImageAltText: "brand-image",
        collapseButtonOpenColor: "#661c23",
        collapseButtonCloseColor: "#661c23",
        showBrandImageInMobilePopup: true,
        ariaLabelMainNav: "Main Navigation",
        tooltipAnimationType: "shift-away",
        menuOptionsLeft: [
          {
            type: "link",
            text: "Dashboard",
            iconLeft: '<i class="mdi mdi-view-dashboard"></i>',
            subMenuOptions: [
              {
                type: "link",
                text: "Learning Management",
                path: { name: "learning-management" },
                iconLeft: '<i class="mdi mdi-circle-medium"></i>',
              },

              {
                type: "link",
                text: "Job Management",
                path: { name: "job-management" },
                iconLeft: '<i class="mdi mdi-circle-medium"></i>',
              },
              {
                type: "link",
                text: "Analytic",
                path: { name: "analytic" },
                iconLeft: '<i class="mdi mdi-circle-medium"></i>',
              },
              {
                type: "link",
                text: "Cryptocurrency",
                path: { name: "crypto-currency" },
                iconLeft: '<i class="mdi mdi-circle-medium"></i>',
              },
              {
                type: "link",
                text: "Sales",
                path: { name: "sales" },
                iconLeft: '<i class="mdi mdi-circle-medium"></i>',
              },
              {
                type: "link",
                text: "Subscription",
                path: { name: "donation" },
                iconLeft: '<i class="mdi mdi-circle-medium"></i>',
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions([
      "changeVerticalSidebarDrawer",
      "changeVerticalSidebarMini",
      "signOut",
      "updategetSearchquery",
    ]),
    setPageTitle(from) {
      const currentRoute = this.$route;
      this.pageTitle = currentRoute.meta.title || "Default Title";

      if (history.state && history.state.previousTitle) {
        this.lastVisitedPage = history.state.previousTitle;
      }
    },
    // handleSearch(query) {
    //   // this.$emit('search',query)
    //   //   if(this.currentRouteName === "Baumartliste") {
    //   //       this.searchBaumartliste(query);
    //   //   }
    //   //   else if(this.currentRouteName === "Massnahme") {
    //   //       this.searchMassnahme(query);
    //   //   }
    //   console.log(query);
    //   this.updategetSearchquery(query);
    // },
    searchBaumartliste(query) {
      console.log("Searching Baumartliste", query);

      this.baumarts = this.baumarts.filter((baumart) => {
        baumart.bname.toLowerCase().includes(query.toLowerCase());
      });
    },
    toggleVerticalSidebarDrawer() {
      this.changeVerticalSidebarDrawer();

      // this.$emit("update:mini-variant");
      // console.log("check");
    },
    logoutUser() {
      this.signOut();

      this.$router.push("/app/sessions/sign-in-two");
    },
  },
  created() {
    this.setPageTitle();

    console.log(this.getSearchquery)

    this.previousRoute = history.state && history.state.route;

    this.$router.beforeEach((to, from, next) => {
      this.setPageTitle();
      this.previousRoute = from;
      next();
    });
  },
};
</script>

<style lang="scss">
.header-backup {
  display: block;
  width: 100%;
  height: 102px;
  position: fixed;
  top: 0;
  z-index: 5;
  background: linear-gradient(
    180deg,
    hsla(0, 0%, 97.3%, 0.95) 44%,
    hsla(0, 0%, 97.3%, 0.46) 73%,
    hsla(0, 0%, 100%, 0)
  ) !important;
  left: 0;
  &.theme--dark {
    background: linear-gradient(
      180deg,
      rgba(5, 5, 5, 0.95) 44%,
      rgba(0, 0, 0, 0.46) 3%,
      hsla(0, 0%, 100%, 0)
    ) !important;
  }
}
.tippy-box[data-theme~="light"] {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.vnb {
  background: transparent !important;
  &__menu-options {
    margin-top: 3px !important;
    &__option {
      &__link {
        &:focus {
          outline: none;
          border: 1px solid none;
        }
        &:hover {
          color: #0081ff;
          .vnb__menu-options__option__arrow {
            fill: #0081ff;
          }
        }

        &__icon {
          svg {
            fill: #0081ff !important;
          }
        }
      }
    }
  }

  &__sub-menu-options {
    &__option {
      &__link {
        &:focus {
          outline: none;
          border: 1px solid none;
        }
        color: #000 !important;
        &:hover {
          color: #0081ff !important;
        }
      }
    }
  }
}

.vnb__collapse-button {
  &:focus {
    border: 1px solid none;
    outline: none;
  }
  &:after {
    content: "\F035C";
    font-size: 25px;
    font-weight: 600;
    font-family: "Material Design Icons";
  }
  svg {
    display: none !important;
  }
}

.vnb__popup {
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: scroll !important;
  .vnb__popup__top__close-button {
    &:focus {
      border: 1px solid none;
      outline: none;
    }
    top: 20px;
    right: -33px;
    svg {
      fill: #000 !important;
    }
  }
}

.page-title {
  display: block;
  text-align: center;
  margin: 0 auto;
}
</style>
