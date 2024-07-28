<template>
  <div>
    <v-card class="custom-buttons-holder">
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="8">
            <v-row class="first-row" v-show="isActive('tab-1')">
              <v-col cols="4 mb-5" v-for="item in this.reports" :key="item.id"
                v-if="item.name !== null && item.reportTypeId == 1">
                <a href="#" class="print justify-start" @click="fetchAllReports(item.id)">
                  <span v-if="item.name.length > 30" class="truncate" @mouseover="showFullName = item.id" @mouseleave="showFullName = null"
                    > {{ showFullName === item.id ? item.name : item.name.slice(0, 27) +
                      '...'
                    }}</span>

                  <span v-else> {{ item.name }}</span>

                </a>
              </v-col>

            </v-row>
            <v-row class="first-row" v-show="isActive('tab-2')">
              <v-col cols="4 mb-5" v-for="item in this.reports" :key="item.id"
                v-if="item.name !== null && item.reportTypeId == 2">
                <a href="#" class="print justify-start" @click="fetchAllReports(item.id)">
                  <span v-if="item.name.length > 30" class="truncate" @mouseover="showFullName = item.id" @mouseleave="showFullName = null"
                   > {{showFullName === item.id ? item.name : item.name.slice(0, 27) +
                      '...'
                    }}</span>
                  <span v-else> {{ item.name }}</span>
                </a>
              </v-col>
            </v-row>
            <div class="horizontal-line"></div>
            <template>
              <v-tabs fixed-tabs bg-color="indigo-darken-2" class="mt-5">
                <v-tab class="item text-capitalize" @click="setActive('tab-1')">
                  Kurzliste
                </v-tab>
                <v-tab class="item text-capitalize" @click="setActive('tab-2')">
                  Pflegeplan
                </v-tab>
              </v-tabs>
            </template>
            <div v-show="isActive('tab-1')">
              <h5 class="kurz-liste-title">Kurzliste</h5>
              <v-row class="berichte-row row">
                <v-col cols="12" class="berichte-holder">
                  <v-col cols="6" class="from-to-tree">
                    <p class="custom-label">BaumID:</p>
                    <div class="fields">
                      <v-text-field value="" prefix="Von |" outlined hide-details v-model="fromTree"></v-text-field>
                      <v-text-field value="" prefix="Bis |" outlined hide-details v-model="toTree"></v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <p class="custom-label">PflanzJahr:</p>
                    <v-text-field type="text" outlined clearable hide-details v-model="plantingYear"
                      required></v-text-field>
                  </v-col>
                </v-col>
              </v-row>
              <h5 class="kurz-liste-title">Sortieren</h5>
              <v-row class="berichte-row row">
                <v-col cols="12" class="berichte-holder">
                  <v-col cols="3">
                    <v-checkbox label="PflanzJahr" v-model="treeSortPlantingYear"></v-checkbox>
                  </v-col>
                  <v-col cols="3">
                    <v-checkbox label="Höhe" v-model="height"></v-checkbox>
                  </v-col>

                  <v-col cols="6">
                    <p class="custom-label">Baumart:</p>
                    <v-select v-model="selectedTreeTypeId" :items="treeType" item-value="id"
                      :item-text="item => `${item.abbreviation} - ${item.germanName}`" outlined clearable hide-details>
                    </v-select>
                  </v-col>

                </v-col>
              </v-row>
              <v-col cols="12" class="form-element-holder">
                <div class="buttons">
                  <v-btn type="submit" size="x-large" height="54px" color="#1db954" class="submit-btn"
                    @click="exportBtnClicked">
                    Exportieren
                  </v-btn>
                </div>
              </v-col>
            </div>
            <div v-show="isActive('tab-2')">
              <h5 class="kurz-liste-title">Pflegeplan</h5>
              <v-row class="berichte-row row">
                <v-col cols="12" class="berichte-holder">
                  <v-col cols="4" class="from-to-tree">
                    <p class="custom-label">BaumID:</p>
                    <div class="fields">
                      <v-text-field value="" prefix="Von |" outlined hide-details v-model="pfFromTree"></v-text-field>
                      <v-text-field value="" prefix="Bis |" outlined hide-details v-model="pfToTree"></v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <p class="custom-label">Massnahme:</p>
                    <v-select v-model="workTypeId" :items="workTypes" item-value="id"
                      :item-text="item => `${item.abbreviation} - ${item.description}`" outlined clearable hide-details>
                    </v-select>
                  </v-col>
                  <v-col cols="4">
                    <div class="from-to-dates">
                      <p class="custom-label">Datum</p>

                      <div class="fields">
                        <v-menu ref="menufromDate" v-model="menufromDate" :close-on-content-click="false"
                          transition="scale-transition" offset-y>
                          <template v-slot:activator="{ on }">
                            <v-text-field v-model="fromDate" append-icon="mdi-calendar-blank-outline" outlined
                              placeholder="Jan 6, 2022" readonly clearable hide-details v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="fromDate" no-title>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menufromDate = false">
                              Cancel
                            </v-btn>
                            <v-btn text color="primary" @click="$refs.menufromDate.save(fromDate)">
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-menu>

                        <v-menu ref="menutoDate" v-model="menutoDate" :close-on-content-click="false"
                          transition="scale-transition" offset-y>
                          <template v-slot:activator="{ on }">
                            <v-text-field v-model="toDate" append-icon="mdi-calendar-blank-outline" outlined
                              placeholder="Jan 6, 2022" readonly clearable hide-details v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="toDate" no-title>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menutoDate = false">
                              Cancel
                            </v-btn>
                            <v-btn text color="primary" @click="$refs.menutoDate.save(toDate)">
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-menu>
                      </div>
                    </div>
                  </v-col>

                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="d-flex pa-0">
                  <v-col cols="3">
                    <v-checkbox label="Offene Arbeiten" v-model="openWork"></v-checkbox>
                  </v-col>
                  <v-col cols="3">
                    <v-checkbox label="Erledigte Arbeiten" v-model="completedWork"></v-checkbox>
                  </v-col>
                </v-col>
              </v-row>
              <h5 class="kurz-liste-title">Sortieren</h5>
              <v-row class="berichte-row row">
                <v-col cols="12" class="berichte-holder">
                  <v-col cols="3">
                    <v-checkbox label="PflanzJahr" v-model="taskSortPlantingYear"></v-checkbox>
                  </v-col>
                  <v-col cols="3">
                    <v-checkbox label="Höhe" v-model="taskSortHeight"></v-checkbox>
                  </v-col>
                  <v-col cols="6">
                    <p class="custom-label">Baumart:</p>
                    <v-select v-model="taskSelectedTreeTypeId" :items="treeType" item-value="id"
                      :item-text="item => `${item.abbreviation} - ${item.germanName}`" outlined clearable hide-details>
                    </v-select>
                  </v-col>

                </v-col>
              </v-row>
              <v-col cols="12" class="form-element-holder">
                <div class="buttons">
                  <v-btn type="submit" size="x-large" height="54px" color="#1db954" class="submit-btn"
                    @click="exportPfBtnClicked">
                    Exportieren
                  </v-btn>
                </div>
              </v-col>

            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      //reports 
      reports: [],
      //kurzliste
      inventoryId: null,
      fromTree: "",
      toTree: "",
      plantingYear: null,
      treeSortPlantingYear: false,
      height: false,
      selectedTreeTypeId: null,
      treeType: [],
      workTypes: [],
      //tabs
      activeTab: 'tab-1',
      //pflegenplan
      pfFromTree: "",
      pfToTree: "",
      menufromDate: false,
      menutoDate: false,
      fromDate: "",
      toDate: "",
      openWork: false,
      completedWork: false,
      taskSortPlantingYear: false,
      taskSortHeight: false,
      taskSelectedTreeTypeId: null,
      workTypeId: null,
      showFullName: null
    };
  },
  computed: {
    ...mapGetters(["inventarId"])
  },
  methods: {
    setActive(tab) {
      this.activeTab = tab;
    },
    isActive(tab) {
      return this.activeTab === tab;
    },
    getAllTreeType() {
      axios
        .get(`https://tilia.rrota.org/api/TreeType/GetAll`)
        .then((response) => {
          // Handle the response from the server
          this.treeType = response.data
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //TREE REPORT
    async fetchTreeReport() {
      const paramString = this.createParamString();
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Report/TreeReport/${paramString}`,
          { responseType: 'blob' }
        ).then(response => {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const link = document.createElement('a')
          link.download = 'Kurzliste.pdf';
          link.href = URL.createObjectURL(blob)
          link.target = '_blank';
          link.click()
          document.body.appendChild(link);
        }).catch(console.error);
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },
    exportBtnClicked() {
      this.fetchTreeReport();
    },
    createParamString() {
      const params = [];
      params.push(`FilterName=tree`);
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
        this.plantingYear !== null &&
        this.plantingYear !== undefined &&
        this.plantingYear !== ""
      ) {
        params.push(`PlantingYear=${this.plantingYear}`);
      }
      if (
        this.selectedTreeTypeId !== null &&
        this.selectedTreeTypeId !== undefined &&
        this.selectedTreeTypeId !== ""
      ) {
        params.push(`TreeSort.TreeTypeId=${this.selectedTreeTypeId}`);
      }
      if (this.treeSortPlantingYear === true) {
        params.push(`TreeSort.PlantingYear=true`);
      }
      if (this.height === true) {
        params.push(`TreeSort.Height=true`);
      }
      return (
        this.inventarId +
        "?" +
        params.join("&")
      );
    },
    async fetchWorkTypes(name) {
      var endpoint = `https://tilia.rrota.org/api/WorkType/GetAll`;
      if (name) {
        endpoint += `?name=${name}`;
      }
      try {
        const response = await axios.get(endpoint);
        this.workTypes = response.data;
        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
        this.showAlert = true;
      }
    },

    //TASK REPORT
    async fetchTaskReport() {
      const paramString = this.createTaskParamString();
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Report/TaskReport/${paramString}`,
          { responseType: 'blob' }
        ).then(response => {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          console.log(blob);
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.target = '_blank';
          link.download = 'Pflegeplan.pdf';
          link.click()
          document.body.appendChild(link);
        }).catch(console.error);
      }
      catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },
    exportPfBtnClicked() {
      this.fetchTaskReport();
    },
    createTaskParamString() {
      const params = [];
      params.push(`FilterName=task`);
      if (
        this.pfFromTree !== null &&
        this.pfFromTree !== undefined &&
        this.pfFromTree !== ""
      ) {
        params.push(`FromTree=${this.pfFromTree}`);
      }
      if (
        this.pfToTree !== null &&
        this.pfToTree !== undefined &&
        this.pfToTree !== ""
      ) {
        params.push(`ToTree=${this.pfToTree}`);
      }
      if (
        this.workTypeId !== null &&
        this.workTypeId !== undefined &&
        this.workTypeId !== ""
      ) {
        params.push(`WorkTypeId=${this.workTypeId}`);
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
      if (this.openWork && !this.completedWork) {
        params.push(`TaskType=open`);
      }
      else if (!this.openWork && this.completedWork) {
        params.push(`TaskType=closed`);
      }
      else if (this.openWork && this.completedWork) {
        params.push(`TaskType=all`);
      }
      if (this.taskSortPlantingYear === true) {
        params.push(`TasksSort.PlantingYear=true`);
      }
      if (
        this.taskSelectedTreeTypeId !== null &&
        this.taskSelectedTreeTypeId !== undefined &&
        this.taskSelectedTreeTypeId !== ""
      ) {
        params.push(`TasksSort.TreeTypeId=${this.taskSelectedTreeTypeId}`);
      }
      if (this.taskSortHeight === true) {
        params.push(`TasksSort.Height=true`);
      }
      return (
        this.inventarId +
        "?" +
        params.join("&")
      );
    },
    async fetchAllReports(itemId) {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Report/GetAll/`
        );
        if (itemId != null && itemId != 0) {
          this.showFullName = itemId;
          const reportObj = response.data.filter(type => type.id === itemId);
          if (reportObj) {
            if (reportObj[0].reportTypeId == 1) {
              this.fromTree = reportObj[0].fromTree;
              this.toTree = reportObj[0].toTree;
              this.plantingYear = reportObj[0].plantingYear;
              this.treeSortPlantingYear = reportObj[0].sortPlantingYear;
              this.height = reportObj[0].sortHeight;
              this.selectedTreeTypeId = reportObj[0].sortTreeTypeId;
            }
            else {
              this.pfFromTree = reportObj[0].fromTree,
                this.pfToTree = reportObj[0].fromTree,
                this.fromDate = reportObj[0].fromDate,
                this.toDate = reportObj[0].toDate,
                this.openWork = reportObj[0].fromTree,
                this.completedWork = reportObj[0].fromTree,
                this.taskSortPlantingYear = reportObj[0].sortPlantingYear,
                this.taskSortHeight = reportObj[0].sortHeight
              this.workTypeId = reportObj[0].workTypeId
              this.taskSelectedTreeTypeId = reportObj[0].sortTreeTypeId
              if (reportObj[0].taskTypeId == 1) {
                this.openWork = reportObj[0].taskTypeId,
                  this.completedWork = reportObj[0].taskTypeId
              }
              else if (reportObj[0].taskTypeId == 2) {
                this.openWork = reportObj[0].taskTypeId
              }
              else {
                this.completedWork = reportObj[0].taskTypeId
              }
            }
          }
        }
        this.reports = response.data;
        this.isloading = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },
  },
  created() {
    this.getAllTreeType();
    this.fetchWorkTypes();
    this.fetchAllReports();
  },
};
</script>
<style lang="scss">
.kurz-liste-title {
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 38px;
  color: #FFFFFF;
  margin: 20px auto;
}

.horizontal-line {
  background: #494949;
  height: 1px;
  width: 100%;
  margin-top: 18px;
}

.hr-mt {
  margin-top: 80px;
}

.fields {
  display: flex;
  gap: 25px;
}

.berichte-row {
  .berichte-holder {
    display: flex;
    align-items: flex-end;
    margin-bottom: 30px;
    padding: 0;

    .custom-label {
      display: block;
      flex-wrap: nowrap;
    }

    .from-to-tree,
    .from-to-dates {
      display: flex;
      justify-content: flex-end;
      flex-direction: column;


    }
  }
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;

  .submit-btn {
    width: 285px;
    color: #000;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    text-transform: none;
    background-color: #1db954;
  }

  .delete-btn {
    width: 285px;
    color: #fff;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    text-transform: none;
    background-color: #c82210;
  }

  .cancel-btn {
    width: 285px;
    color: #fff;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    text-transform: none;
    background-color: transparent;
    border: 1px solid #fff;
  }
}

.form-element-holder {
  margin-top: 20px;
}

.item {
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 38px;
  color: white !important;
}
</style>