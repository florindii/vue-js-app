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
        Neue Stoffeinträge
      </v-btn>
    </v-col>
    <v-data-table
      :key="substanceUpdateKey"
      :headers="headers"
      :search ="testVal"
      :items="substances"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-substance
      :substance="{ abbreviation: '', name:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-substance
      :key="substanceUpdateKey"
      :substance="selectedSubstance"
      :visible="dialogType === 'update'"
      :id="selectedSubstance.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateSubstance from "./CreateSubstance";
import UpdateSubstance from "./UpdateSubstance";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateSubstance,
    UpdateSubstance
  },
  data() {
    return {
      headers: [
        { text: "Abkürzung", value: "abbreviation" },
        { text: "namme", value: "name" },
        
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      substanceUpdateKey:null,
      substanceList:[],
      isLoading: false,
      dialogType:'',
      selectedSubstance: {},
      localSearch:null,
    };
  },
    computed: {
    ...mapGetters([ "getSearchquery","substances"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getSubstanceTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchSubstances", "createSubstance", "updateSubstance"]),
    editSubstance(substance) {
      this.selectedSubstance = { ...substance };
      this.dialogType = 'update';
    },
 //    test() {
 //     console.log("search: ", this.getSubstanceTypeResults);
 //   },

    openModal(type,substance) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedSubstance = { ...substance };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedSubstance = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createSubstance(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateSubstance(item);
      console.log("Item updated")
      this.substanceUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchSubstances()
        .then(() => {
          this.$store.commit("setSubstanceTypeResults", response.data);
          this.substances = response.data;
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