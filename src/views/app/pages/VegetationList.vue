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
        Neue Bewuchs
      </v-btn>
    </v-col>
    <v-data-table
      :key="vegetationUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="vegetations"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-vegetation
      :vegetation="{ abbreviation: '', name:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-vegetation
      :key="vegetationUpdateKey"
      :vegetation="selectedVegetation"
      :visible="dialogType === 'update'"
      :id="selectedVegetation.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateVegetation from "./CreateVegetation";
import UpdateVegetation from "./UpdateVegetation";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateVegetation,
    UpdateVegetation
  },
  data() {
    return {
      headers: [
        { text: "Abkürzung", value: "abbreviation" },
        { text: "namme", value: "name" },
        
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      vegetationUpdateKey:null,
      vegetationList:[],
      isLoading: false,
      dialogType:'',
      selectedVegetation: {},
      localSearch: null
    };
  },
    computed: {
    ...mapGetters(["getSearchquery","vegetations"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
   // console.log(this.getVegetationTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchVegetations", "createVegetation", "updateVegetation"]),
    editVegetation(vegetation) {
      this.selectedVegetation = { ...vegetation };
      this.dialogType = 'update';
    },
 //    test() {
   //   console.log("search: ", this.getVegetationTypeResults);
 //   },


    openModal(type,vegetation) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedVegetation = { ...vegetation };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedVegetation = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createVegetation(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateVegetation(item);
      console.log("Item updated")
      this.vegetationUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchVegetations()
        .then(() => {
      //    this.$store.commit("setVegetationTypeResults", response.data);
          this.vegetations = response.data;
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