<template>
  <div>
    <v-card class="custom-buttons-holder">
      <v-container fluid>
        <v-row justify="end">
          <v-col cols="12">
            <v-row class="first-row">
              <v-col cols="2">
                <a
                  href="javascript:void(0);"
                  class="edit"
                  v-show="canEdit"
                  :class="taskData.isFinished ? 'disabled' : ''"
                >
                  <span class="mdi mdi-pencil-outline custom-icon"></span
                  ><span @click="editMethod(taskId)">Bearbeiten</span>
                </a>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card class="task-info" :loading="isLoading">
      <v-container fluid v-if="hasError == false">
        <v-form ref="form">
          <v-row>
            <v-col cols="7" class="left-side">
              <v-row>
                <v-col cols="12" class="task-heading">
                  <span class="avatar-color green"></span>

                  <div class="title-details">
                    <p class="title">
                      {{ taskData ? taskData.treeName : null }}
                    </p>
                    <p class="extra-info">
                      {{ taskData ? taskData.treeType : null }}
                    </p>
                  </div>
                </v-col>
              </v-row>

              <v-divider class="custom-divider"></v-divider>

              <v-row class="task-props">
                <v-col cols="12" class="item-detail">
                  <p class="item-title">Massnahme:</p>
                  <p class="item-desc">
                    {{ taskData ? taskData.workType : null }}
                  </p>
                </v-col>
                <v-col cols="3" class="item-detail">
                  <p class="item-title">Intervall:</p>
                  <p class="item-desc">
                    {{ taskData ? taskData.interval : null }}
                  </p>
                </v-col>
                <v-col cols="3" class="item-detail">
                  <p class="item-title">Spez.Std:</p>
                  <p class="item-desc">
                    {{ taskData ? taskData.specialHours : null }}
                  </p>
                </v-col>
                <v-col cols="3" class="item-detail">
                  <p class="item-title">Bp1.Std:</p>
                  <p class="item-desc">
                    {{ taskData ? taskData.normalHours : null }}
                  </p>
                </v-col>
                <v-col cols="3" class="item-detail">
                  <p class="item-title">Mat.Fr.:</p>
                  <p class="item-desc">
                    {{ taskData ? taskData.material : null }}
                  </p>
                </v-col>

                <v-col cols="12" class="item-detail">
                  <p class="item-title">Info</p>
                  <p class="item-desc">
                    {{ taskData ? taskData.info : null }}
                  </p>
                </v-col>
              </v-row>

              <v-divider class="custom-divider mt-0"></v-divider>

              <v-row class="task-props">
                <v-col cols="12" class="item-detail">
                  <p class="block-title">
                    {{
                      taskData.isFinished
                        ? "Abgeschlossen von"
                        : "Als erledigt markieren"
                    }}
                  </p>
                </v-col>

                <v-col cols="6" class="item-detail">
                  <p class="item-title">Datum</p>
                  <v-menu
                    ref="menudate"
                    v-model="menudate"
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
                        hide-details
                        ref="datefield"
                        :rules="requiredRule"
                        :disabled="taskData.isFinished == true"
                        v-on="on"
                        class="custom-datepicker"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="finishDate" no-title>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menudate = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menudate.save(finishDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="6" class="item-detail">
                  <p class="item-title">Visum:</p>

                  <div
                    class="choose-user"
                    v-if="
                      taskData.isFinished == false && selectedUsers.length == 0
                    "
                  >
                    <span class="icon" @click="showPopupFunction"
                      ><v-icon>mdi mdi-plus</v-icon></span
                    >
                    <span class="text">Auswählen</span>
                  </div>

                  <div
                    class="users"
                    v-if="
                      taskData.isFinished == true ||
                        selectedUsers.length > 0 ||
                        (freelancerName && freelancerLastname)
                    "
                  >
                    <div
                      class="user"
                      v-for="user in selectedUsers"
                      :key="user.id"
                    >
                      <p class="user-name">
                        <span class="initials">
                          {{ getInitials(user.firstName, user.lastName) }}
                        </span>
                        {{ user.firstName }} {{ user.lastName }}
                      </p>

                      <span
                        class="remove-user"
                        v-if="taskData.isFinished == false"
                      >
                        <v-icon @click="removeUser(user)">mdi mdi-close</v-icon>
                      </span>
                    </div>

                    <div
                      class="user"
                      v-show="
                        freelancerName !== null && freelancerLastname !== null
                      "
                    >
                      <p class="user-name">
                        <span class="initials">
                          {{ getInitials(freelancerName, freelancerLastname) }}
                        </span>
                        {{ freelancerName }} {{ freelancerLastname }}
                      </p>

                      <span
                        class="remove-user"
                        v-if="taskData.isFinished == false"
                      >
                        <v-icon @click="removeFrelancer()"
                          >mdi mdi-close</v-icon
                        >
                      </span>
                    </div>
                  </div>

                  <div
                    class="new-user"
                    v-if="
                      taskData.isFinished == false && selectedUsers.length > 0
                    "
                  >
                    <span class="icon"><v-icon>mdi mdi-plus</v-icon></span>
                    <span class="text" @click="showPopupFunction"
                      >Neue visum</span
                    >
                  </div>
                </v-col>

                <v-col cols="12" class="item-detail">
                  <p class="item-title">Info:</p>
                  <v-textarea
                    outlined
                    auto-grow
                    :counter="maxCharacters"
                    :rules="[rule]"
                    name="infoTextarea"
                    v-model="finishInfo"
                    ref="infoTextarea"
                    :disabled="taskData.isFinished"
                  ></v-textarea>
                </v-col>

                <v-col cols="12" v-if="taskData.isFinished == false">
                  <v-btn
                    size="x-large"
                    height="54px"
                    color="#1db954"
                    class="submit-btn"
                    @click="submitFunction"
                  >
                    Einreichen
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          <v-col cols="5">
            <div class="map">
             <TreeMap :regions="mapRegions" :coordinates="inventarCoordinates" :fromViewTree="viewTree" :treeId="treeId" :areaId="areaId" :isTree="isTree" :treeCoordinates="getTreeCoordinates" :from="fromWhere" :taskId="taskId" :year="year"/>
            </div>
          </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>

    <div class="popup" v-show="showPopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="this.closePopupFunction"
          >mdi mdi-close</v-icon
        >
        <p class="title">Auswählen</p>

        <div class="user-list" v-if="inventarTaskUsers.length > 0">
          <div class="user" v-for="user in inventarTaskUsers" :key="user.id">
            <p class="user-name">
              <span class="initials">
                {{ getInitials(user.firstName, user.lastName) }}
              </span>
              {{ user.fullName }}
            </p>

            <span class="pp-add-remove-user">
              <span class="remove" v-if="userExists(user)">
                <v-icon @click="removeUser(user)">mdi mdi-close</v-icon>
              </span>
              <span class="add" v-else>
                <v-icon @click="addUser(user)">mdi mdi-plus</v-icon>
              </span>
            </span>
          </div>
        </div>

        <div class="freelancer" @click="this.showFrelancerInputs">
          <span class="text">Mitarbeiter hinzufügen:</span>
          <span class="arrow">
            <v-icon v-if="freelancerInputs">mdi mdi-chevron-up</v-icon>
            <v-icon v-else>mdi mdi-chevron-down</v-icon>
          </span>
        </div>

        <div class="freelancer-inputs" v-show="freelancerInputs">
          <v-row>
            <v-col cols="4">
              <p class="custom-label">Vorname</p>
              <v-text-field
                value=""
                outlined
                hide-details
                v-model="freelancerName"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <p class="custom-label">Nachname</p>
              <v-text-field
                value=""
                outlined
                hide-details
                v-model="freelancerLastname"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <p class="custom-label">Initialen</p>
              <v-text-field
                value=""
                outlined
                hide-details
                v-model="freelancerInitials"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <div class="popup-submit">
          <v-row>
            <v-col cols="6">
              <v-btn
                block
                size="x-large"
                height="54px"
                class="pp-cancel-btn"
                @click="this.closePopupFunction"
              >
                Abbrechen
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                size="x-large"
                height="54px"
                color="#1db954"
                class="pp-submit-btn"
                @click="ppSubmit"
              >
                Einreichen
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>

    <v-alert
      type="success"
      dismissible
      elevation="20"
      v-show="showAlert"
      class="alert"
      @input="onAlertClose"
    >
      {{ hasError ? "There was an error" : "Successfully closed task" }}
    </v-alert>

    <CustomLoader v-show="isLoading" />
  </div>
</template>

<script>
import TreeMap from './map/TreeMap.vue';
import moment from "moment";
import { mapGetters } from "vuex";
import axios from "axios";
import CustomLoader from "../../../components/custom_components/CustomLoader.vue"

export default {
  components: {
    CustomLoader,
    TreeMap
  },
  data() {
    return {
      isLoading: true,
      hasError: false,
      menudate: false,
      showAlert: false,
      canEdit: false,
      year: null,
      finishDate: "",
      taskData: [],
      mapRegions:[],
      taskId: null,
      maxCharacters: 300,
      showPopup: false,
      freelancerInputs: false,
      freelancerName: null,
      freelancerLastname: null,
      freelancerInitials: null,
      inventarTaskUsers: [],
      selectedUsers: [],
      isTree:true,
      treeId:null,
      areaId:null,
      viewTree:true,
      info: "",
      finishInfo: "",
      fromWhere:'TaskProfile',
      requiredRule: [v => !!v || "This field is required"],
      getTreeCoordinates:null
    
    };
  },
  computed: {
    ...mapGetters(["inventarId","inventarCoordinates","getTreeId","getAreaId","getIsTree"]),

    dateToShow() {
      return this.finishDate
        ? moment(this.finishDate).format("DD-MM-YYYY")
        : "";
    },

    rule() {
      return v => {
        if (!v || v.length <= this.maxCharacters) {
          return true;
        }
        return "Message is too long";
      };
    }
  },
  mounted() {
    this.taskId = this.$route.params.taskId;
    this.year = this.$route.params.year;
    this.canEdit = this.$route.params.canEdit;

    this.fetchTaskData();
    this.fetchInventarTaskUsers();
    this.fetchMapRegionTrees();
  },
  methods: {
      fetchMapRegionTrees() {
            axios
                .get(`https://tilia.rrota.org/api/Tasks/MapRegion/${this.inventarId}/${this.year}`)
                .then((response) => {
                    // Handle the response from the server
                    const res = response.data;
                    let taskTree = res.find(tree => tree.id == this.taskId);

                    this.getTreeCoordinates = [taskTree.latitude, taskTree.longitude]


                    this.mapRegions = res

                })
                .catch((error) => {
                    console.log(error);
                });
        },
    async fetchTaskData() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Tasks/Get/${this.inventarId}/${this.taskId}/${this.year}`
        );

        console.log("specifictask: ", response.data);
        
        this.taskData = response.data;
        this.treeId = response.data.treeId;
        // this.areaId = response.data.areaId;
        this.finishDate = this.taskData.finishDate
          ? this.taskData.finishDate
          : null;

        this.finishInfo = this.taskData.finishInfo;
        this.info = this.taskData.info;
        this.selectedUsers = this.taskData.tasksFinishedUsers;

        this.freelancerName = this.taskData.freelanceName;
        this.freelancerLastname = this.taskData.freelanceLastName;

        console.log("rote",this.$route.params);

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchInventarTaskUsers() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Tasks/TaskUsers/${this.inventarId}`
        );

        // console.log("inventarTaskUsers", response.data);

        this.inventarTaskUsers = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    /* function that provides initials and handles if name or surname has spaces */
    getInitials(name, surname) {
      let nameInitials = "";
      if (name) {
        nameInitials = name
          .split(" ")
          .map(n => n.charAt(0))
          .join("");
      }
      let surnameInitials = "";
      if (surname) {
        surnameInitials = surname
          .split(" ")
          .map(n => n.charAt(0))
          .join("");
      }
      return (nameInitials + surnameInitials).toUpperCase() || "";
    },

    showPopupFunction() {
      this.showPopup = true;
    },

    closePopupFunction() {
      this.showPopup = false;

      // this.freelancerName = null;
      // this.freelancerLastname = null;
      // this.freelancerInitials = null;
      // if (this.taskData.isFinished) {
      //   return;
      // } else {
      //   this.selectedUsers = [];
      // }
    },

    showFrelancerInputs() {
      this.freelancerInputs = !this.freelancerInputs;
    },

    submitFunction() {
      this.$refs.form.validate();
      if (
        this.$refs.infoTextarea.validate() &&
        this.$refs.datefield.validate() &&
        this.finishDate !== null &&
        this.selectedUsers.length > 0
      ) {
        this.finishTask();
      }
    },

    async finishTask() {
      this.isLoading = true;
      try {
        // console.log("taskID: ", this.taskId);
        // console.log("finishDate: ", this.finishDate);
        // console.log(
        //   "finishDate: ",
        //   moment(this.finishDate).format("YYYY-MM-DDTHH:mm:ss")
        // );
        // console.log("finishInfo: ", this.finishInfo);
        // console.log("info: ", this.info);
        // console.log("freelancerLastname: ", this.freelancerLastname);
        // console.log("freelancerName: ", this.freelancerName);
        // console.log(
        //   "userId's: ",
        //   this.selectedUsers.map(obj => ({ userId: obj.id }))
        // );

        const response = await axios.post(
          "https://tilia.rrota.org/api/Tasks/Finish",
          {
            taskId: this.taskId,
            finishDate: moment(this.finishDate).format("YYYY-MM-DDTHH:mm:ss"),
            info: this.finishInfo,
            firstName: this.freelancerName,
            lastName: this.freelancerLastname,
            tasksFinishedUsers: this.selectedUsers.map(obj => ({
              userId: obj.id
            }))
          }
        );

        if (response.status === 200) {
          // console.log("finishtaskResponse: ", response);
          this.isLoading = false;
          this.showAlert = true;
        }
      } catch (error) {
        this.isLoading = false;
        this.hasError = true;
        console.log(error);
      }
    },

    userExists(user) {
      return this.selectedUsers.find(f => f.id === user.id) !== undefined;
    },

    addUser(user) {
      this.selectedUsers.push(user);

      const date = new Date();
      this.finishDate = moment(date).format("YYYY-MM-DD");
    },
    removeUser(user) {
      const index = this.selectedUsers.findIndex(f => f.id === user.id);
      if (index !== -1) {
        this.selectedUsers.splice(index, 1);
      }
    },

    removeFrelancer() {
      this.freelancerName = null;
      this.freelancerLastname = null;
      this.freelancerInitials = null;
    },

    ppSubmit() {
      this.showPopup = false;
    },

    editMethod(id) {
      console.log(id);
      this.$router.push({
        name: "Pflegemassnahme bearbeiten",
        params: { taskId: id, year: this.year }
      });
    },

    onAlertClose() {
      this.$router.push({
        name: "Pflegeplan"
      });
    }
  }
};
</script>

<style scoped lang="scss">
.alert {
  position: fixed;
  width: 100%;
  max-width: 684px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 100px;
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
    width: 660px;
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

    .user-list {
      width: 100%;
      height: 270px;
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

      .user {
        margin-top: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 15px;
        border-bottom: 1px solid #494949;
        padding-right: 20px;

        .user-name {
          text-transform: capitalize;
          display: flex;
          align-items: center;
          margin-bottom: 0;

          .initials {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #494949;
            padding: 8px;
            border-radius: 100%;
            margin-right: 10px;
            text-transform: uppercase;
            font-size: 10px;
            font-weight: 500;
            color: #1db954;
            width: 36px;
            height: 36px;
          }
        }

        .pp-add-remove-user {
          cursor: pointer;

          span {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px dashed #fff;
            border-radius: 100%;
            width: 32px;
            height: 32px;

            &.remove {
              border: solid red;
              background-color: red;

              .v-icon {
                color: #fff;
              }
            }

            .v-icon {
              color: #fff;

              &:focus {
                &::after {
                  opacity: 0;
                }
              }
            }
          }
        }
      }
    }

    .freelancer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 20px;
      margin-top: 40px;
      padding-bottom: 15px;
      border-bottom: 1px solid #494949;
      margin-bottom: 15px;

      .text {
        display: block;
        font-size: 16px;
        line-height: 24px;
      }
    }

    .freelancer-inputs {
      padding-bottom: 30px;
      border-bottom: 1px solid #494949;
    }

    .popup-submit {
      margin-top: 40px;
      .pp-submit-btn {
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
      }
    }
  }
}

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
  align-self: flex-end;
  justify-self: flex-end;
  margin-left: auto;
}

.custom-buttons-holder {
  .first-row {
    .duplify,
    .edit {
      align-items: flex-end;
      justify-content: flex-end;
    }
  }
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.custom-divider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.task-info {
  padding-bottom: 30px;
}

.left-side {
  padding-right: 100px;

  .task-heading {
    display: flex;
    align-items: flex-start;
    padding-top: 15px;

    .avatar-color {
      display: block;
      border-radius: 100%;
      width: 80px;
      height: 80px;
      margin-right: 30px;

      &.green {
        background-color: green;
      }

      &.yellow {
        background-color: yellow;
      }

      &.red {
        background-color: red;
      }
    }

    .title-details {
      .title {
        font-size: 25px;
        line-height: 35px;
        font-weight: 500;
        margin-bottom: 0;
        margin-bottom: 5px;
      }

      .extra-info {
        font-size: 18px;
        line-height: 27px;
        margin-bottom: 5px;
        font-weight: 400;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .task-props {
    .item-detail {
      margin-bottom: 50px;

      .block-title {
        font-size: 25px;
        line-height: 35px;
        font-weight: 500;
        margin-top: 30px;
        margin-bottom: 5px;
      }

      .item-title {
        font-size: 18px;
        line-height: 21px;
        letter-spacing: 0.001em;
        font-weight: 500;
        margin-bottom: 10px;
      }

      .item-desc {
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 0;
      }

      .custom-datepicker {
        max-width: 240px;
      }

      .choose-user {
        display: flex;
        align-items: center;
        height: 56px;
        padding-bottom: 20px;
        border-bottom: 1px solid #494949;

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #fff;
          width: 32px;
          height: 32px;
          margin-right: 15px;
          border-radius: 100%;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            border-color: #1db954;
            transition: all 0.2s;

            .v-icon {
              color: #1db954;
            }
          }
        }

        .text {
          display: block;
          font-size: 14px;
          line-height: 21px;
        }
      }

      .users {
        padding-bottom: 15px;
        border-bottom: 1px solid #494949;
      }

      .user {
        margin-top: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .user-name {
          text-transform: capitalize;
          display: flex;
          align-items: center;
          margin-bottom: 0;

          .initials {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #494949;
            padding: 8px;
            border-radius: 100%;
            margin-right: 10px;
            text-transform: uppercase;
            font-size: 10px;
            font-weight: 500;
            color: #1db954;
            width: 36px;
            height: 36px;
          }
        }

        .remove-user {
          cursor: pointer;

          .v-icon {
            color: #1db954;
          }
        }
      }

      .new-user {
        display: flex;
        align-items: center;
        margin-top: 15px;
        cursor: pointer;

        .icon {
          display: block;
          margin-right: 10px;

          .v-icon {
            color: #1db954;
          }
        }

        .text {
          display: block;
          font-size: 16px;
          line-height: 24px;
          text-decoration: underline;
        }
      }
    }
  }

  .map {
      height: 550px;
  }
}
</style>
