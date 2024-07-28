<template>
  <v-container fluid>
    <v-col cols="3">
      <v-btn
        block
        height="42px"
        color="#1db954"
        class="download-btn"
        @click="showModal"
      >
        <v-icon>mdi mdi-plus-thick</v-icon>
        Neue Baumart
      </v-btn>
    </v-col>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="baumarts"
        :loading="isLoading"
        :search="testVal"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="green--text mr-2" @click="editItem(item)"
            >mdi-pencil-outline</v-icon
          >
        </template>
      </v-data-table>
    </v-card>
    <baumart-create
      :item-list="baumarts"
      :visible="showModalDialog"
      @close="closeModalDialog"
    ></baumart-create>
    <baumart-update
      :baumart="selectedItem"
      :item-list="baumarts"
      :visible="showUpdateDialog"
      @close="closeUpdateDialog"
    ></baumart-update>
  </v-container>
</template>

<script>
import axios from "axios";
import BaumartCreate from "./BaumartCreate";
import BaumartUpdate from "./BaumartUpdate";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    BaumartCreate,
    BaumartUpdate
  },
  data() {
    return {
      headers: [
        { text: "Abbreviation", value: "abbreviation" },
        { text: "Latin Name", value: "latinName" },
        { text: "German Name", value: "germanName" },
        { text: "", value: "actions", sortable: false }
      ],
      baumarts: [],
      baumartUpdateKey: null,
      isLoading: false,
      showModalDialog: false,
      showUpdateDialog: false,
      selectedItem: {},
      localSearch: null
    };
  },
  computed: {
    ...mapGetters(["getBaumartlisteResults", "getSearchquery"]),

    testVal() {
      return this.getSearchquery;
    }
  },
  mounted() {
    console.log(this.getBaumartlisteResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    test() {
      console.log("search: ", this.getBaumartlisteResults);
    },
    fetchData() {
      this.isLoading = true;
      axios
        .get("https://tilia.rrota.org/api/TreeType/GetAll")
        .then(response => {
          this.$store.commit("setBaumartlisteResults", response.data);
          this.baumarts = response.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
        });
    },
    handleSearch(query) {
      this.getSearchquery = query;
    },

    showModal() {
      this.showModalDialog = true;
    },
    closeModalDialog() {
      this.showModalDialog = false;
    },
    editItem(item) {
      this.selectedItem = item;
      this.showUpdateDialog = true;
    },
    closeUpdateDialog() {
      this.showUpdateDialog = false;
      this.selectedItem = {};
    }
  },
};
</script>
<style>
.add-button {
  outline: none !important;
  margin-bottom: 10px;
  width: 220px;
}

@media screen and (min-width: 768px) {
  /* adjust the styles for iPad Air */
  .search-box {
    width: 200px;
    margin-left: 20px;
  }
}
</style>
