<template>
  <router-view />
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: "App",
  metaInfo() {
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: "Tilia",
      // all titles will be injected into this template
      titleTemplate:
        "%s | App "
    };
  },
  methods: {
    ...mapActions(["createTableAction","updateSearchQuery"]),
    getRouterParams() {
      // console.log(this.$router.currentRoute.query);
    },
    clearSearchQuery () {
      this.updateSearchQuery("");
    }

  },
  watch: {
    $route() {
      this.clearSearchQuery();
    }

  },
  created() {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", e => {
      console.log(mq);
      this.$vuetify.theme.dark = e.matches;
    });
    this.getRouterParams();
   // this.createTableAction()
  }
};
</script>
