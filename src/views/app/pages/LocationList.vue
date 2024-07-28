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
        Neue Standort/Sozialgefüge
      </v-btn>
    </v-col>
    <v-data-table
      :key="locationUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="locations"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-location
      :location="{ abbreviation: '', name:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-location
      :key="locationUpdateKey"
      :location="selectedLocation"
      :visible="dialogType === 'update'"
      :id="selectedLocation.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateLocation from "./CreateLocation";
import UpdateLocation from "./UpdateLocation";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateLocation,
    UpdateLocation
  },
  data() {
    return {
      headers: [
        { text: "Abkürzung", value: "abbreviation" },
        { text: "namme", value: "name" },
        
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      locationUpdateKey:null,
      locationList:[],
      isLoading: false,
      dialogType:'',
      selectedLocation: {},
      localSearch: null
    };
  },
   computed: {
    ...mapGetters([ "getSearchquery","locations"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getLocationTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchLocations", "createLocation", "updateLocation"]),
    editLocation(location) {
      this.selectedLocation = { ...location };
      this.dialogType = 'update';
    },
  //    test() {
  //    console.log("search: ", this.getLocationTypeResults);
  //  },

    openModal(type,location) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedLocation = { ...location };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedLocation = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createLocation(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateLocation(item);
      console.log("Item updated")
      this.locationUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchLocations()
        .then(() => {
          this.$store.commit("setLocationTypeResults", response.data);
          this.locations = response.data;
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