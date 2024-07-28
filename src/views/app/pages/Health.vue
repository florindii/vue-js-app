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
        Neue Gesundheit
      </v-btn>
    </v-col>
    <v-data-table
      :key="healthUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="healths"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-health
      :health="{ name: '', description:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-health
      :key="healthUpdateKey"
      :health="selectedHealth"
      :visible="dialogType === 'update'"
      :id="selectedHealth.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateHealth from "./CreateHealth";
import UpdateHealth from "./UpdateHealth";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateHealth,
    UpdateHealth
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Beschreibung", value: "description" },
        
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      healthUpdateKey:null,
      healthList:[],
      isLoading: false,
      dialogType:'',
      selectedHealth: {},
      localSearch: null
      
    };
  },
  computed: {
    ...mapGetters([ "getSearchquery","healths"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getHealthTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchHealths", "createHealth", "updateHealth"]),
    editHealth(health) {
      this.selectedHealth = { ...health };
      this.dialogType = 'update';
    },
//    test() {
  //    console.log("search: ", this.getCoverageTypeResults);
   // },

    openModal(type, health) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedHealth = { ...health };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedHealth = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createHealth(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateHealth(item);
      console.log("Item updated")
      this.UpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchHealths()
        .then(() => {
      //    this.$store.commit("setCoverageTypeResults", response.data);
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
  .search-box {
  width: 120px;
  margin-left: 10px;
  margin-top: 2px;
  outline: none;
}

@media screen and (min-width: 768px) {
  /* adjust the styles for iPad Air */
  .search-box {
    width: 200px;
    margin-left: 20px;
  }
}
</style>