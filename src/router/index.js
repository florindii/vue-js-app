/*
 * ============================
 * File: index.js
 * Project: Octavia-Admin
 * File Created: Thursday, 9th April 2020 2:11:05 am
 * Author:UILIB
 * AuthorUrl:https://ui-lib.com/
 * -----
 * Last Modified: Saturday, 18th April 2020 9:32:52 pm
 * Modified By: naime hossain (naime.hossain93@gmail.com)
 * -----
 * Copyright 2020 - 2021 UILIB, UILIB
 * ============================
 */

// Imports
import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import authenticate from "@/auth/authenticate";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash };
    if (savedPosition) return savedPosition;

    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      component: () => import("@/views/app/Index"),
      beforeEnter: authenticate,
      // redirect: "/app/pages/Blank",
      redirect: "/app/pages/inventar",

      children: [
        // {
        //   path: "layout/:layout",
        //   component: () => import("@/views/app/Index")
        // },

        {
          path: "/app/pages",
          component: () => import("@/views/app/pages/Pages"),
          children: [
            {
              path: "blank",
              name: "Blank",
              component: () => import("@/views/app/pages/Blank")
            },
            { 
              name:"Neues Inventar",
              path: "create-inventar",
              component: () => import("@/views/app/pages/InventarComponents/CreateInventar")
            },
            { 
              name:"Inventar bearbeiten",
              path: "edit-inventar/:id/:year",
              props:true,
              component: () => import("@/views/app/pages/InventarComponents/EditInventar")
            },
            {
              path: "management",
              name: "Verwaltung",
              component: () => import("@/views/app/pages/MenagemantPage")
            },
            {
              path: "management/benutzerliste",
              name: "Benutzerliste",
              component: () => import("@/views/app/pages/UserList")
            },
            {
              path: "management/benutzerliste/CreateUser",
              name: "Neue Benutzer",
              component: () => import("@/views/app/pages/CreateUser")
            },
            {
              path: "management/Benutzerliste/UpdateUser/:id",
              name: "Bearbeiten benutzer",
              component: () => import("@/views/app/pages/UpdateUser"),
            },
            {
              path: "management/benutzerliste/ViewUser/:id",
              name: "Benutzer Info",
              component: () => import("@/views/app/pages/ViewUser")
            },
            {
              path: "management/Baumart",
              name: "Baumartliste",
              component: () => import("@/views/app/pages/BaumartList")
            },
            {
              path:"management/Insekten",
              name:"Insektenlist",
              component :() => import ("@/views/app/pages/InsectList")
            },
            {
              path:"management/HolzzersetzendePilze",
              name:"Holzzersetzende Pilze",
              component :() => import ("@/views/app/pages/MushroomTypeList")
            },
            {
              path:"management/Massnahme",
              name:"Massnahme",
              component :() => import ("@/views/app/pages/WorkTypeList")
            },
            {
              path:"management/bewuchs",
              name:"Bewuchs",
              component :() => import ("@/views/app/pages/VegetationList")
            },
            {
              path:"management/Vogel",
              name:"Vogel",
              component :() => import ("@/views/app/pages/BirdList")
            },
            {
              path:"management/Kafer",
              name:"Kafer",
              component :() => import ("@/views/app/pages/BeetleList")
            },
            {
              path:"management/Spinnentiere",
              name:"Spinnentiere",
              component :() => import ("@/views/app/pages/ArachnidList")
            },
            {
              path:"management/Saugetiere",
              name:"Säugetiere",
              component :() => import ("@/views/app/pages/MammalsList")
            },
            {
              path:"management/WeitereStofeintrage",
              name:"Weitere Stoffeinträge",
              component :() => import ("@/views/app/pages/SubstancesList")
            },
            {
              path:"management/StandortSozialgefuge",
              name:"Standort/Sozialgefüge",
              component :() => import ("@/views/app/pages/LocationList")
            },
            {
              path:"management/Bedeckung",
              name:"Bedeckung",
              component :() => import ("@/views/app/pages/CoverageList")
            },
            {
              path:"management/Health",
              name:"Gesundheit",
              component :() => import ("@/views/app/pages/Health")
            },
            {
              path:"management/Parasit",
              name:"Parasit",
              component :() => import ("@/views/app/pages/ParasitList")
            },
            {
              path:"management/RoadSafety",
              name:"Verkehrssicherheit",
              component :() => import ("@/views/app/pages/RoadSafetyList")
            },
            {
              path:"management/MaterialListe",
              name:"Material Liste",
              component :() => import ("@/views/app/pages/MaterialList")
            },
            {
              path:"GlobalSearch",
              name:"Suchen",
              component: () => import ("@/views/app/pages/GlobalSearch"),
              meta: {
                requiredAuth: true,
              }

            },
            {
              path: "inventar",
              name: "Inventar",
              component: () => import("@/views/app/pages/Inventar")
            },
            {
              path: "inventarInfo",
              name: "InventarInfo",
              component: () => import("@/views/app/pages/InventarInfo")
            },
            {
              path: "view-map/:id/:year/:coord",
              name: "Inventarliste",
              component: () => import("@/views/app/pages/map/ViewInventoryMap")
            },
            {
              path: "Tasks",
              name: "Pflegeplan",
              component: () => import("@/views/app/pages/Tasks"),
              meta: {
                requireInventar: true
              }
            },
            {
              path: "BaumList",
              name: "Baumliste",
              component: () => import("@/views/app/pages/BaumList"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "create-tree/:inventoryId",
              name: "NeuerBaum",
              component: () => import("@/views/app/pages/CreateTree"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "edit-tree/:treeId",
              name: "Bearbeiten",
              component: () => import("@/views/app/pages/EditTree"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "TaskProfil",
              name: "TaskProfil",
              component: () => import("@/views/app/pages/TaskProfil"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "CreateTask",
              name: "Neue Pflegemassnahme",
              component: () => import("@/views/app/pages/CreateTask"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "EditTask",
              name: "Pflegemassnahme bearbeiten",
              component: () => import("@/views/app/pages/EditTask"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "BaumProfil",
              name: "BaumProfil",
              component: () => import("@/views/app/pages/BaumProfil"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "BaumkontrolleList",
              name: "Baumkontrolle",
              component: () => import("@/views/app/pages/BaumControlList"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "tree-list-map",
              name: "TreeList",
              component: () => import("@/views/app/pages/map/viewTreeMap"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "tree-selected-map",
              name: "TreeSelected",
              component: () => import("@/views/app/pages/map/MapForSelectedItems"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "BaumControlDetails",
              name: "BaumKontrollDetails",
              component: () => import("@/views/app/pages/BaumControlDetails"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
            {
              path: "BerichteGenerieren",
              name: "Berichte generieren",
              component: () => import("@/views/app/pages/BerichteGenerieren"),
              meta: {
                requiredAuth: true,
                requireInventar: true
              }
            },
          ]
        }
      ]
    },
    {
      path: "/app/sessions",
      component: () => import("@/views/app/sessions/Sessions"),

      children: [
        {
          path: "sign-in",
          component: () => import("@/views/app/sessions/SignIn")
        },
        {
          path: "error",
          component: () => import("@/views/app/sessions/Error")
        },
        {
          path: "forgot",
          component: () => import("@/views/app/sessions/Forgot")
        },
        {
          path: "changepassword",
          component: () => import("@/views/app/sessions/ChangePassword")
        },
        {
          path: "forgotpassword",
          component: () => import("@/views/app/sessions/ResetPassword")
        },
        {
          path: "lockscreen",
          component: () => import("@/views/app/sessions/Lockscreen")
        },
        {
          path: "sign-in-two",
          name: "login",
          component: () => import("@/views/app/sessions/SignInTwo")
        },
        {
          path: "sign-in-three",
          component: () => import("@/views/app/sessions/SignInThree")
        },
        {
          path: "sign-in-four",
          component: () => import("@/views/app/sessions/SignInFour")
        },
        {
          path: "sign-in-five",
          component: () => import("@/views/app/sessions/SignInFive")
        },
        {
          path: "sign-up",
          component: () => import("@/views/app/sessions/SignUp")
        },
        {
          path: "sign-up-2",
          name: "signup",
          component: () => import("@/views/app/sessions/SignUpTwo")
        },
        {
          path: "sign-up-5",
          component: () => import("@/views/app/sessions/SignUpFive")
        }
      ]
    }
  ]
});
  

router.beforeEach((to, from, next) => {
  // If this isn't an initial page load.

  //check for requirement of inventar
  if (to.meta.requireInventar && store.getters.inventarId == null) {
    next({name: 'Inventar'})
  }

  if (to.path) {
    // Start the route progress bar.
    store.dispatch("changeThemeLoadingState", true);
  }
  next();
});

router.afterEach(() => {
  // Remove initial loading
  // const gullPreLoading = document.getElementById("loading_wrap");
  // if (gullPreLoading) {
  //   gullPreLoading.style.display = "none";
  // }
  // Complete the animation of the route progress bar.
  setTimeout(() => store.dispatch("changeThemeLoadingState", false), 500);
  // NProgress.done();
  // if (isMobile) {
  // if (window.innerWidth <= 1200) {
  //   // console.log("mobile");
  //   store.dispatch("changeSidebarProperties");
  //   if (store.getters.getSideBarToggleProperties.isSecondarySideNavOpen) {
  //     store.dispatch("changeSecondarySidebarProperties");
  //   }
  //   if (store.getters.getCompactSideBarToggleProperties.isSideNavOpen) {
  //     store.dispatch("changeCompactSidebarProperties");
  //   }
  // } else {
  //   if (store.getters.getSideBarToggleProperties.isSecondarySideNavOpen) {
  //     store.dispatch("changeSecondarySidebarProperties");
  //   }
  //   // store.state.sidebarToggleProperties.isSecondarySideNavOpen = false;
  // }
});

export default router;
