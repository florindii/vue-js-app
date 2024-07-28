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
        Neue Bedeckung
      </v-btn>
    </v-col>
    <v-data-table
      :key="coverageUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="coverages"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-coverage
      :coverage="{ abbreviation: '', name:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-coverage
      :key="coverageUpdateKey"
      :coverage="selectedCoverage"
      :visible="dialogType === 'update'"
      :id="selectedCoverage.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateCoverage from "./CreateCoverage";
import UpdateCoverage from "./UpdateCoverage";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    CreateCoverage,
    UpdateCoverage
  },
  data() {
    return {
      headers: [
        { text: "Abkürzung", value: "abbreviation" },
        { text: "namme", value: "name" },
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      coverageUpdateKey:null,
      coverageList:[],
      isLoading: false,
      dialogType:'',
      selectedCoverage: {},
      localSearch: null
    };
  },
   computed: {
    ...mapGetters([ "getSearchquery","coverages"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    // console.log(this.getCoverageTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    // this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchCoverages", "createCoverage", "updateCoverage"]),
    editCoverage(coverage) {
      this.selectedCoverage = { ...coverage };
      this.dialogType = 'update';
    },
    // test() {
    //   console.log("search: ", this.getCoverageTypeResults);
    // },

    openModal(type,coverage) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedCoverage = { ...coverage };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedCoverage = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createCoverage(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateCoverage(item);
      console.log("Item updated")
      this.coverageUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
  console.log("fetchData started");
  this.isLoading = true;
  this.fetchCoverages()
    .then((response) => {
     // this.$store.commit("setCoverageTypeResults", response.data);
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
.mr-2 {
  border: 1px solid #494949;
  padding: 3px;
  border-radius: 5px;
  width: 42px;
  height: 42px;
  margin-left:-60px !important;


}
    .add-button {
  outline: none !important;
    margin-bottom:10px;
    width:220px;
    }
  
</style>