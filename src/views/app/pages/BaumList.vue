<template>
  <div>
    <v-card class="custom-buttons-holder">
      <v-container fluid>
        <v-row justify="end">
          <v-col cols="8">
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
                    Sie müssen mindestens einen Baum oder ein Gebiet auswählen.
                  </span>
                </a>
              </v-col>
              <v-col cols="2">
                <a class="filter" @click="filtersTrigger">
                  <img
                    class="karte"
                    src="../../../assets/images/icons/filter.svg"
                    alt=""
                  />
                  <span>Filter</span>
                </a>
              </v-col>
              <v-col cols="2">
                <a href="#" class="import">
                  <img
                    class="karte"
                    src="../../../assets/images/icons/import.svg"
                    alt=""
                  />
                  <span>Baum importieren</span>
                </a>
              </v-col>
              <v-col cols="4">
                <v-btn
                  block
                  size="x-large"
                  height="54px"
                  color="#1db954"
                  class="new-btn"
                  @click.prevent="goToCreateTree"
                >
                <img
                    class="karte"
                    src="../../../assets/images/icons/plus-thick.svg"
                    alt=""
                  />
                  Neuer baum
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="filters-row" v-show="showFilters">
          <v-col cols="12" class="filters-holder">
            <div class="from-to-tree">
              <p class="custom-label">Baum ID interval</p>
              <div class="fields">
                <v-text-field
                  value=""
                  prefix="Von |"
                  outlined
                  hide-details
                  v-model="fromTree"
                ></v-text-field>
                <v-text-field
                  value=""
                  prefix="Bis |"
                  outlined
                  hide-details
                  v-model="toTree"
                ></v-text-field>
              </div>
            </div>

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

            <div class="filter-btns">
              <v-btn
                size="x-large"
                height="54px"
                color="#1db954"
                class="filter-btn"
                @click="fetchTrees"
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
      </v-container>
    </v-card>

    <v-card :loading="isloading">
      <BaumDatatable
        :headers="headers"
        :tableData="tableData"
        :showSelect="true"
        :singleSelect="false"
        :actions="[
          {
            id: 1,
            icons: require('../../../assets/images/icons/eye-outline.svg'),
            action: 'view',
            params: '',
            show: true
          },
          {
            id: 2,
            icons: require('../../../assets/images/icons/pencil-outline.svg'),
            action: 'edit',
            params: '',
            show: false
          }
        ]"
        @edit="editMethod"
        @view="viewMethod"
        @selectedRow="getSelectedItems"
        :userCanView="userCanView"
        :userCanEdit="userCanEdit"
        :userCanDelete="userCanDelete"
      />
    </v-card>
  </div>
</template>

<script>
import BaumDatatable from "../../../components/custom_components/BaumDatatable.vue";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import { eventBus } from "../../../main";
export default {
  components: {
    BaumDatatable
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
      headers: [
        {
          text: "Baum ID",
          align: "start",
          value: "name"
        },
        { text: "Baumart", value: "treeTypeLatinName" },
        { text: "Deutscher Name", value: "treeTypeGermanName" },
        { text: "Alter", value: "age" },
        { text: "Stammumfang [cm]", value: "trunkCircumference" },
        { text: "Kronen Ø [m]", value: "crownDiameter" },
        { text: "Baum Höhe [m]", value: "treeHeight" },
        { text: "", value: "buttons", align: "start", sortable: false }
      ],
      tableData: [],
      latLngTree: [],
      inventoryId: null,
      fromDate: "",
      toDate: "",
      fromTree: "",
      toTree: "",
      showFilters: false,
      selectedItems: null,
      showInfo: false
    };
  },
  computed: {
    ...mapGetters(["inventarId", "getTreeItem", "getAreaItem","getTableDataFromSQL"]),
    checkSelectedItems() {
      if (this.selectedItems.length > 0) {
        this.showInfo = true;
      } else {
        this.showInfo = false;
      }
    }
  },
  async mounted() {
    this.inventoryId = this.inventarId;
    this.fetchTrees();
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
    goToCreateTree() {
      this.$router.push({
        name: "NeuerBaum",
        params: { inventoryId: this.inventoryId, coord: this.latLngTree }
      });
    },
    async fetchTrees() {
      eventBus.$emit("onTableFilter");
      const paramString = this.createParamString();
      console.log(paramString);
      if(this.getTableDataFromSQL){
        this.tableData = this.getTableDataFromSQL.result
          this.userCanDelete = this.getTableDataFromSQL.access.canDelete;
          this.userCanEdit = this.getTableDataFromSQL.access.canEdit;
          this.userCanView = this.getTableDataFromSQL.access.canView;
           this.isloading = false;
      } else {
         try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Tree/GetAll/${paramString}`
        );

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
      }
        
     
    },
    viewMethod(item) {
      console.log("item ", item);
      this.addTreeId(item.id);
      this.addAreaId(item.areaId);
      this.addIsTree(item.isTree);
      this.addTreeCoordinates([item.latitude, item.longitude]);
      this.$router.push({
        name: "BaumProfil",
        params: {
          isTree: item.isTree,
          treeId: item.id,
          areaId: item.areaId,
          coord: [item.latitude, item.longitude]
        }
      });
    },
    editMethod(item) {
      this.addTreeId(item.id);
      this.addAreaId(item.id);
      this.$router.push({
        name: "Bearbeiten",
        params: { treeId: item.id, canDelete: this.userCanDelete, coord: [item.latitude, item.longitude] }
      });
    },
    createParamString() {
      const params = [];
      var invetoryIdd = "";

      if (this.inventoryId !== null && this.inventoryId !== undefined) {
        invetoryIdd = this.inventoryId + "?";
      }

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

      return invetoryIdd + params.join("&");
    },
    filtersTrigger() {
      this.showFilters = !this.showFilters;
    },
    resetFilter() {
      this.fromDate = null;
      this.toDate = null;
      this.fromTree = null;
      this.toTree = null;
    },
    viewSelectedItemOnMap() {
      if (this.tableData.length > 0 && this.selectedItems) {
        const items = this.tableData.filter(element =>
          this.selectedItems.includes(element)
        );
        const trees = items.map(el => {
          if (el.isTree == true) return el;
        });
        const area = items.map(el => {
          if (el.isTree == false) return el;
        });

        console.log("trees",trees);
        this.addTreeItem(trees);
        this.addAreaItem(area);

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
    }
  }
};
</script>

<style lang="scss">
.first-row {
  .karte {
    margin-right: 10px;
    position: relative !important;
  }
  .information {
    padding: 5px !important;
    color: black !important;
    background: #fff !important;
    position: absolute !important;
    top: 75px !important;
    width: 400px !important;
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
    .from-to-dates {
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
        width: 100%;
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
