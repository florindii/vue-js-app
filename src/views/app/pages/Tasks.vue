<template>
  <div>
    <v-card class="custom-buttons-holder">
      <v-container fluid>
        <v-row justify="end">
          <v-col cols="3">
            <v-select
              v-model="year"
              :items="orderedYears"
              outlined
              @change="yearChange"
            ></v-select>
          </v-col>

          <v-col cols="9">
            <v-row class="first-row">
                <v-col cols="2">
                <a class="filter" @click="viewSelectedItemOnMap">
                  <img
                    class="karte"
                    src="../../../assets/images/map.png"
                    alt=""
                  />
                  <span>Karte</span>
                  <span class="information" v-if="showInfo">
                    <img src="../../../assets/images/close_white.png" alt="close">
                    Sie müssen mindestens einen Baum oder ein Gebiet auswählen.
                  </span>
                </a>
          </v-col>
              <v-col cols="2">
                <a href="#" class="filter" @click="filtersTrigger">
                  <img class="custom-map-area-icon" src="../../../assets/images/icons/filter.svg" /> 
                  <span>Filter</span>
                </a>
              </v-col>
              <v-col cols="4" class="pa-0">
                <v-btn
                  block
                  size="x-large"
                  height="54px"
                  color="#1db954"
                  class="new-btn"
                  @click="createNewTask"
                >
                  <v-icon>mdi mdi-plus-thick</v-icon>
                  Neue Pflegemassnahme
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="filters-row" v-show="showFilters">
          <v-col cols="12" class="filters-holder">
            <div class="from-to-dates">
              <p class="custom-label">Datum</p>

              <div class="fields">
                <v-menu
                  ref="menufromDate"
                  v-model="menufromDate"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fromDate"
                      append-icon="mdi-calendar-blank-outline"
                      outlined
                      placeholder="Jan 6, 2022"
                      readonly
                      clearable
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="fromDate" no-title>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menufromDate = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menufromDate.save(fromDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>

                <v-menu
                  ref="menutoDate"
                  v-model="menutoDate"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="toDate"
                      append-icon="mdi-calendar-blank-outline"
                      outlined
                      placeholder="Jan 6, 2022"
                      readonly
                      clearable
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="toDate" no-title :min="fromDate">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menutoDate = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menutoDate.save(toDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
            </div>

            <div class="from-to-tree">
              <p class="custom-label">Baum ID interval</p>
              <div class="fields">
                <v-text-field
                  value=""
                  prefix="Von |"
                  outlined
                  clearable
                  hide-details
                  v-model="fromTree"
                ></v-text-field>
                <v-text-field
                  value=""
                  prefix="Bis |"
                  outlined
                  clearable
                  hide-details
                  v-model="toTree"
                ></v-text-field>
              </div>
            </div>

            <div class="task-name">
              <p class="custom-label">Massnahme</p>

              <div class="fields" @click="showPopupFunction">
                <v-text-field
                  outlined
                  hide-details
                  clearable
                  readonly
                  :value="finalWorkTypeSelection"
                  @click:clear="clearedWorktypeFIlter"
                >
                  <v-icon slot="append" color="white">
                    mdi-chevron-down
                  </v-icon>
                </v-text-field>
              </div>
            </div>

            <div class="filter-btns">
              <v-btn
                size="x-large"
                height="54px"
                color="#1db954"
                class="filter-btn"
                @click="filterBtnClicked"
              >
                Filter
              </v-btn>
              <v-btn
                size="x-large"
                height="54px"
                class="clear"
                @click="resetFilter"
              >
                <v-icon>mdi mdi-refresh</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-row justify="end">
          <v-col cols="6">
            <v-btn-toggle
              class="three-buttons"
              active-class="custom-active"
              mandatory
            >
              <v-hover v-slot="{ hover }">
                <v-btn
                  size="x-large"
                  height="54px"
                  outlined
                  class="custom-outlined"
                  :style="{
                    'background-color': hover ? '#1DB954' : 'transparent',
                    color: hover ? 'black' : 'white',
                    'border-color': hover ? 'transparent' : '#494949'
                  }"
                  @click="onTaskFilter(TaskTypes.Open)"
                >
                  Offen
                </v-btn>
              </v-hover>

              <v-hover v-slot="{ hover }">
                <v-btn
                  size="x-large"
                  height="54px"
                  outlined
                  class="custom-outlined"
                  :style="{
                    'background-color': hover ? '#1DB954' : 'transparent',
                    color: hover ? 'black' : 'white',
                    'border-color': hover ? 'transparent' : '#494949'
                  }"
                  @click="onTaskFilter(TaskTypes.Closed)"
                >
                  Erledigt
                </v-btn>
              </v-hover>

              <v-hover v-slot="{ hover }">
                <v-btn
                  size="x-large"
                  height="54px"
                  outlined
                  class="custom-outlined"
                  :style="{
                    'background-color': hover ? '#1DB954' : 'transparent',
                    color: hover ? 'black' : 'white',
                    'border-color': hover ? 'transparent' : '#494949'
                  }"
                  @click="onTaskFilter(TaskTypes.All)"
                >
                  Gesamtplan
                </v-btn>
              </v-hover>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card :loading="isloading">
      <TasksDatatable
        :headers="headers"
        :tableData="tableData"
        :showSelect="true"
        :singleSelect="false"
        :actions="[
          { id: 1, icons: require('../../../assets/images/icons/eye-outline.svg'), action: 'view', params: '' },
          { id: 2, icons: require('../../../assets/images/icons/pencil-outline.svg'), action: 'edit', params: '' }
        ]"
        @view="viewMethod"
        @edit="editMethod"
        @selectedRow="getSelectedItems"
        :userCanView="userCanView"
        :userCanEdit="userCanEdit"
        :userCanDelete="userCanDelete"
      />
    </v-card>

    <div class="popup" v-show="showPopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="this.closePopupFunction"
          >mdi mdi-close</v-icon
        >
        <p class="title">Auswählen</p>

        <v-text-field
          class="search"
          hide-details
          placeholder="Suchen"
          v-model="workTypeSearchText"
          @keyup="searchWorkTypes"
        >
          <v-icon slot="append" color="white">
            mdi-magnify
          </v-icon>
        </v-text-field>

        <div class="alphabet">
          <v-chip-group
            v-model="selectedChar"
            active-class="green"
            column
            class="my-3"
          >
            <v-chip
              :key="letter"
              size="31"
              class="rounded-0 ma-1 custom-chip"
              v-for="letter in letters"
              :ripple="false"
              :class="selectedChar === letter ? 'green' : ''"
              @click="selectLetter(letter)"
              outlined
            >
              <span>{{ letter }}</span>
            </v-chip>
          </v-chip-group>
        </div>

        <div class="work-types" v-show="workTypes.length">
          <v-radio-group v-model="selectedWorktype">
            <v-radio
              v-for="(wt, index) in workTypes"
              :key="index"
              :label="wt.abbreviation + ', ' + wt.description"
              :value="wt.abbreviation"
              class="custom-radio"
              @click="radioClicked(wt)"
            ></v-radio>
          </v-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TasksDatatable from "../../../components/custom_components/TasksDatatable.vue";
import TestDatatable from "../../../components/custom_components/TestDatatable.vue";
import { eventBus } from "../../../main";
import Tasks from "@/consts/taskTypes";
import axios from "axios";

export default {
  components: {
    TasksDatatable,
    TestDatatable
  },
  data() {
    return {
      /* useraccess */
      userCanEdit: false,
      userCanView: false,
      userCanDelete: false,
      /* end of useraccess */

      menufromDate: false,
      menutoDate: false,
      isloading: true,
      showPopup: false,
      letters: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      selectedChar: null,
      previouslySelectedChar: null,
      selectedWorktype: null,
      workTypeSearchText: "",
      searchTimeOut: null,
      workTypes: [],
      finalWorkTypeSelection: "",
      finalWorkTypeSelectionId: null,
      headers: [
        {
          text: "Etappe",
          align: "start",
          value: "date"
        },
        { text: "BaumID", value: "treeName" },
        { text: "Massnahme", value: "workType" },
        { text: "Intervall", value: "interval" },
        { text: "Spez. Std", value: "specialHours" },
        { text: "Bp1.Std", value: "normalHours" },
        { text: "Mat.Fr.", value: "material" },
        { text: "Datum", value: "finishDate" },
        { text: "Visum", value: "tasksFinishedUsers" },
        { text: "Info", value: "info" },
        { text: "", value: "buttons", align: "start", sortable: false }
      ],
      tableData: [],
      years: [],
      year: null,
      taskType: 2,
      inventoryId: null,
      fromDate: "",
      toDate: "",
      TaskType: 2,
      TaskTypes: null,
      fromTree: "",
      toTree: "",
      showFilters: false,
      selectedItems:null,
      showInfo:false
    };
  },
  computed: {
    ...mapGetters(["inventarId", "getTreeItem", "getAreaItem","getTableDataFromSQL"]),

    orderedYears() {
      return this.years.slice().reverse();
    }
  },
  created() {
    const date = new Date();
    this.year = date.getFullYear();
  },
  mounted() {
    this.TaskTypes = Tasks;
    this.fetchYears();
    this.inventoryId = this.inventarId;
    this.fetchTasks();
  },
  methods: {
      ...mapActions([
      "addTreeCoordinates",
      "addTreeId",
      "addAreaId",
      "addIsTree",
      "addTreeItem",
      "addAreaItem"
    ]),
    async fetchTasks() {
      console.log("iiiiddd", this.inventarId);

      const paramString = this.createParamString();
      console.log("paramssss:", paramString);

      eventBus.$emit("resetSelectedTasks");

      this.isloading = true;
      this.tableData = [];
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Tasks/GetAll/${paramString}`
        );

        // console.log("response: ", response);

        /* check if there are data */
        if (Object.keys(response.data).length > 0) {
          this.tableData = response.data.result;

          /* change user privileges */
          this.userCanDelete = response.data.access.canDelete;
          this.userCanEdit = response.data.access.canEdit;
          this.userCanView = response.data.access.canView;
        }

        this.isloading = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchYears() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Inventory/GetYearsByInventory/${this.inventarId}`
        );
        // console.log("years", response.data);
        this.years = response.data;
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchWorkTypes(name) {
      var endpoint = `https://tilia.rrota.org/api/WorkType/GetAll`;
      if (name) {
        endpoint += `?name=${name}`;
      }

      try {
        const response = await axios.get(endpoint);
        // console.log("worktypes: ", response);

        this.workTypes = response.data;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    yearChange(year) {
      this.year = year;
      this.fetchTasks();
    },

    onTaskFilter(tasktype) {
      this.taskType = tasktype;
      this.fetchTasks();
    },

    filtersTrigger() {
      this.showFilters = !this.showFilters;
    },

    showPopupFunction() {
      this.showPopup = true;
      this.fetchWorkTypes();
    },

    closePopupFunction() {
      this.showPopup = false;
      this.workTypes = [];
    },

    editMethod(item) {
      console.log(item);
      this.$router.push({
        name: "Pflegemassnahme bearbeiten",
        params: { taskId: item.id, canDelete: this.userCanDelete, year: this.year }
      });
    },
    viewSelectedItemOnMap() {
      if (this.tableData.length > 0 && this.selectedItems) {
        console.log("tableData",this.tableData);
        console.log("tableData",this.selectedItems);
        const items = this.tableData.filter(element =>
          this.selectedItems.includes(element)
        );
        // const trees = items.map(el => {
        //   if (el.isTree == true) return el;
        // });
        // const area = items.map(el => {
        //   if (el.isTree == false) return el;
        // });

        // console.log("trees",trees);
        // console.log("area",area);
          
        const treeItems = items.map(el => el)

        this.addTreeItem(treeItems);



        if (this.getAreaItem && this.getTreeItem) {
          this.$router.push({
            name: "TreeSelected"
          });
        }
      } else {
        this.showInfo = true;
      }
    },
      getSelectedItems(items) {
      this.selectedItems = items;
      if (this.selectedItems.length > 0) {
        this.showInfo = false;
      }
    },
    viewMethod(item) {
      console.log(item);
      // this.addTreeCoordinates([item.latitude, item.longitude]);
      this.$router.push({
        name: "TaskProfil",
        params: { taskId: item.id, year: this.year, canEdit: this.userCanEdit }
      });
    },

    selectLetter(letter) {
      this.selectedChar = letter;

      if (letter === this.previouslySelectedChar) {
        this.selectedChar = null;
      }
      this.previouslySelectedChar = this.selectedChar;

      if (this.selectedChar) {
        this.fetchWorkTypes(this.selectedChar);
      } else {
        this.fetchWorkTypes();
      }
      this.workTypeSearchText = "";
    },

    searchWorkTypes() {
      if (this.workTypeSearchText) {
        clearTimeout(this.searchTimeOut);
        this.searchTimeOut = setTimeout(() => {
          this.fetchWorkTypes(this.workTypeSearchText);
          clearTimeout(this.searchTimeOut);
        }, 300);
      } else {
        this.workTypes = [];
        this.fetchWorkTypes();
      }
      this.selectedChar = false;
      this.previouslySelectedChar = null;
    },

    radioClicked(wt) {
      this.finalWorkTypeSelection = wt.abbreviation;
      this.finalWorkTypeSelectionId = wt.id;
      this.showPopup = false;
    },

    clearedWorktypeFIlter() {
      this.finalWorkTypeSelection = "";
      this.finalWorkTypeSelectionId = null;
      this.selectedWorktype = null;
    },

    resetFilter() {
      console.log("asdasdasd");
      this.fromDate = null;
      this.toDate = null;
      this.fromTree = null;
      this.toTree = null;
      this.finalWorkTypeSelection = "";
      this.finalWorkTypeSelectionId = null;
      this.selectedWorktype = null;
    },

    filterBtnClicked() {
      this.fetchTasks();
    },

    createParamString() {
      const params = [];

      if (
        this.fromDate !== null &&
        this.fromDate !== undefined &&
        this.fromDate !== ""
      ) {
        params.push(`FromDate=${this.fromDate}`);
      }

      if (
        this.toDate !== null &&
        this.toDate !== undefined &&
        this.toDate !== ""
      ) {
        params.push(`ToDate=${this.toDate}`);
      }

      if (
        this.taskType !== null &&
        this.taskType !== undefined &&
        this.taskType !== ""
      ) {
        params.push(`TaskType=${this.taskType}`);
      }

      if (
        this.fromTree !== null &&
        this.fromTree !== undefined &&
        this.fromTree !== ""
      ) {
        params.push(`FromTree=${this.fromTree}`);
      }

      if (
        this.toTree !== null &&
        this.toTree !== undefined &&
        this.toTree !== ""
      ) {
        params.push(`ToTree=${this.toTree}`);
      }

      if (
        this.finalWorkTypeSelectionId !== null &&
        this.finalWorkTypeSelectionId !== undefined &&
        this.finalWorkTypeSelectionId !== ""
      ) {
        params.push(`WorkTypeId=${this.finalWorkTypeSelectionId}`);
      }

      return this.inventarId + "/" + this.year + "?" + params.join("&");
    },

    createNewTask() {
      this.$router.push({
        path: "CreateTask"
      });
    }
  }
};
</script>

<style lang="scss">
.custom-chip {
  &::before {
    opacity: 0 !important;
  }
}
.first-row {
  .karte {
    margin-right: 10px;
    position: relative !important;
  }
  .information {
    padding: 10px !important;
    color: black !important;
    background: #fff !important;
    position: absolute !important;
    top: 75px !important;
    width: 400px !important;
    z-index: 9999 !important;

    img{
      position: absolute !important;
      top: 0 !important;
      right: 10px !important;
    }
  }
}
.popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba($color: #000000, $alpha: 0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;

  .popup-holder {
    display: flex;
    flex-direction: column;
    background-color: #1c1e1c;
    width: 662px;
    height: auto;
    max-height: 78vh;
    max-height: 80%;
    border-radius: 10px;
    padding: 30px;
    position: relative;

    .close-popup {
      position: absolute;
      right: 30px;
      top: 25px;
      cursor: pointer;
    }

    .title {
      text-align: center;
    }

    .work-types {
      height: 100%;
      max-height: 304px;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 3px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        background: transparent;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: #1db954;
      }

      /* Handle on hover */
      &::-webkit-scrollbar-thumb:hover {
        background: darken($color: #1db954, $amount: 5);
      }

      .custom-radio {
        padding: 20px 0;
        border-bottom: 1px solid #494949;
      }
    }
  }
}

.three-buttons {
  display: flex !important;
  align-items: center;
  justify-content: flex-end;
  gap: 30px;

  .custom-outlined {
    min-width: 138px !important;
    border-radius: 5px !important;
    opacity: 1 !important;
    border-left-width: 1px !important;

    &.custom-active {
      background-color: #1db954 !important;

      .v-btn__content {
        color: black;
      }

      &::before {
        opacity: 0;
      }
    }
  }
}

.filters-row {
  .filters-holder {
    display: flex;
    align-items: flex-end;
    gap: 30px;
    margin-bottom: 30px;

    .custom-label {
      display: block;
      flex-wrap: nowrap;
    }

    .from-to-tree,
    .from-to-dates,
    .task-name {
      display: flex;
      justify-content: flex-end;
      flex-direction: column;

      .fields {
        display: flex;
        gap: 30px;
      }
    }

    .filter-btns {
      display: flex;
      align-items: flex-end;
      gap: 30px;

      .filter-btn {
        color: #000;
        font-size: 16px;
        line-height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        text-transform: none;
        background-color: #1db954;

        .v-btn__content {
          i {
            display: block;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
