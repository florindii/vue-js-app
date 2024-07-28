<template>
  <div>
    <v-text-field
      v-model="searchText"
      class="search-box"
      append-icon="mdi-magnify"
      label="suchen"
      single-line
      hide-details
    ></v-text-field>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(["getSearchquery"]),

    searchText: {
      get() {
        return this.getSearchquery;
      },
      set(value) {
        this.updateSearchQuery(value);
      },
    },
  },
  // watch: {
  //   search(newValue) {
  //     this.$emit("search", newValue);
  //   },
  // },
  methods: {
    ...mapActions(["updateSearchQuery"]),
  },
};
</script>

<style>
.search-box {
  width: 120px;
  margin-left: 10px;
  margin-top: 2px;
  outline: none;
}

@media screen and (min-width: 768px) {
  .search-box {
    width: 200px;
    margin-left: 20px;
  }
}
</style>
