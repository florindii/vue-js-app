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
        Neue Vogel
      </v-btn>
    </v-col>
    <v-data-table
      :key="birdUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="birds"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-bird
      :bird="{ abbreviation: '', name:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-bird
      :key="birdUpdateKey"
      :bird="selectedBird"
      :visible="dialogType === 'update'"
      :id="selectedBird.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateBird from "./CreateBird";
import UpdateBird from "./UpdateBird";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateBird,
    UpdateBird
  },
  data() {
    return {
      headers: [
        { text: "Abkürzung", value: "abbreviation" },
        { text: "namme", value: "name" },
        
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      birdUpdateKey:null,
      birdList:[],
      isLoading: false,
      dialogType:'',
      selectedBird: {},
      localSearch: null
    };
  },
  computed: {
    ...mapGetters([ "getSearchquery","birds"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getBirdTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchBirds", "createBird", "updateBird"]),
    editBird(bird) {
      this.selectedBird = { ...bird };
      this.dialogType = 'update';
    },
   //  test() {
  //    console.log("search: ", this.getBirdTypeResults);
  //  },

    openModal(type,bird) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedBird = { ...bird };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedBird = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createBird(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateBird(item);
      console.log("Item updated")
      this.birdUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchBirds()
        .then(() => {
       //   this.$store.commit("setBirdTypeResults", response.data);
          this.birds = response.data;
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


</style>