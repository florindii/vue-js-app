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
        Neue Säugetiere
      </v-btn>
    </v-col>
    <v-data-table
      :key="mammalUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="mammals"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-mammal
      :mammal="{ abbreviation: '', name:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-mammal
      :key="mammalUpdateKey"
      :mammal="selectedMammal"
      :visible="dialogType === 'update'"
      :id="selectedMammal.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateMammal from "./CreateMammal";
import UpdateMammal from "./UpdateMammal";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateMammal,
    UpdateMammal
  },
  data() {
    return {
      headers: [
        { text: "Abkürzung", value: "abbreviation" },
        { text: "namme", value: "name" },
        
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      mammalUpdateKey:null,
      mammalList:[],
      isLoading: false,
      dialogType:'',
      selectedMammal: {},
      localSearch: null
    };
  },
   computed: {
    ...mapGetters([ "getSearchquery","mammals"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getMammalTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchMammals", "createMammal", "updateMammal"]),
    editMammal(mammal) {
      this.selectedMammal = { ...mammal };
      this.dialogType = 'update';
    },

    openModal(type,mammal) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedMammal = { ...mammal };
      }
    },
   //    test() {
   //   console.log("search: ", this.getMammalTypeResults);
    closeModal() {
      this.dialogType = '';
      this.selectedMammal = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createMammal(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateMammal(item);
      console.log("Item updated")
      this.mammalUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchMammals()
        .then(() => {
       //   this.$store.commit("setMammalTypeResults", response.data);
          this.mammals = response.data;
          this.isLoading = false;
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
<style>
  .add-button {
  outline: none !important;
    margin-bottom:10px;
    width:220px;
    }

</style>