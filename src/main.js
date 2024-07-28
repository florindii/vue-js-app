/*
 * ============================
 * File: main.js
 * Project: Octavia-Admin
 * File Created: Thursday, 9th April 2020 2:11:05 am
 * Author:UILIB
 * AuthorUrl:https://ui-lib.com/
 * -----
 * Last Modified: Tuesday, 14th April 2020 7:17:10 pm
 * Modified By: naime hossain (naime.hossain93@gmail.com)
 * -----
 * Copyright 2020 - 2021 UILIB, UILIB
 * ============================
 */

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import vuetify from "./plugins/vuetify";
import "./plugins";
import moment from 'moment';
import { CapacitorSQLite } from '@capacitor-community/sqlite';



import octaviaKit from "@/plugins/octavia.kit";
// axios
import axios from "axios";
import VueAxios from "vue-axios";

// import VueApexCharts from 'vue-apexcharts';
// mock
import "./fake-db/index.js";

const getToken = localStorage.getItem("token");
const token = JSON.parse(getToken)

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// Vue.component('apexchart', VueApexCharts);

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM.YYYY')
  }
});

Vue.filter('formatFullDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD.MM.YYYY')
  }
});

Vue.use(octaviaKit);
Vue.config.productionTip = false;
// if (process.env.NODE_ENV === "development") {
//   makeServer();
// }

export const eventBus = new Vue(); // creating an event bus.

// SQL Tables










new Vue({
  store,
  router,
  vuetify,
  CapacitorSQLite,
  render: h => h(App)
}).$mount("#app");
