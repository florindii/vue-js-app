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
        Neue Spinnentiere
      </v-btn>
    </v-col>
    <v-data-table
      :key="arachnidUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="arachnids"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-arachnid
      :arachnid="{ abbreviation: '', name:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-arachnid
      :key="arachnidUpdateKey"
      :arachnid="selectedArachnid"
      :visible="dialogType === 'update'"
      :id="selectedArachnid.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateArachnid from "./CreateArachnid";
import UpdateArachnid from "./UpdateArachnid";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateArachnid,
    UpdateArachnid
  },
  data() {
    return {
      headers: [
        { text: "Abkürzung", value: "abbreviation" },
        { text: "namme", value: "name" },
        
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      arachnidUpdateKey:null,
      arachnidList:[],
      isLoading: false,
      dialogType:'',
      selectedArachnid: {},
      localSearch: null
    };
  },
   computed: {
    ...mapGetters([ "getSearchquery","arachnids"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getArachnidTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchArachnids", "createArachnid", "updateArachnid"]),
    editArachnid(arachnid) {
      this.selectedArachnid = { ...arachnid };
      this.dialogType = 'update';
    },
   // test() {
  //    console.log("search: ", this.getCoverageTypeResults);
  //  },
    openModal(type,arachnid) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedArachnid = { ...arachnid };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedArachnid = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createArachnid(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateArachnid(item);
      console.log("Item updated")
      this.arachnidUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchArachnids()
        .then(() => {
    //      this.$store.commit("setArachnidTypeResults", response.data);
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