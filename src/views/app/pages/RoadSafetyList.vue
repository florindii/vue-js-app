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
        Neue Verkehrssicherheit
      </v-btn>
    </v-col>
    <v-data-table
      :key="roadSafetyUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="roadSafetys"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-road-safety
      :roadSafety="{ name: '', description:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-road-safety
      :key="roadSafetyUpdateKey"
      :roadSafety="selectedRoadSafety"
      :visible="dialogType === 'update'"
      :id="selectedRoadSafety.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateRoadSafety from "./CreateRoadSafety";
import UpdateRoadSafety from "./UpdateRoadSafety";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateRoadSafety,
    UpdateRoadSafety
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Beschreibung", value: "description" },
        
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      roadSafetyUpdateKey:null,
      roadSafetyList:[],
      isLoading: false,
      dialogType:'',
      selectedRoadSafety: {},
      localSearch:null,
    };
  },
  computed: {
    ...mapGetters([ "getSearchquery","roadSafetys"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getRoadSafetyTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchRoadSafetys", "createRoadSafety", "updateRoadSafety"]),
    editRoadSafety(roadSafety) {
      this.selectedRoadSafety = { ...roadSafety };
      this.dialogType = 'update';
    },
  //   test() {
  //    console.log("search: ", this.getRoadSafetyTypeResults);
  //  },

    openModal(type, roadSafety) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedRoadSafety = { ...roadSafety };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedRoadSafety = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createRoadSafety(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateRoadSafety(item);
      console.log("Item updated")
      this.UpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchRoadSafetys()
        .then(() => {
          this.$store.commit("setRoadSafetyTypeResults", response.data);
          this.roadSafetys = response.data;
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