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
                <a href="#" class="carte">
                  <img
                    class="karte mr-2"
                    src="../../../assets/images/map.png"
                    alt=""
                  /><span>Karte</span>
                </a>
              </v-col>
              <v-col cols="4">
                <v-btn
                  block
                  size="x-large"
                  height="54px"
                  color="#1db954"
                  class="new-btn"
                  @click="createNewTask"
                >
                  <v-icon>mdi mdi-plus-thick</v-icon>
                  Neue Baumkontrollen
                </v-btn>
              </v-col>
            </v-row>
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
      <BaumControlListDatatable
        :headers="isMobileViewport ? headersMobile : headers"
        :tableData="tableData"
        :showSelect="true"
        :singleSelect="false"
        :actions="[
          { id: 1, icons: require('../../../assets/images/icons/eye-outline.svg'), action: 'view', params: '' },
          {
            id: 2,
            icons: require('../../../assets/images/icons/edit-outline.svg'),
            action: 'createEditBaumK',
            params: ''
          },
          { id: 3, icons: require('../../../assets/images/icons/pencil-outline.svg'), action: 'edit', params: '' }
        ]"
        @createEditBaumK="createEditBKMethod"
        @edit="editTaskMethod"
        @view="viewBKMethod"
        :userCanView="userCanView"
        :userCanEdit="userCanEdit"
        :userCanDelete="userCanDelete"
      />
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Tasks from "@/consts/taskTypes";
import BaumControlListDatatable from "../../../components/custom_components/BaumControlListDatatable.vue";
import { eventBus } from "../../../main";
import axios from "axios";
export default {
  components: {
    BaumControlListDatatable
  },
  data() {
    return {
      /* useraccess */
      userCanEdit: false,
      userCanView: false,
      userCanDelete: false,
      /* end of useraccess */

      isMobileViewport: false,

      isloading: true,
      years: [],
      headers: [
        {
          text: "Etappe",
          align: "start",
          value: "date"
        },
        { text: "BaumID", value: "treeName" },
        {
          text: "Massnahme",
          value: "workType",
          sortable: false
        },
        {
          text: "Intervall",
          value: "interval",
          sortable: false
        },
        {
          text: "Spez. Std",
          value: "specialHours",
          sortable: false
        },
        {
          text: "Bp1.Std",
          value: "normalHours",
          sortable: false
        },
        { text: "Mat.Fr.", value: "material", sortable: false },
        { text: "Datum", value: "finishDate" },
        {
          text: "Visum",
          value: "examinationFinishedUsers",
          sortable: false
        },
        { text: "", value: "buttons", align: "start", sortable: false }
      ],
      headersMobile: [
        {
          text: "Etappe",
          align: "start",
          value: "date",
          width: "120px"
        },
        { text: "BaumID", value: "treeName", width: "110px" },
        {
          text: "Massnahme",
          value: "workType",
          width: "140px",
          sortable: false
        },
        {
          text: "Intervall",
          value: "interval",
          width: "70px",
          sortable: false
        },
        {
          text: "Spez. Std",
          value: "specialHours",
          width: "75px",
          sortable: false
        },
        {
          text: "Bp1.Std",
          value: "normalHours",
          width: "70px",
          sortable: false
        },
        { text: "Mat.Fr.", value: "material", width: "70px", sortable: false },
        { text: "Datum", value: "finishDate", width: "120px" },
        {
          text: "Visum",
          value: "examinationFinishedUsers",
          width: "95px",
          sortable: false
        },
        { text: "", value: "buttons", align: "start", sortable: false }
      ],
      tableData: [],
      years: [],
      year: null,
      taskType: 2,
      TaskTypes: null
    };
  },
  computed: {
    ...mapGetters(["inventarId"]),

    orderedYears() {
      return this.years.slice().reverse();
    }
  },
  created() {
    const date = new Date();
    this.year = date.getFullYear();
  },
  mounted() {
    /* check viewportsizes */
    this.updateIsMobile();
    window.addEventListener("resize", this.updateIsMobile);

    this.TaskTypes = Tasks;
    this.fetchYears();
    this.fetchTasks();
  },
  methods: {
    updateIsMobile() {
      const width = window.innerWidth;
      if (width < 1400) {
        this.isMobileViewport = true;
      } else {
        this.isMobileViewport = false;
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

    async fetchTasks() {
      console.log("iiiiddd", this.inventarId);

      const paramString = this.createParamString();
      console.log("paramssss:", paramString);

      eventBus.$emit("resetSelectedTasks");

      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/TreeExamination/GetAll/${paramString}`
        );
        console.log("tasks", response.data);
        console.log("access", response.data.access);

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

    onTaskFilter(tasktype) {
      this.taskType = tasktype;
      this.tableData = [];
      this.fetchTasks();
    },

    yearChange(year) {
      this.year = year;
      this.tableData = [];
      this.fetchTasks();
    },

    onTaskFilter(tasktype) {
      this.taskType = tasktype;
      this.tableData = [];
      this.fetchTasks();
    },

    createParamString() {
      const params = [];

      if (
        this.taskType !== null &&
        this.taskType !== undefined &&
        this.taskType !== ""
      ) {
        params.push(`TaskType=${this.taskType}`);
      }

      return this.inventarId + "/" + this.year + "?" + params.join("&");
    },

    editTaskMethod(item) {
      console.log(item);
      this.$router.push({
        name: "Pflegemassnahme bearbeiten",
        params: {
          taskId: item.id,
          canDelete: this.userCanDelete,
          year: this.year,
          fromBaumKontroll: true
        }
      });
    },

    createEditBKMethod(item) {
      console.log("komplet Itemi: ", item);
      console.log(item.id);

      this.$router.push({
        name: "BaumKontrollDetails",
        params: {
          taskId: item.id,
          treeId: item.treeId,
          treeName: item.treeName,
          treeExaminationId: item.treeExaminationId,
          isEditBK: item.isFinished,
          isSealed: item.isSealed,
          viewOnly: false
        }
      });
    },

    viewBKMethod(item) {
      console.log("komplet Itemi: ", item);
      console.log(item.id);

      this.$router.push({
        name: "BaumKontrollDetails",
        params: {
          taskId: item.id,
          treeId: item.treeId,
          treeName: item.treeName,
          treeExaminationId: item.treeExaminationId,
          isSealed: item.isSealed,
          isEditBK: item.isFinished,
          viewOnly: true
        }
      });
    },

    createNewTask() {
      this.$router.push({
        name: "Neue Pflegemassnahme",
        params: { fromBaumKontroll: true }
      });
    }
  }
};
</script>

<style></style>
