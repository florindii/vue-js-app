<template>
  <div>
    <v-card class="custom-buttons-holder">
      <v-container fluid>
        <v-row justify="end">
          <v-col cols="12">
            <v-row class="first-row">
              <v-col cols="3">
                <v-select
                  v-model="selectedYear"
                  :items="orderedYears"
                  outlined
                  hide-details=""
                  @change="yearChange"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <a href="#" class="print">
                  <img class="custom-icon" src="../../../assets/images/icons/export.svg" />
                  <!-- <span class="mdi mdi-open-in-new custom-icon"></span> -->
                  <span>Inventar exportieren</span>
                </a>
              </v-col>
              <v-col cols="3">
                <a href="#" class="edit">
                  <!-- <span class="mdi mdi-tray-arrow-down custom-icon"></span> -->
                  <img class="custom-icon" src="../../../assets/images/icons/import.svg" /> 
                  <span>Inventar importieren</span>
                </a>
              </v-col>
              <v-col cols="3">
                <v-btn
                  block
                  size="x-large"
                  height="54px"
                  color="#1db954"
                  class="download-btn"
                  @click.prevent="goToCreateInventar"
                >
                  <v-icon>mdi mdi-plus-thick</v-icon>
                  Neues inventar
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card :loading="isloading">
      <InventarDatatable
        :headers="headers"
        :tableData="tableData"
        :showSelect="true"
        :singleSelect="true"
        :selectedItemsProp="this.inventarId"
        :locked="locked"
        :actions="[
          {
            id: 1,
            icons: require('../../../assets/images/icons/eye-outline.svg'),
            action: 'view',
            params: '',
            disabled: false
          },
          {
            id: 2,
            icons: require('../../../assets/images/icons/pencil-outline.svg'),
            action: 'edit',
            params: '',
            disabled: true
          },
          {
            id: 3,
            icons: require('../../../assets/images/icons/marker-outline.svg'),
            action: 'map',
            params: '',
            disabled: true
          }
        ]"
        @edit="editMethod"
        @map="mapMethod"
        @view="viewMethod"
        @selectedRow="selectedRowMethod"
      />
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import InventarDatatable from "../../../components/custom_components/InventarDatatable.vue";
import axios from "axios";

export default {
  components: {
    InventarDatatable
  },
  data() {
    return {
      isloading: true,
      showSelect: true,
      headers: [
        {
          text: "Inventarname",
          align: "start",
          value: "name"
        },
        { text: "Total Bäume", value: "totalTrees" },
        { text: "Norm [h]", value: "normalHours" },
        { text: "Spez [h]", value: "specialHours" },
        { text: "Aufwand Material", value: "material" },
        { text: "", value: "buttons", align: "start", sortable: false }
      ],
      tableData: [],
      years: [],
      locked: [],
      selectedInventarId: null,
      selectedYear: this.inventarSelectedYear
        ? this.inventarSelectedYear
        : 2023,
      mapRegions: []
    };
  },
  computed: {
    ...mapGetters(["getThemeMode", "inventarId", "inventarSelectedYear", "inventarTitle"]),

    orderedYears() {
      return this.years.slice().reverse();
    }
  },

  created() {
    this.fetchRegions();
  },
  mounted() {
    this.fetchYears();
    if (this.inventarSelectedYear !== null) {
      this.selectedYear = this.inventarSelectedYear;
    }
    this.getInventarData(this.selectedYear);
    this.updateSelectedYear(this.selectedYear);
    this.selectedInventarId = this.inventarId;
  },
  methods: {
    ...mapActions([
      "changeThemeLayout",
      "updateInventarId",
      "updateInventarTitle",
      "updateSelectedYear",
      "updateInventarCoordinates"
    ]),
    goToCreateInventar() {
      this.$router.push("/app/pages/create-inventar");
    },
    async fetchYears() {
      try {
        const response = await axios.get(
          "https://tilia.rrota.org/api/Inventory/GetYears"
        );
        this.years = response.data;
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    fetchRegions() {
      axios
        .get("https://tilia.rrota.org/api/Inventory/MapRegion")
        .then(response => {
          // Handle the response from the server
          this.mapRegions = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    async getInventarData(y) {
      try {
        const response = await axios.get(
          "https://tilia.rrota.org/api/Inventory/GetAll/" + y
        );
        // console.log("cordinatat mi marre",response);
        this.tableData = response.data;
        this.isloading = false;
        this.locked = this.tableData.filter(item => item.isLocked);
      } catch (error) {
        console.log(error);
        this.hasError = true;
        this.isloading = false;
      }
    },
    yearChange(year) {
      this.updateSelectedYear(year);
      this.getInventarData(year);
    },
    editMethod(id) {
      this.$router.push({
        name: "Inventar bearbeiten",
        params: { id: id, year: this.inventarSelectedYear }
      });
    },
    viewMethod(id, name, date) {
      let d = new Date(date);
      const year = d.getFullYear();
      this.$router.push({
        name: "InventarInfo",
        query: { id: id },
        params: { title: name, year: year }
      });
    },
    mapMethod(id) {
      let coordinates = null;
      if (this.mapRegions.length > 0) {
        const selectedInventar = this.mapRegions.find(
          el => el.inventoryId == id
        );
       
        coordinates = JSON.stringify(selectedInventar.coordinates);
      }

      this.$router.push({
        name: "Inventarliste",
        params: { id: id, year: this.inventarSelectedYear, coord: coordinates }
      });
    },
    selectedRowMethod(id) {
      let coordinates = null;
      if (this.mapRegions.length > 0) {
        const selectedInventar = this.mapRegions.find(
          el => el.inventoryId == id
        );

        if (selectedInventar !== undefined) {
          coordinates = JSON.stringify(selectedInventar.coordinates);
        }
      }

      if (coordinates !== null) {
        this.updateInventarCoordinates(coordinates);
      }
      /* handle select or deselect */
      /* if id that comes from method is equal with selectedinventarid means we are deselecting */
      if (this.selectedInventarId === id) {
        this.selectedInventarId = null;
        this.updateInventarId(null);
        this.updateInventarTitle(null);
      } else {
        this.selectedInventarId = id;
        this.updateInventarId(id);
        if (this.tableData.length > 0) {
        const selectedInventar = this.tableData.find(
          el => el.id == id
        );
        this.updateInventarTitle(null);
        this.updateInventarTitle(selectedInventar.name);
      }
      }
    }
  }
};
</script>
