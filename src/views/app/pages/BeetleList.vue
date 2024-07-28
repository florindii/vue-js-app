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
        Neue Käfer
      </v-btn>
    </v-col>
    <v-data-table
      :key="beetleUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="beetles"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-beetle
      :beetle="{ abbreviation: '', name:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-beetle
      :key="beetleUpdateKey"
      :beetle="selectedBeetle"
      :visible="dialogType === 'update'"
      :id="selectedBeetle.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateBeetle from "./CreateBeetle";
import UpdateBeetle from "./UpdateBeetle";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateBeetle,
    UpdateBeetle
  },
  data() {
    return {
      headers: [
        { text: "Abkürzung", value: "abbreviation" },
        { text: "namme", value: "name" },
        
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      beetleUpdateKey:null,
      beetleList:[],
      isLoading: false,
      dialogType:'',
      selectedBeetle: {},
      localSearch: null
    };
  },
   computed: {
    ...mapGetters(["getSearchquery","beetles"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getBeetleTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchBeetles", "createBeetle", "updateBeetle"]),
    editBeetle(beetle) {
      this.selectedBeetle = { ...beetle };
      this.dialogType = 'update';
    },
 //    test() {
 //     console.log("search: ", this.getBeetleypeResults);
  //  },

    openModal(type,beetle) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedBeetle = { ...beetle };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedBeetle = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createBeetle(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateBeetle(item);
      console.log("Item updated")
      this.beetleUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchBeetles()
        .then(() => {
          this.$store.commit("setBeetleTypeResults", response.data);
          this.beetles = response.data;
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