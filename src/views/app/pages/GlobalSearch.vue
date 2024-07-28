<template>
  <div>
    <v-container class="container">
      <v-row class="first-row" justify="start">
        <v-col cols="3">
          <label for="TreeType:">Baumart*</label>
          <v-select
            v-model="selectedTreeTypeId"
            :items="treeType"
            item-value="id"
            :item-text="(item) => `${item.abbreviation} - ${item.germanName}`"
            outlined
            clearable
            hide-details
            required
            @change="selectTreeTypeId(selectedTreeTypeId)"
          >
          </v-select>
        </v-col>
        <v-col cols="3">
          <label for="mushroomType:">Holzpilz</label>
          <v-select
            v-model="selectedMushroomTypeId"
            :items="mushroomType"
            item-value="id"
            :item-text="(item) => `${item.abbreviation} - ${item.germanName}`"
            outlined
            clearable
            hide-details
            required
            @change="selectMushroomTypeId(selectedMushroomTypeId)"
          >
          </v-select>
        </v-col>
        <v-col class="first-calendar-text-field" cols="3">
          <v-menu
            v-model="search.menuStartDate"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                class="calendar-first"
                v-model="searchData.startDate"
                append-icon="mdi-calendar"
                readonly
                placeholder="Select start date"
                v-on="on"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="searchData.startDate"
              @input="search.DatamenuStartDate = false"
            >
              <v-spacer></v-spacer>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <v-row class="second-row" justify="start">
        <v-col class="column" cols="3">
          <label for="WorkType:">Massnahme</label>
          <v-select
            v-model="selectedWorkTypeId"
            :items="workType"
            item-value="id"
            :item-text="(item) => `${item.abbreviation} - ${item.description}`"
            outlined
            clearable
            hide-details
            required
            @change="selectWorkTypeId(selectedWorkTypeId)"
          >
          </v-select>
        </v-col>
        <v-col class="column" cols="3">
          <label for="Parasite:">Parasit</label>
          <v-select
            v-model="selectedParasitTypeId"
            :items="parasitType"
            item-value="id"
            :item-text="(item) => `${item.name} - ${item.germanName}`"
            outlined
            clearable
            hide-details
            required
            @change="selectParasitTypeId(selectedParasitTypeId)"
          >
          </v-select>
        </v-col>
        <v-col class="second-calendar-text-field" cols="3">
          <v-menu
            v-model="search.menuEndDate"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                class="calendar-second"
                v-model="searchData.endDate"
                append-icon="mdi-calendar"
                readonly
                placeholder="Select end date"
                v-on="on"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="searchData.endDate"
              @input="searchData.menuEndDate = false"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row class="buttons" justify="center">
        <v-col cols="auto">
          <v-btn color="gray" class="cancel-button" @click="cancel"
            >Abbrechen</v-btn
          >
        </v-col>
        <v-col cols="3">
          <v-btn
            color="primary"
            class="search-button"
            @click="search"
            text-color:black
            >Suchen</v-btn
          >
        </v-col>
      </v-row>
      <div v-if="showDataTable">
        <p class="ergebnis-text">Ergebnis:</p>
        <div class="table-css" v-if="showDataTable">
          <v-data-table
            :headers="tableHeaders"
            :items="tableData"
            :search="searchQuery"
            :custom-filter="filterData"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="green--text mr-2" @click="handleView(item)"
                >mdi-eye-outline</v-icon
              >
            </template>
          </v-data-table>
        </div>
      </div>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";
import { createLogger, mapActions } from "vuex";

export default {
  name: "Search",
  data() {
    return {
      filteredDataTable: [],
      showDataTable: false,
      tableHeaders: [
        { text: "Inventar", value: "inventoryName" },
        { text: "Datum", value: "date" },
        { text: "BaumID", value: "treeName" },
        { text: "Anz.ba", value: "totalTrees" },
        { text: "Massnahme", value: "workType" },
        { text: "Holzpilz", value: "mushroomType" },
        { text: "Parasit", value: "parasit" },
        { text: "", value: "actions", sortable: "false" },
      ],
      tableData: [],

      searchData: {
        treeTypeId: null,
        mushroomTypeId: null,
        workTypeId: null,
        parasitTypeId: null,
        menuStartDate: false,
        menuEndDate: false,
        startDate: null,
        endDate: null,
      },
      treeType: [],
      selectedTreeTypeId: null,
      mushroomType: [],
      selectedMushroomTypeId: null,
      workType: [],
      selectedWorkTypeId: null,
      parasitType: [],
      selectedParasitTypeId: null,
      searchQuery: "",
    };
  },

  methods: {
    ...mapActions([
      "updateInventarId",
    ]),
    cancel() {
      this.showDataTable = false;
    },
    selectTreeTypeId(treeTypeId) {
      this.searchData.treeTypeId = treeTypeId;
    },
    selectMushroomTypeId(mushroomTypeId) {
      this.searchData.mushroomTypeId = mushroomTypeId;
    },
    selectWorkTypeId(workTypeId) {
      this.searchData.workTypeId = workTypeId;
    },
    selectParasitTypeId(parasitTypeId) {
      this.searchData.parasitTypeId = parasitTypeId;
    },
    //Method to get all tree types for the dropdown
    getAllTreeType() {
      axios
        .get(`https://tilia.rrota.org/api/TreeType/GetAll`)
        .then((response) => {
          this.treeType = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //Method to get all mushroom types for the dropdown
    getAllMushroomType() {
      axios
        .get(`https://tilia.rrota.org/api/MushroomType/GetAll`)
        .then((response) => {
          this.mushroomType = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //Method to get all work types for the dropdown
    getAllWorkType() {
      axios
        .get(`https://tilia.rrota.org/api/WorkType/GetAll`)
        .then((response) => {
          this.workType = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //Method to get all parasit types for the dropdown
    getAllParasitType() {
      axios
        .get("https://tilia.rrota.org/api/Parasit/GetAll")
        .then((response) => {
          this.parasitType = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleView(item) {
      console.log("itemi: ", item);

      this.updateInventarId(item.inventoryId);
      
      if (item.workType === "Baumkontrolle") {
        this.$router.push("/app/pages/BaumkontrolleList");
      } else {
        this.$router.push("/app/pages/Tasks/");
      }
    },
    search() {
      if (
        !this.searchData.treeTypeId &&
        !this.searchData.mushroomTypeId &&
        !this.searchData.workTypeId &&
        !this.searchData.parasitTypeId &&
        !this.searchData.startDate &&
        !this.searchData.endDate
      )
        return;
      {
      }

      const searchData = {
        FromDate: this.searchData.startDate,
        ToDate: this.searchData.endDate,
        TreeTypeId: this.searchData.treeTypeId,
        MushroomTypeId: this.searchData.mushroomTypeId,
        WorkTypeId: this.searchData.workTypeId,
        ParasitId: this.searchData.parasitTypeId,
      };
      //Request to endpoint
      axios
        .get("https://tilia.rrota.org/api/Search/GetAll", {
          params: searchData,
        })
        .then((response) => {
          console.log("searchResults:" ,response.data)
          this.tableData = response.data.map((item) => {
            const date = new Date(item.date).toLocaleDateString();

            return { ...item, date };
          });

          this.filteredDataTable = this.tableData.filter((item) => {
            const isTreeTypeMatched =
              !this.searchData.treeTypeId ||
              item.treeTypeId === this.searchData.treeTypeId;
            const isMushroomTypeMatched =
              !this.searchData.mushroomTypeId ||
              item.mushroomTypeId === this.searchData.mushroomTypeId;
            const isWorkTypeMatched =
              !this.searchData.workTypeId ||
              item.workTypeId === this.searchData.workTypeId;
            const isDateMatched =
              !this.searchData.startDate ||
              !this.searchData.endDate ||
              this.isDateInRange(
                item.date,
                this.searchData.startDate,
                this.searchData.endDate
              );
            const isParasitTypeMatched =
              !this.searchData.parasitTypeId ||
              item.parasitTypeId === this.searchData.parasitTypeId;

            return (
              isTreeTypeMatched && 
              isMushroomTypeMatched &&
              isWorkTypeMatched &&
              isParasitTypeMatched &&
              isDateMatched
            );
          });
          this.showDataTable = true;

          // console.log("Search results", response.data);
        })
        .catch((error) => {
          console.error("Search error", error);
        });
    },
    isDateInRange(date, startDate, endDate) {
      const targetDate = new Date(date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      return targetDate >= start && targetDate <= end;
    },
  },
  created() {
    this.getAllTreeType();
    this.getAllMushroomType();
    this.getAllWorkType();
    this.getAllParasitType();
  },
};
</script>


<style scoped>
.first-row {
  margin-top: 6% !important;
  margin-bottom: 2% !important;
}

.container {
  margin-right: -3%;
}
.buttons {
  margin-top: 5% !important;
  margin-right: 31% !important;
}
.search-button {
  width: 285px !important;
}
.cancel-button {
  width: 285px !important;
}
.ergebnis-text {
  margin-top: 1% !important;
}
.table-css {
  margin-top: 1% !important;
  margin-right: 15% !important;
  padding: 2% !important;
}
.calendar-first {
  margin-top: 22px;
}
.calendar-second {
  margin-top: 22px;
}
.mr-2 {
  border: 1px solid #494949;
  padding: 3px;
  border-radius: 5px;
  width: 42px;
  height: 42px;
  margin-left:-60px !important;
}
@media (max-width: 1024px) {
  .first-row,
  .second-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .container {
    margin-right: 0;
  }
  .buttons {
    margin-top: 5% !important;
    margin-right: 10% !important;
  }

  .search-button {
    width: 285px !important;
  }

  .cancel-button {
    width: 285px !important;
  }
}
</style>