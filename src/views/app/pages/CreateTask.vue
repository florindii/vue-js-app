<template>
  <div class="wrapper">
    <div class="new-tree-form">
      <v-container fluid>
        <v-form @submit.prevent="submitFunction" ref="createTaskForm">
          <v-row>
            <v-col cols="6" class="form-element-holder">
              <div>
                <p class="custom-label">Etappe*</p>

                <div class="fields">
                  <v-menu
                    ref="dateMenu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :value="dateToShow"
                        append-icon="mdi-calendar-blank-outline"
                        outlined
                        readonly
                        clearable
                        v-on="on"
                        @click:clear="
                          clearDate();
                          generateTable();
                        "
                        :rules="requiredRule"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      no-title
                      @input="generateTable"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dateMenu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dateMenu.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </div>
              </div>
            </v-col>

            <v-col cols="6" class="form-element-holder">
              <div>
                <p class="custom-label">Massnahme*</p>

                <div class="fields" @click="showWtPopupFunction">
                  <v-text-field
                    outlined
                    clearable
                    readonly
                    :value="finalWorkTypeSelection"
                    @click:clear="clearedWorktypeSelection"
                    :rules="requiredRule"
                  >
                    <v-icon slot="append" color="white">
                      mdi-chevron-down
                    </v-icon>
                  </v-text-field>
                </div>
              </div>
            </v-col>

            <v-col cols="12" class="form-element-holder">
              <div>
                <p class="custom-label">BaumID*</p>

                <div class="fields" @click="showBaumPopupFunction">
                  <v-combobox
                    v-model="selectedBaums"
                    :items="[]"
                    item-text="name"
                    item-value="id"
                    chips
                    clearable
                    multiple
                    outlined
                    solo
                    :rules="baumRequiredRule"
                    @click:clear="clearBaumSelection()"
                  >
                    <v-icon slot="append" color="white">
                      mdi-chevron-down
                    </v-icon>
                    <template
                      v-slot:selection="{ attrs, item, select, selected }"
                    >
                      <v-chip
                        v-bind="attrs"
                        :input-value="selected"
                        color="#1db954"
                        text-color="#000"
                        close
                        close-icon="mdi mdi-close"
                        @click="select"
                        @click:close="removeBaumChip(item)"
                      >
                        <strong>{{ item.name }}</strong>
                      </v-chip>
                    </template>
                  </v-combobox>
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="form-element-holder">
              <div>
                <p class="custom-label">Intervall*</p>

                <div class="fields">
                  <v-text-field
                    class="number-input"
                    v-model="intervalValue"
                    append-outer-icon="mdi-plus"
                    prepend-icon="mdi-minus"
                    outlined
                    hide-spin-buttons
                    @click:append-outer="
                      plusClicked('intervalValue');
                      generateTable();
                    "
                    @click:prepend="
                      minusClicked('intervalValue');
                      generateTable();
                    "
                    @input="generateTable"
                    :rules="positiveNumberRule"
                  ></v-text-field>
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="form-element-holder">
              <div>
                <p class="custom-label">Wiederholen*</p>

                <div class="fields">
                  <v-text-field
                    class="number-input"
                    v-model="repeatlValue"
                    append-outer-icon="mdi-plus"
                    prepend-icon="mdi-minus"
                    outlined
                    hide-spin-buttons
                    @click:append-outer="
                      plusClicked('repeatlValue');
                      generateTable();
                    "
                    @click:prepend="
                      minusClicked('repeatlValue');
                      generateTable();
                    "
                    @input="generateTable"
                    :rules="positiveNumberRule"
                  ></v-text-field>
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="form-element-holder">
              <div>
                <p class="custom-label">Spz.Std*</p>

                <div class="fields">
                  <v-text-field
                    class="number-input"
                    v-model="specialHrsValue"
                    append-outer-icon="mdi-plus"
                    prepend-icon="mdi-minus"
                    outlined
                    hide-spin-buttons
                    @click:append-outer="
                      plusClicked('specialHrsValue');
                      generateTable();
                    "
                    @click:prepend="
                      minusClicked('specialHrsValue');
                      generateTable();
                    "
                    :rules="positiveFloatNrRule"
                    @input="generateTable"
                  ></v-text-field>
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="form-element-holder">
              <div>
                <p class="custom-label">Bp1.Std*</p>

                <div class="fields">
                  <v-text-field
                    class="number-input"
                    v-model="normalHrsValue"
                    append-outer-icon="mdi-plus"
                    prepend-icon="mdi-minus"
                    outlined
                    hide-spin-buttons
                    @click:append-outer="
                      plusClicked('normalHrsValue');
                      generateTable();
                    "
                    @click:prepend="
                      minusClicked('normalHrsValue');
                      generateTable();
                    "
                    :rules="positiveFloatNrRule"
                    @input="generateTable"
                  ></v-text-field>
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="form-element-holder">
              <div>
                <p class="custom-label">Material*</p>

                <div class="fields">
                  <v-text-field
                    v-model="materialValue"
                    outlined
                    :rules="positiveNumberRule"
                    @input="generateTable"
                  ></v-text-field>
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="form-element-holder material-list">
              <div>
                <div class="fields">
                  <a href="" class="document" target="_blank" download>
                    <img src="../../../assets/images/icons/berichte-active.svg" class="mr-3"/>
                    Material Liste
                  </a>
                </div>
              </div>
            </v-col>

            <v-col cols="12" class="form-element-holder">
              <div>
                <p class="custom-label">Info*</p>

                <div class="fields">
                  <v-textarea
                    outlined
                    auto-grow
                    :counter="maxCharacters"
                    name="infoTextarea"
                    v-model="textareaInfo"
                    ref="infoTextarea"
                    @input="generateTable"
                  ></v-textarea>
                </div>
              </div>
            </v-col>

            <v-col
              cols="12"
              class="form-element-holder"
              v-show="tableData.length > 0"
            >
              <div class="table-holder">
                <NewTaskDatatable :headers="headers" :tableData="tableData" />
              </div>
            </v-col>

            <v-col cols="12" class="form-element-holder">
              <div class="buttons">
                <v-btn
                  size="x-large"
                  height="54px"
                  class="cancel-btn"
                  @click="allowNavigate = true, showCancelPopup = true"
                >
                  Abbrechen
                </v-btn>

                <v-btn
                  type="submit"
                  size="x-large"
                  height="54px"
                  color="#1db954"
                  class="submit-btn"
                >
                  Einreichen
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </div>

    <div class="popup" v-show="showWorktypePopup" ref="worktypePopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="this.closeWtPopupFunction"
          >mdi mdi-close</v-icon
        >
        <p class="title">Massnahme</p>

        <v-text-field
          class="search"
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
            v-model="selectedWtChar"
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
              :class="selectedWtChar === letter ? 'green' : ''"
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
              @click="radioWtClicked(wt)"
            ></v-radio>
          </v-radio-group>
        </div>
      </div>
    </div>

    <div class="popup" v-show="showBaumPopup" ref="baumPopup">
      <div class="popup-holder">
        <v-icon
          size="36"
          class="close-popup"
          @click="
            showBaumPopup = false;
            generateTable();
          "
          >mdi mdi-close</v-icon
        >
        <p class="title">Baum Id</p>

        <v-text-field
          :key="2"
          class="search"
          placeholder="Suchen"
          v-model="baumSearchText"
          @keyup="searchBaums"
        >
          <v-icon slot="append" color="white">
            mdi-magnify
          </v-icon>
        </v-text-field>

        <div class="alphabet">
          <v-chip-group
            v-model="selectedBaumChar"
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
              :class="selectedBaumChar === letter ? 'green' : ''"
              @click="selectBaumLetter(letter)"
              outlined
            >
              <span>{{ letter }}</span>
            </v-chip>
          </v-chip-group>
        </div>

        <div class="baums" v-show="baums.length">
          <v-checkbox
            v-for="(baum, index) in baums"
            :key="index"
            :label="baum.name"
            :value="baum.id"
            class="custom-radio"
            v-model="selectedBaumIds"
            hide-details
          ></v-checkbox>
        </div>

        <div class="buttons">
          <v-btn
            size="x-large"
            height="54px"
            class="cancel-btn"
            @click="
              showBaumPopup = false;
              generateTable();
            "
          >
            Abbrechen
          </v-btn>

          <v-btn
            type="submit"
            size="x-large"
            height="54px"
            color="#1db954"
            class="submit-btn"
            @click="
              showBaumPopup = false;
              generateTable();
            "
          >
            Einreichen
          </v-btn>
        </div>
      </div>
    </div>

    <div class="cancel-popup" v-show="showCancelPopup" ref="cancelPopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="showCancelPopup = false"
          >mdi mdi-close</v-icon
        >

        <p class="title">Abbrechen</p>

        <div class="description-holder">
          <v-icon color="#C82210" class="popup-icon"
            >mdi mdi-alert-outline</v-icon
          >

          <p class="description">
            Wollen Sie die Aktion wirklich Abbrechen?
          </p>
        </div>

        <div class="buttons">
          <v-btn
            size="x-large"
            height="54px"
            class="cancel-btn"
            @click="showCancelPopup = false"
          >
            Nein
          </v-btn>

          <v-btn
            size="x-large"
            height="54px"
            color="#c82210"
            class="delete-btn"
            @click="redirectToTasks"
          >
            Ja
          </v-btn>
        </div>
      </div>
    </div>

    <v-alert
      :type="hasError ? 'error' : 'success'"
      dismissible
      elevation="20"
      v-show="showAlert"
      class="alert"
      @input="redirectToTasks"
    >
      {{ hasError ? "There was an error" : "Successfully created task" }}
    </v-alert>

    <CustomLoader v-show="isLoading" />
  </div>
</template>

<script>
/* baumkontroll worktype id is 1020 */
import { mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
import NewTaskDatatable from "../../../components/custom_components/newTaskDatatable.vue";
import CustomLoader from "../../../components/custom_components/CustomLoader.vue";

export default {
  /* Check if the next route is already set or if navigation is explicitly allowed */
  /* allowNavigate is when we create and want to redirect without showing popup */
  beforeRouteLeave(to, from, next) {
    if (this.nextRoute || this.allowNavigate) {
      next();
    } else {
      this.nextRoute = to;
      this.showCancelPopup = true;
    }
  },
  components: {
    NewTaskDatatable,
    CustomLoader
  },
  data() {
    return {
      isLoading: false,
      hasError: false,
      showAlert: false,
      nextRoute: null,
      allowNavigate: false,
      isComingFromBaumKontroll: false,
      showCancelPopup: false,
      selectedBaumIds: [],
      headers: [
        {
          text: "Datum",
          value: "date",
          width: "120px",
          sortable: false
        },
        {
          text: "Massnahme",
          value: "selectedWorktype",
          width: "135px",
          sortable: false
        },
        {
          text: "Baum Id",
          value: "selectedBaum",
          width: "200px",
          sortable: false
        },
        {
          text: "Bp1",
          value: "normalHrsValue",
          width: "75px",
          sortable: false
        },
        {
          text: "Spez",
          value: "specialHrsValue",
          width: "85px",
          sortable: false
        },
        {
          text: "Material",
          value: "materialValue",
          width: "90px",
          sortable: false
        },
        {
          text: "Info",
          value: "textareaInfo",
          width: "200px",
          sortable: false
        }
      ],
      tableData: [],
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
      dateMenu: false,
      date: moment().format("YYYY-MM-DD"),
      showWorktypePopup: false,
      selectedWtChar: null,
      previouslySelectedChar: null,
      selectedWorktype: null,
      workTypes: [],
      finalWorkTypeSelection: "",
      finalWorkTypeSelectionId: null,
      workTypeSearchText: "",

      showBaumPopup: false,
      selectedBaumChar: null,
      previouslySelectedBaumChar: null,
      baums: [],
      baumSearchText: "",

      intervalValue: 1,
      repeatlValue: 1,
      specialHrsValue: 1,
      normalHrsValue: 1,
      materialValue: "",
      maxCharacters: 300,
      textareaInfo: "",

      /* rules */
      requiredRule: [v => !!v || "This field is required"],
      baumRequiredRule: [
        v => (!!v && v.length > 0) || "This field is required"
      ],
      positiveNumberRule: [
        v => {
          v = String(v);
          if (v != null && v != "") {
            if (isNaN(parseInt(v))) return "This field must be number!";
            return true;
          } else {
            return "This field is required";
          }
        },
        v =>
          (Number.isInteger(Number(v)) && Number(v) > -1) ||
          "Please enter a valid positive integer"
      ],
      positiveFloatNrRule: [
        v => {
          v = String(v);
          if (v != null && v != "") {
            if (isNaN(parseFloat(v))) return "This field must be number!";
            return true;
          } else {
            return "This field is required";
          }
        },
        v =>
          (Number.parseFloat(v) > 0 && !Number.isNaN(Number.parseFloat(v))) ||
          "Please enter a valid positive number",
        v => /^\d*\.?\d+$/.test(v) || "Please enter a valid positive number"
        /* this allows only . not , */
      ],
      // textareaRule: [
      //   v => {
      //     if (!v) {
      //       return "Message is required";
      //     } else if (v.length > this.maxCharacters) {
      //       return "Message is too long";
      //     } else {
      //       return true;
      //     }
      //   }
      // ]
    };
  },
  computed: {
    ...mapGetters(["inventarId"]),

    dateToShow() {
      return this.date ? moment(this.date).format("DD-MM-YYYY") : "";
    },

    selectedBaums() {
      return this.selectedBaumIds.map(id => {
        const baum = this.baums.find(item => item.id === id);
        return baum;
      });
    }
  },
  watch: {
    intervalValue(newVal) {
      if (newVal === 0) {
        this.repeatlValue = 0;
      }
    }
  },
  mounted() {
    this.isComingFromBaumKontroll = this.$route.params.fromBaumKontroll;

    if (this.isComingFromBaumKontroll === true) {
      this.finalWorkTypeSelectionId = 1020;
      this.finalWorkTypeSelection = "bak";
    }
  },
  methods: {
    async fetchWorkTypes(name) {
      var endpoint = `https://tilia.rrota.org/api/WorkType/GetAll`;
      if (name) {
        endpoint += `?name=${name}`;
      }

      this.isLoading = true;
      try {
        const response = await axios.get(endpoint);
        // console.log("worktypes: ", response.data);

        this.workTypes = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
        this.showAlert = true;
      }
    },

    async fetchBaums(name) {
      var endpoint = `https://tilia.rrota.org/api/Tree/GetAllWithParameters/${this.inventarId}`;

      if (name) {
        endpoint += `?name=${name}`;
      }

      this.isLoading = true;
      try {
        const response = await axios.get(endpoint);
        // console.log("Baums: ", response.data);

        this.baums = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
        this.showAlert = true;
      }
    },

    async createTask() {
      // console.log("date: ", this.date);
      // console.log("workTypeId: ", this.finalWorkTypeSelectionId);
      // console.log("interval: ", this.intervalValue);
      // console.log("normalHours: ", this.normalHrsValue);
      // console.log("specialHours: ", this.specialHrsValue);
      // console.log("material: ", this.materialValue);
      // console.log("info: ", this.textareaInfo);
      // console.log("baumIds: ", this.selectedBaumIds);

      let taskDetailsArray = this.selectedBaumIds.map(element => {
        return {
          treeId: element
        };
      });

      // console.log("arrayObjekti: ", taskDetailsArray);
      this.isLoading = true;

      try {
        const response = await axios.post(
          "https://tilia.rrota.org/api/Tasks/Create",
          {
            date: this.date,
            workTypeId: this.finalWorkTypeSelectionId,
            interval: this.intervalValue,
            repeat: this.repeatlValue,
            normalHours: parseFloat(this.normalHrsValue),
            specialHours: parseFloat(this.specialHrsValue),
            material: this.materialValue,
            info: this.textareaInfo,
            tasksDetails: taskDetailsArray
          }
        );

        if (response.status === 200) {
          // console.log("CreateTaskResponse: ", response);

          this.allowNavigate = true;
          this.isLoading = false;
          this.hasError = false;
          this.showAlert = true;
        }
      } catch (error) {
        console.log(error);
        this.hasError = true;
        this.showAlert = true;
      }
    },

    clearDate() {
      this.date = "";
    },

    selectLetter(letter) {
      this.selectedWtChar = letter;

      if (letter === this.previouslySelectedChar) {
        this.selectedWtChar = null;
      }
      this.previouslySelectedChar = this.selectedWtChar;

      if (this.selectedWtChar) {
        this.fetchWorkTypes(this.selectedWtChar);
      } else {
        this.fetchWorkTypes();
      }
      this.workTypeSearchText = "";
    },
    showWtPopupFunction() {
      this.showWorktypePopup = true;
      this.fetchWorkTypes();
    },
    clearedWorktypeSelection() {
      this.finalWorkTypeSelection = "";
      this.finalWorkTypeSelectionId = null;
      this.selectedWorktype = null;
      this.generateTable();
    },
    closeWtPopupFunction() {
      this.showWorktypePopup = false;
      this.workTypeSearchText = "";
      this.workTypes = [];
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
      this.selectedWtChar = false;
      this.previouslySelectedChar = null;
    },
    radioWtClicked(wt) {
      this.finalWorkTypeSelection = wt.abbreviation;
      this.finalWorkTypeSelectionId = wt.id;
      this.showWorktypePopup = false;
      this.generateTable();
    },

    /* functions for baum */
    showBaumPopupFunction() {
      this.showBaumPopup = true;
      this.fetchBaums();
    },

    closeBaumPopupFunction() {
      this.showBaumPopup = false;
      this.baumSearchText = "";
      this.selectedBaumIds = [];
      this.baums = [];
    },

    clearBaumSelection() {
      this.selectedBaumIds = [];
      this.generateTable();
    },

    searchBaums() {
      if (this.baumSearchText) {
        clearTimeout(this.searchTimeOut);
        this.searchTimeOut = setTimeout(() => {
          this.fetchBaums(this.baumSearchText);
          clearTimeout(this.searchTimeOut);
        }, 300);
      } else {
        this.baums = [];
        this.fetchBaums();
      }
      this.selectedBaumChar = false;
      this.previouslySelectedBaumChar = null;
    },

    selectBaumLetter(letter) {
      this.selectedBaumChar = letter;

      if (letter === this.previouslySelectedBaumChar) {
        this.selectedBaumChar = null;
      }
      this.previouslySelectedBaumChar = this.selectedBaumChar;

      if (this.selectedBaumChar) {
        this.fetchBaums(this.selectedBaumChar);
      } else {
        this.fetchBaums();
      }
      this.baumSearchText = "";
    },

    generateTable() {
      if (this.date && this.intervalValue && this.repeatlValue) {
        let myArray = [];

        if (this.intervalValue === 0) {
          this.tableData = [];
          return;
        } else {
          let calculatedDate;
          let formatedCalculatedDate;

          for (let i = 0; i < this.repeatlValue; i++) {
            if (i == 0) {
              calculatedDate = moment(this.date);
              formatedCalculatedDate = calculatedDate.format("DD-MM-YYYY");
            } else {
              calculatedDate = moment(calculatedDate).add(
                this.intervalValue,
                "years"
              );
              formatedCalculatedDate = calculatedDate.format("DD-MM-YYYY");
            }

            myArray.push({
              date: formatedCalculatedDate,
              // selectedBaum: this.selectedBaum,
              selectedBaum: this.selectedBaums
                .map(item => item.name)
                .join(", "),
              selectedWorktype: this.selectedWorktype,
              normalHrsValue: this.normalHrsValue,
              specialHrsValue: this.specialHrsValue,
              materialValue: this.materialValue,
              textareaInfo: this.textareaInfo
            });
          }

          this.tableData = myArray;
        }
      } else {
        this.tableData = [];
      }
    },

    removeBaumChip(item) {
      this.selectedBaumIds = this.selectedBaumIds.filter(i => i !== item.id);

      this.generateTable();
    },

    minusClicked(propertyName) {
      this[propertyName]--;
      if (isNaN(parseFloat(this[propertyName])) || this[propertyName] < 0)
        this[propertyName] = 0;
    },

    plusClicked(propertyName) {
      this[propertyName]++;
      if (isNaN(parseFloat(this[propertyName]))) this[propertyName] = 0;
    },

    redirectToTasks() {
      if(this.nextRoute) {
        this.$router.push(this.nextRoute);
      } else {
        /* if worktype id is baumkontroll, redirect to baumkontroll tasks */
        if(this.finalWorkTypeSelectionId === 1020) {
          this.$router.push({
            name: "Baumkontrolle"
          });
        } else {
          this.$router.push({
            name: "Pflegeplan"
          });
        }
      }
    },

    submitFunction() {
      this.$refs.createTaskForm.validate();

      if (this.$refs.createTaskForm.validate() === true) {
        console.log("valid");

        this.createTask();
      } else {
        console.log("invalid");
        return;
      }
    }
  }
};
</script>

<style lang="scss">
.wrapper{
  background-color: #12121212;
}
.alert {
  position: fixed;
  width: 100%;
  max-width: 684px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 100px;
  z-index: 8000;
}

.new-tree-form {
  width: 940px;
  max-width: 100%;
  margin: 0 auto;

  .form-element-holder {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 30px;

    &.material-list {
      justify-content: center;
      margin-bottom: 20px;
    }

    .document {
      display: flex;
      align-items: center;
      height: 56px;
      font-size: 16px;
      line-height: 24px;
      text-decoration: underline;
      color: #fff;

      span {
        color: #1db954;
        margin-right: 10px;
        font-size: 20px;
      }
    }

    .fields {
      .number-input {
        input[type="text"] {
          text-align: center !important;
        }

        fieldset {
          border-left: 0;
          border-right: 0;
          border-radius: 0;
          border-width: 1px;
        }
      }

      .v-input__slot {
        background-color: transparent !important;
      }

      .v-input__append-outer,
      .v-input__prepend-outer {
        margin: 0;
        // background: #1db954;
        // padding: 16px;
        cursor: pointer;
        border-radius: 4px;

        .v-input__icon {
          width: auto;
          height: auto;
        }

        .v-icon {
          color: #000000 !important;
          background-color: #1db954;
          padding: 16px;

          &::after {
            opacity: 0 !important;
          }
        }
      }

      .v-input__append-outer {
        .v-icon {
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }
      }

      .v-input__prepend-outer {
        .v-icon {
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
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
  }
}

.popup,
.confirm-popup,
.cancel-popup {
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

    .description-holder {
      display: flex;
      height: 200px;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .popup-icon {
        margin-bottom: 20px;
        font-size: 50px;
      }

      .description {
        font-size: 18px;
        line-height: 25px;
        margin-bottom: 0;
        text-align: center;
      }
    }

    .work-types,
    .baums {
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
        margin-top: 0;
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
  }
}
</style>
