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
        Neue pilzarten
      </v-btn>
    </v-col>
    <v-data-table
      :key="mushroomUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="mushrooms"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-mushroom-type
      :mushroom="{ abbreviation: '', germanName: '', latinName: '' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-mushroom-type
      :key="mushroomUpdateKey"
      :mushroom="selectedMushroom"
      :visible="dialogType === 'update'"
      :id="selectedMushroom.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateMushroomType from "./CreateMushroomType";
import UpdateMushroomType from "./UpdateMushroomType";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateMushroomType,
    UpdateMushroomType
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
      mushroomUpdateKey:null,
      mushroomList:[],
      isLoading: false,
      dialogType:'',
      selectedMushroom: {},
      localSearch: null
    };
  },
   computed: {
    ...mapGetters([ "getSearchquery","mushrooms"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getMushroomTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchMushrooms", "createMushroom", "updateMushroom"]),
    editMushroom(mushroom) {
      this.selectedMushroom = { ...mushroom };
      this.dialogType = 'update';
    },
  //   test() {
  //    console.log("search: ", this.getMushroomTypeResults);
  //  },

    openModal(type, mushroom) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedMushroom = { ...mushroom };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedMushroom = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createMushroom(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateMushroom(item);
      console.log("Item updated")
      this.mushroomUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchMushrooms()
        .then(() => {
          this.isLoading = false;
          this.$store.commit("setMushroomTypeResults", response.data);
          this.baumarts = response.data;
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
  .download-btn {
   
    margin-bottom:23px;
  }

</style>