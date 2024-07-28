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
        Neue Massnahme
      </v-btn>
    </v-col>
    <v-data-table
      :key="workTypeUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="workTypes"
      :loading="isLoading"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="openModal('update', item)">
          mdi-pencil-outline
        </v-icon>
     
      </template>
    </v-data-table>
    <create-work-type
      :workType="{ abbreviation: '', description:'' }"
      :visible="dialogType === 'create'"
      :id="null"
      @close="closeModal"
      @addItem="addItem"
    />
    <update-work-type
      :key="workTypeUpdateKey"
      :workType="selectedWorkType"
      :visible="dialogType === 'update'"
      :id="selectedWorkType.id"
      @close="closeModal"
      @updateItem="updateItem"
    />
  </div>
</template>

<script>
import CreateWorkType from "./CreateWorkType";
import UpdateWorkType from "./UpdateWorkType";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateWorkType,
    UpdateWorkType
  },
  data() {
    return {
      headers: [
        { text: "Abkürzung", value: "abbreviation" },
        { text: "Beschreibung", value: "description" },
        
        { text: "", value: "actions", sortable: false }
      ],
      itemList:[],
      workTypeUpdateKey:null,
      workTypeList:[],
      isLoading: false,
      dialogType:'',
      selectedWorkType: {},
      localSearch: null

    };
  },
   computed: {
    ...mapGetters([ "getSearchquery","workTypes"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    console.log(this.getWorkTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchWorkTypes", "createWorkType", "updateWorkType"]),
    editWorkType(workType) {
      this.selectedWorkType = { ...workType };
      this.dialogType = 'update';
    },
  //   test() {
 //     console.log("search: ", this.getWorkTypeResults);
  //  },

    openModal(type, workType) {
      this.dialogType = type;
      if (type === 'update') {
        this.selectedWorkType = { ...workType };
      }
    },
    closeModal() {
      this.dialogType = '';
      this.selectedWorkType = {};
    },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createWorkType(newItem);
      this.closeModal();
    },
    async updateItem(item) {
      console.log("Updating item", item)
      this.isLoading = true;
      await this.updateWorkType(item);
      console.log("Item updated")
      this.workTypeUpdateKey +=1;
      this.closeModal();
    },
    fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      this.fetchWorkTypes()
        .then(() => {
      //    this.$store.commit("setWorkTypeResults", response.data);
          this.workTypes = response.data;
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
  .download-btn {
    margin-bottom:23px;
  }

</style>