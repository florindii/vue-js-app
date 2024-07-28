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
        Neues Insekt
      </v-btn>
    </v-col>
    <v-data-table
      :key="insectUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="insects"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-insect
      :insect="{ abbreviation: '', germanName: '', latinName: '' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-insect 
      :key="insectUpdateKey"
      :insect="selectedInsect"
      :visible="dialogType === 'update'"
      :id="selectedInsect.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateInsect from "./CreateInsect";
import UpdateInsect from "./UpdateInsect";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateInsect,
    UpdateInsect
  },
  data() {
    return {
      headers: [
        { text: "Abkürzung", value: "abbreviation" },
        { text: "Latin", value: "latinName" },
        { text: "Deutsch", value: "germanName" },
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      insectUpdateKey:null,
      insectList:[],
      isLoading: false,
      dialogType:'',
      selectedInsect: {},
      localSearch: null
    };
  },
  computed: {
    ...mapGetters([ "getSearchquery","insects"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getInsectTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchInsects", "createInsect", "updateInsect"]),
    editInsect(insect) {
      this.selectedInsect = { ...insect };
      this.dialogType = 'update';
    },
//    test() {
//      console.log("search: ", this.getInsectTypeResults);
 //   },
    openModal(type, insect) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedInsect = { ...insect };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedInsect = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createInsect(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.UpdateInsect(item);
      console.log("Item updated")
      this.insectUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchInsects()
        .then(() => {
          this.isLoading = false;
          this.$store.commit("setInsectTypeResults", response.data);
          this.insects = response.data;
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
        });
    }
  },
    handleSearch(query) {
      this.getSearchquery = query;
    },
};
</script>


</style>