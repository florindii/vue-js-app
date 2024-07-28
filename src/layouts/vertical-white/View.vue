<template>
  <v-main app :style="setFixHeight">
    <v-container class="pt-12" fluid>
      <!-- If using vue-router -->
      <!-- <customizer /> -->
      <v-expand-transition mode="out-in">
        <router-view />
      </v-expand-transition>
    </v-container>
    <div class="flex-grow-1"></div>
    <!-- <app-footer></app-footer> -->
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    AppFooter: () => import("./Footer")
    // Customizer: () => import("@/layouts/common-drawer/Customizer"),
  },
  computed: {
    ...mapGetters(["getThemeMode"]),
    setFixHeight(){
      if(this.$route.path == "/app/pages/create-inventar" || this.$route.path.startsWith("/app/pages/create-tree") || this.$route.path.startsWith("/app/pages/edit-inventar") || this.$route.path.startsWith("/app/pages/edit-tree")){
        return "margin-top:20px;height:100vh; overflow:hidden;position:fixed;"
      }
    }
  }
};
</script>

<style lang="scss">

</style>
