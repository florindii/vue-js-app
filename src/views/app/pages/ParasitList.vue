<template>
  <div>
    <v-col cols="3">
      <v-btn
        block
        height="42px"
        color="#1db954"
        class="download-btn"
        @click="openModal('create')"
      >
        <v-icon >mdi mdi-plus-thick</v-icon>
        Neue parasit
      </v-btn>
    </v-col>
    <v-data-table
      :key="parasitUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="parasits"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-parasit
      :parasit="{ abbreviation: '', germanName: '', latinName: '' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-parasit
      :key="parasitUpdateKey"
      :parasit="selectedParasit"
      :visible="dialogType === 'update'"
      :id="selectedParasit.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateParasit from "./CreateParasit";
import UpdateParasit from "./UpdateParasit";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateParasit,
    UpdateParasit
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Latin", value: "latinName" },
        { text: "Deutsch", value: "germanName" },
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      parasitUpdateKey:null,
      parasitList:[],
      isLoading: false,
      dialogType:'',
      selectedParasit: {},
      localSearch: null
    };
  },
    computed: {
    ...mapGetters([ "getSearchquery","parasits"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getParasitTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchParasits", "createParasit", "updateParasit"]),
    editParasit(parasit) {
      this.selectedParasit = { ...parasit };
      this.dialogType = 'update';
    },
   //   test() {
  //    console.log("search: ", this.getCoverageTypeResults);
  //  },

    openModal(type, parasit) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedParasit = { ...parasit };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedParasit = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createParasit(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateParasit(item);
      console.log("Item updated")
      this.parasitUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchParasits()
        .then(() => {
    //      this.$store.commit("setCoverageTypeResults", response.data);
          this.coverages = response.data;
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
  },

};
</script>
<style>
  .download-btn {
   
    margin-bottom:23px;
  }

</style>