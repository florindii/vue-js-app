<template>
  <div class="wrapper">
    <v-container fluid>
      <v-form ref="createBaumkontrollForm">
        <div class="custom-buttons-holder">
          <v-row justify="end" class="first-row">
            <v-col
              cols="4"
              v-show="
                viewOnly === false && isSealed === false && isEditBK === true
              "
            >
              <a href="#" class="edit" @click="showSealPopup = true">
                <span class="mdi mdi-lock-outline seal-icon"></span
                ><span>Baumkontrolle versiegeln</span>
              </a>
            </v-col>
            <v-col cols="4">
              <v-btn
                block
                size="x-large"
                height="54px"
                color="#1db954"
                class="new-btn"
              >
                <v-icon>mdi mdi-plus-thick</v-icon>
                neu mit gleichen Parametern
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-row class="intro-info" :class="viewOnly ? 'view-only' : ''">
          <v-col cols="3" class="item-detail">
            <p class="item-title">Aufnahme Durch:</p>

            <div
              class="choose-user"
              :class="usersRed ? 'red-border' : ''"
              v-if="baumKontrollData.treeExaminationUsers.length == 0"
            >
              <span
                class="icon"
                :class="usersRed ? 'red' : ''"
                @click="showPopupFunction"
                ><v-icon>mdi mdi-plus</v-icon></span
              >
              <span class="text">Auswählen</span>
            </div>

            <div
              class="users"
              v-if="
                baumKontrollData.treeExaminationUsers.length > 0 ||
                  (baumKontrollData.freelanceFirstName &&
                    baumKontrollData.freelanceLastName)
              "
            >
              <div
                class="user"
                v-for="user in baumKontrollData.treeExaminationUsers"
                :key="user.id"
              >
                <p class="user-name">
                  <span class="initials">
                    {{ getInitials(user.firstName, user.lastName) }}
                  </span>
                  {{ user.firstName }} {{ user.lastName }}
                </p>

                <span class="remove-user">
                  <v-icon @click="removeUser(user)">mdi mdi-close</v-icon>
                </span>
              </div>

              <div
                class="user"
                v-show="
                  baumKontrollData.freelanceFirstName !== null &&
                    baumKontrollData.freelanceLastName !== null
                "
              >
                <p class="user-name">
                  <span class="initials">
                    {{
                      getInitials(
                        baumKontrollData.freelanceFirstName,
                        baumKontrollData.freelanceLastName
                      )
                    }}
                  </span>
                  {{ baumKontrollData.freelanceFirstName }}
                  {{ baumKontrollData.freelanceLastName }}
                </p>

                <span class="remove-user">
                  <v-icon @click="removeFrelancer()">mdi mdi-close</v-icon>
                </span>
              </div>
            </div>

            <div
              class="new-user"
              v-if="baumKontrollData.treeExaminationUsers.length > 0"
            >
              <span class="icon"><v-icon>mdi mdi-plus</v-icon></span>
              <span class="text" @click="showPopupFunction">Neue visum</span>
            </div>
          </v-col>

          <v-col cols="3" class="form-element-holder start">
            <div>
              <p class="custom-label">Erfassungsdatum:</p>

              <div class="fields">
                <v-menu
                  ref="acquisitionDate"
                  v-model="acquisitionDate"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="acquisitionDateToShow"
                      append-icon="mdi-calendar-blank-outline"
                      outlined
                      readonly
                      clearable
                      hide-details
                      v-on="on"
                      @click:clear="clearacquisitionDate()"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="baumKontrollData.acquisitionDate"
                    no-title
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="acquisitionDate = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="
                        $refs.acquisitionDate.save(
                          baumKontrollData.acquisitionDate
                        )
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
            </div>
          </v-col>

          <v-col cols="3" class="form-element-holder start">
            <div>
              <p class="custom-label">BaumArt:</p>

              <div class="fields">
                <v-text-field
                  v-model="baumArtValue"
                  outlined
                  readonly
                  disabled
                ></v-text-field>
              </div>
            </div>
          </v-col>

          <v-col cols="3" class="form-element-holder">
            <div>
              <div class="fields">
                <v-checkbox
                  v-model="baumKontrollData.protectedTree"
                  hide-details
                  label="Geschützter Baum"
                  class="custom-checkbox"
                ></v-checkbox>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row class="cards-holder" :class="viewOnly ? 'view-only' : ''">
          <v-col v-for="card in cards" :key="card.id" cols="3">
            <div
              :class="[
                'card',
                card.color,
                { 'card-selected': baumKontrollData.colorTypeId === card.id }
              ]"
              @click="selectCard(card.id)"
              class="card"
            >
              <h2 class="card-title">{{ card.title }}</h2>
              <p class="card-description">{{ card.description }}</p>
            </div>
          </v-col>
        </v-row>

        <v-row class="expansion-panels">
          <v-col cols="12">
            <v-expansion-panels>
              <!-- expansion pannel 1 below -->
              <v-expansion-panel>
                
                <v-expansion-panel-header>
                <div class="d-flex align-center">
                <img class="custom-image mr-7 ml-7" src="../../../assets/images/icons/wurzelraum.svg"/>
                  Wurzelraum
                </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <!-- here goes rootSpaceAccordion component -->
                  <RootSpaceAccordion
                    v-on:firstAccordion="firstAccordionData"
                    :initialData="baumKontrollData.treeExaminationRootSpace"
                    :viewOnly="viewOnly"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- expansion pannel 2 below -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <div class="d-flex align-center">
                   <img class="custom-image mr-7 ml-7" src="../../../assets/images/icons/stammbasis.svg"/>
                  Stammbasis
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <TrunkBaseAccordion
                    v-on:secondAccordion="secondAccordionData"
                    :initialData="baumKontrollData.treeExaminationTrunkBase"
                    :viewOnly="viewOnly"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- expansion pannel 3 below -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <div class="d-flex align-center">
                   <img class="custom-image mr-7 ml-7" src="../../../assets/images/icons/stamm.svg"/>
                  Stamm
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <!-- here goes fourthAccordion component -->
                  <TrunkAccordion
                    v-on:thirdAccordion="thirdAccordionData"
                    :initialData="baumKontrollData.treeExaminationTrunk"
                    :viewOnly="viewOnly"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- expansion pannel 4 below -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <div class="d-flex align-center">
                   <img class="custom-image mr-7 ml-7" src="../../../assets/images/icons/kronenansatz.svg"/>
                  Kronenansatz
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <!-- here goes trunkAccordion component -->
                  <CrownBaseAccordion
                    v-on:fourthAccordion="fourthAccordionData"
                    :initialData="baumKontrollData.treeExaminationCrownBase"
                    :viewOnly="viewOnly"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- expansion pannel 5 below -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <div class="d-flex align-center">
                   <img class="custom-image mr-7 ml-7" src="../../../assets/images/icons/krone.svg"/>
                  Krone
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <!-- here goes rootSpaceAccordion component -->
                  <CrownAccordion
                    v-on:kroneAccordion="kroneAccordionData"
                    :initialData="baumKontrollData.treeExaminationCrown"
                    :viewOnly="viewOnly"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>

        <v-row v-show="!viewOnly">
          <v-col cols="12" class="form-element-holder">
            <div class="buttons">
              <v-btn
                size="x-large"
                height="54px"
                class="cancel-btn"
                @click="showCancelPopup = true"
              >
                Abbrechen
              </v-btn>

              <v-btn
                size="x-large"
                height="54px"
                color="#1db954"
                class="submit-btn"
                @click="submitBtnClicked"
              >
                Einreichen
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-container>

    <div class="popup" v-show="showUsersPopup">
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
                v-model="baumKontrollData.freelanceFirstName"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <p class="custom-label">Nachname</p>
              <v-text-field
                value=""
                outlined
                hide-details
                v-model="baumKontrollData.freelanceLastName"
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
                @click="showUsersPopup = false"
              >
                Einreichen
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>

    <div class="cancel-popup" v-show="showCancelPopup" ref="cancelPopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="neinClickHandler"
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
            @click="neinClickHandler"
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

    <div class="seal-popup" v-show="showSealPopup" ref="sealPopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="cancelSealHandler"
          >mdi mdi-close</v-icon
        >

        <p class="title">Versiegeln</p>

        <div class="description-holder">
          <v-icon color="#C82210" class="popup-icon"
            >mdi mdi-lock-outline</v-icon
          >

          <p class="description">
            Dieser Vorgang kann nicht rückgängig gemacht werden
          </p>
        </div>

        <div class="buttons">
          <v-btn
            size="x-large"
            height="54px"
            class="cancel-btn"
            @click="cancelSealHandler"
          >
            Abbrechen
          </v-btn>

          <v-btn
            size="x-large"
            height="54px"
            color="#c82210"
            class="delete-btn"
            @click="sealBaumkontroll"
          >
            Versiegeln
          </v-btn>
        </div>
      </div>
    </div>

    <div class="create-popup" v-show="showCreatePopup" ref="createPopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="neinClickHandler"
          >mdi mdi-close</v-icon
        >

        <p class="title">Neu Baumkontrollen</p>

        <div class="description-holder">
          <p class="description">
            Sind Sie sicher, dass Sie die Baumkontrolle retten wollen?
          </p>
        </div>

        <div class="buttons">
          <v-btn
            size="x-large"
            height="54px"
            class="cancel-btn"
            @click="neinClickHandler"
          >
            Abbrechen
          </v-btn>

          <v-btn
            size="x-large"
            height="54px"
            class="submit-btn"
            @click.prevent="submitFunction"
          >
            Versiegeln
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
      @input="createAlertHandler"
    >
      {{
        hasError ? "There was an error" : "Successfully created baumkontroll"
      }}
    </v-alert>

    <v-alert
      :type="hasError ? 'error' : 'success'"
      dismissible
      elevation="20"
      v-show="showSealAlert"
      class="alert"
      @input="sealAlertHandler"
    >
      {{ hasError ? "There was an error" : "Successfully sealed baumkontroll" }}
    </v-alert>

    <CustomLoader v-show="isLoading" />
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import axios from "axios";
import DamageAreaTypes from "@/consts/damageAreaTypes";
import ColorTypes from "@/consts/colorTypes";
import RootSpaceAccordion from "../../../components/custom_components/RootSpaceAccordion.vue";
import TrunkBaseAccordion from "../../../components/custom_components/TrunkBaseAccordion.vue";
import CrownAccordion from "../../../components/custom_components/CrownAccordion.vue";
import TrunkAccordion from "../../../components/custom_components/TrunkAccordion.vue";
import CrownBaseAccordion from "../../../components/custom_components/CrownBaseAccordion.vue";
import CustomLoader from "../../../components/custom_components/CustomLoader.vue";

export default {
  /* Check if the next route is already set or if navigation is explicitly allowed */
  /* allowNavigate is when we create and want to redirect without showing popup */
  beforeRouteLeave(to, from, next) {
    if (this.nextRoute || this.viewOnly || this.allowNavigate) {
      next();
    } else {
      this.nextRoute = to;
      this.showCancelPopup = true;
    }
  },
  data() {
    return {
      isEditBK: false,
      viewOnly: false,
      isSealed: false,

      /* this makes plus icon red if no users */
      usersRed: false,

      nextRoute: null,
      allowNavigate: false,

      treeExaminationId: 0,
      cards: [
        {
          id: ColorTypes.Green,
          title: "Grün",
          description:
            "Der Baum ist gesund und hat statisch ausreichende Reserven. Er hat bei fachgerechter Pflege und Kontrolle gute Zukunftschancen.",
          color: "custom-green"
        },
        {
          id: ColorTypes.Yellow,
          title: "Gelb",
          description:
            "Die Zukunft des Baumes muss besprochen und entschieden werden. Zum Erhalt braucht es zusätzliche Massnahmen oder eingehende Untersuchungen.",
          color: "custom-yellow"
        },
        {
          id: ColorTypes.Red,
          title: "Schrecklich",
          description:
            "Der Baum ist nicht ausreichend sicher. Seine Sicherheit lässt sich mit vernünftigem Aufwand nicht wiederherstellen. Der Baum muss gefällt werden.",
          color: "custom-red"
        },
        {
          id: ColorTypes.Blue,
          title: "Schlecht",
          description:
            "Ökobaum: Der Baum bietet Lebensräume für andere Lebewesen an. Eine Gefährdung für Verkehrsflächen wird durch geeignete Massnahmen ausgeschlossen.",
          color: "custom-blue"
        }
      ],
      maxCharacters: 150,
      showCancelPopup: false,
      showSealPopup: false,
      showSealAlert: false,
      showCreatePopup: false,

      isLoading: false,
      hasError: false,
      showAlert: false,
      acquisitionDate: false,
      inventarTaskUsers: [],
      showUsersPopup: false,
      freelancerInputs: false,
      freelancerInitials: null,
      treeId: null,
      baumArt: [],
      baumArtValue: null,

      baumKontrollData: {
        id: 0,
        taskId: null,
        acquisitionDate: null,
        protectedTree: false,
        colorTypeId: 2,
        freelanceFirstName: null,
        freelanceLastName: null,
        treeExaminationUsers: [],
        treeExaminationRootSpace: {
          suspectedRootDamage: false,
          suspicionCaneRot: false,
          trunkEdgeDistance: 0,
          damagedTrunkEdgeDistance: 0,
          floorRemoval: false,
          floorSealing: false,
          silting: false,
          floorCompaction: false,
          waterlogging: false,
          floorApplication: false,
          waterShortage: false,
          roadSaltSuspicion: false,
          floorCrack: false,
          visibleRootsNearSurface: false,
          otherSubstanceInputsId: [],
          mushroomTypeId: [],
          directionTypeId: [],
          impairment: "",
          constructionSite: false,
          date: null,
          info: "",
          rootSpaceDamagedAreaDetails: [],
          rootSpaceImages: [ {
            nameBase64: null,
            fileExtension: null
          }],
        },
       

        /* second accordion below */
        treeExaminationTrunkBase: {
          wellFormed: false,
          thin: false,
          stickShoots: false,
          leak: false,
          damagedArea: false,
          necrosis: false,
          wound: false,
          crack: false,
          fungalFruitingBody: false,
          drillHole: false,
          beetleId: [],
          parasitId: [],
          mushroomTypeId: [],
          remarks: "",
          good: false,
          diffuse: false,
          noReaction: false,
          dyingBack: false,
          description: "",
          unchanged: false,
          change: "",
          trunkBaseNecrosisDamagedAreaDetails: [],
          trunkBaseCrackDamagedAreaDetails: [],
          trunkBaseImages: [ {
            nameBase64: null,
            fileExtension: null
          }],
        },

        /* third accordion below */
        treeExaminationTrunk: {
          directionTypeId: 0,
          graftingPoint: false,
          skew: false,
          skewValue: 0,
          inclinationMeasurement: false,
          inclinationMeasurementValue: 0,
          height: 0,
          wellGrown: false,
          ingrownBark: false,
          info: "",
          inharmonious: false,
          stemShoots: false,
          rotationalGrowth: false,
          leaks: false,
          damagedAreas: false,

          /* from here are new */
          necrosis: false,
          wound: false,
          crack: false,
          fungalFruitingBody: false,
          drillHole: false,
          beetleId: [],
          parasitId: [],
          mushroomTypeId: [],
          remarks: "",
          good: false,
          diffuse: false,
          noReaction: false,
          dyingBack: false,
          description: "",
          unchanged: false,
          change: "",
          trunkNecrosisDamagedAreaDetails: [],
          trunkCrackDamagedAreaDetails: [],
          trunkImages: [ {
            nameBase64: null,
            fileExtension: null
          }],
        },

        /* fourth accordion below */
        treeExaminationCrownBase: {
          harmonious: false,
          vBifurcation: false,
          ingrownBark: false,
          // withCrack: false,
          secured: false,
          throughCutId: 0,
          damagedAreas: false,

          /* from here are new */
          necrosis: false,
          wound: false,
          crack: false,
          fungalFruitingBody: false,
          drillHole: false,
          beetleId: [],
          parasitId: [],
          mushroomTypeId: [],
          remarks: "",
          good: false,
          diffuse: false,
          noReaction: false,
          dyingBack: false,
          description: "",
          unchanged: false,
          change: "",
          crownBaseNecrosisDamagedAreaDetails: [],
          crownBaseCrackDamagedAreaDetails: [],
          crownBaseImages: [ {
            nameBase64: null,
            fileExtension: null
          }],
        },

        /* fifth accordion below */
        treeExaminationCrown: {
          locationId: 0,
          majorWounds: 0,
          hollows: 0,
          criticalForks: 0,
          crownAnchorage: 0,
          rigid: 0,
          branchFractures: 0,
          deadBranches: 0,
          peripheral: 0,
          secondaryDriveShare: 0,
          shootGrowthLength: 0,
          prematureLeafFall: 0,
          defoliation: 0,
          discoloration: false,
          branchByBranch: 0,
          crownLength: 0,
          secondaryCrown: false,
          healthId: 0,
          injury: 0,
          roadSafetyId: 0,
          habitatTree: false,
          beetlesId: [],
          insectsId: [],
          birdId: [],
          mammalsId: [],

          /* new from here */
          necrosis: false,
          wound: false,
          crack: false,
          fungalFruitingBody: false,
          drillHole: false,
          beetleId: [],
          parasitId: [],
          mushroomTypeId: [],
          remarks: "",
          good: false,
          diffuse: false,
          noReaction: false,
          dyingBack: false,
          description: "",
          unchanged: false,
          change: "",
          crownNecrosisDamagedAreaDetails: [],
          crownCrackDamagedAreaDetails: [],
          crownImages: [ {
            nameBase64: null,
            fileExtension: null
          }],
        }
      },

      selectedRootDamageImages: [],
      previewRootDamageImagesList: []
    };
  },
  components: {
    RootSpaceAccordion,
    TrunkAccordion,
    CrownBaseAccordion,
    TrunkBaseAccordion,
    CrownAccordion,
    CustomLoader
  },
  watch: {},
  computed: {
    ...mapGetters(["inventarId"]),

    acquisitionDateToShow() {
      return this.baumKontrollData.acquisitionDate !== null
        ? moment(this.baumKontrollData.acquisitionDate).format("DD-MM-YYYY")
        : null;
    }
  },
  mounted() {
    this.treeId = this.$route.params.treeId;
    this.baumKontrollData.taskId = this.$route.params.taskId;
    this.treeExaminationId = this.$route.params.treeExaminationId;
    this.isEditBK = this.$route.params.isEditBK;
    this.viewOnly = this.$route.params.viewOnly;
    this.isSealed = this.$route.params.isSealed;

    this.fetchInventarTaskUsers();
    this.fetchBaumArt();

    if (this.isEditBK === true) {
      /* fetchEditData */
      this.fetchEditData();
    } else {
      /* fetchCreateData */
      this.fetchCreateData();
    }
  },
  methods: {
    cancelSealHandler() {
      this.allowNavigate = true;
      this.showSealPopup = false;
      this.redirectToTasks();
    },
    sealAlertHandler() {
      this.allowNavigate = true;
      this.showSealAlert = false;
      this.redirectToTasks();
    },
    createAlertHandler() {
      if (this.hasError) {
        this.allowNavigate = true;
        this.showAlert = false;
        this.redirectToTasks();
      } else {
        this.allowNavigate = true;
        this.showAlert = false;
        this.showSealPopup = true;
      }
    },
    neinClickHandler() {
      this.nextRoute = null;
      this.allowNavigate = false;
      this.showCancelPopup = false;

      this.showCreatePopup = false;
    },
    redirectToTasks() {
      if (this.nextRoute) {
        this.$router.push(this.nextRoute);
      } else {
        this.allowNavigate = true;

        this.$router.push({
          name: "Baumkontrolle"
        });
      }
    },

    submitBtnClicked() {
      if (this.baumKontrollData.treeExaminationUsers.length === 0) {
        this.usersRed = true;

        window.scrollTo({
          top: 0,
          behavior: "smooth" // This makes the scrolling smooth
        });
      } else {
        (this.usersRed = false), (this.showCreatePopup = true);
      }
    },

    async sealBaumkontroll() {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `https://tilia.rrota.org/api/Tasks/SealUnsealTask/${this.baumKontrollData.taskId}/true`
        );

        // console.log("sealBaumkontroll: ", response.data);

        if (response.status === 200) {
          this.showSealPopup = false;
          this.showSealAlert = true;
        }

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchCreateData() {
      /* this gets data if ever existed before for this baumkontroll */
      this.isLoading = true;
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/TreeExamination/GetCreateData/${this.baumKontrollData.taskId}/${this.treeId}`
        );

        // console.log("getCreateData", response.data);
        if (response.status === 200) {
          this.baumKontrollData.taskId = response.data.taskId;
          this.baumKontrollData.acquisitionDate = response.data.acquisitionDate;
          this.baumKontrollData.protectedTree = response.data.protectedTree;
          this.baumKontrollData.colorTypeId = response.data.colorTypeId;
          this.baumKontrollData.freelanceFirstName =
            response.data.freelanceFirstName;
          this.baumKontrollData.freelanceLastName =
            response.data.freelanceLastName;

          if (response.data.treeExaminationUsers.length > 0) {
            this.baumKontrollData.treeExaminationUsers = this.inventarTaskUsers.filter(
              user =>
                response.data.treeExaminationUsers.some(u => u.id === user.id)
            );
          } else {
            this.baumKontrollData.treeExaminationUsers = [];
          }

         this.baumKontrollData.treeExaminationRootSpace =
             response.data.treeExaminationRootSpace;

          this.baumKontrollData.treeExaminationTrunkBase =
            response.data.treeExaminationTrunkBase;

          this.baumKontrollData.treeExaminationTrunk =
            response.data.treeExaminationTrunk;

          this.baumKontrollData.treeExaminationCrownBase =
            response.data.treeExaminationCrownBase;

          this.baumKontrollData.treeExaminationCrown =
            response.data.treeExaminationCrown;
        }

        // console.log("baumkontroll after getData: ", this.baumKontrollData)

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchEditData() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/TreeExamination/Get/${this.treeExaminationId}`
        );

        console.log("getEditData", response.data);
        if (response.status === 200) {
          this.baumKontrollData.taskId = response.data.taskId;
          this.baumKontrollData.acquisitionDate = response.data.acquisitionDate;
          this.baumKontrollData.protectedTree = response.data.protectedTree;
          this.baumKontrollData.colorTypeId = response.data.colorTypeId;
          this.baumKontrollData.freelanceFirstName =
            response.data.freelanceFirstName;
          this.baumKontrollData.freelanceLastName =
            response.data.freelanceLastName;

          if (response.data.treeExaminationUsers.length > 0) {
            // console.log('heree');
            const taskUserVariable = this.inventarTaskUsers.filter(
              user =>
                response.data.treeExaminationUsers.some(u => u.id === user.id)
            );
            this.baumKontrollData.treeExaminationUsers = taskUserVariable;
          } else {
            // console.log('elseeee');
            this.baumKontrollData.treeExaminationUsers = [];
          }
       
          this.baumKontrollData.treeExaminationRootSpace =
          response.data.treeExaminationRootSpace;
       
          this.baumKontrollData.treeExaminationRootSpace.rootSpaceImages.forEach((image) => {
          image.nameBase64 = image.document;
          image.fileExtension = image.fileName.split('.').pop(); });

          this.baumKontrollData.treeExaminationTrunkBase =
          response.data.treeExaminationTrunkBase;

          this.baumKontrollData.treeExaminationTrunkBase.trunkBaseImages.forEach((image) => {
          image.nameBase64 = image.document;
          image.fileExtension = image.fileName.split('.').pop(); });

          this.baumKontrollData.treeExaminationTrunk =
            response.data.treeExaminationTrunk;

          this.baumKontrollData.treeExaminationTrunk.trunkImages.forEach((image) => {
          image.nameBase64 = image.document;
          image.fileExtension = image.fileName.split('.').pop(); });

          this.baumKontrollData.treeExaminationCrownBase =
          response.data.treeExaminationCrownBase;

          this.baumKontrollData.treeExaminationCrownBase.crownBaseImages.forEach((image) => {
          image.nameBase64 = image.document;
          image.fileExtension = image.fileName.split('.').pop(); });

          this.baumKontrollData.treeExaminationCrown =
          response.data.treeExaminationCrown;
            
          this.baumKontrollData.treeExaminationCrown.crownImages.forEach((image) => {
          image.nameBase64 = image.document;
          image.fileExtension = image.fileName.split('.').pop(); });
        }

        //console.log("baumkontroll after getData: ", this.baumKontrollData)

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    firstAccordionData(data, fotot) {
      this.baumKontrollData.treeExaminationRootSpace = data;

      // console.log("firstAccordionData from child", this.baumKontrollData);
      // console.log("fotott from firstaccordion", fotot);
    },
    secondAccordionData(data) {
      this.baumKontrollData.treeExaminationTrunkBase = data;

      // console.log("secondAccordionData from child", this.baumKontrollData);
    },

    thirdAccordionData(data) {
      this.baumKontrollData.treeExaminationTrunk = data;
    },

    fourthAccordionData(data) {
      this.baumKontrollData.treeExaminationCrownBase = data;
    },

    kroneAccordionData(data) {
      this.baumKontrollData.treeExaminationCrown = data;
      // console.log("kroneAccordion from child", this.baumKontrollData);
    },

    async fetchInventarTaskUsers() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Tasks/TaskUsers/${this.inventarId}`
        );

        console.log("inventarTaskUsers", response.data);

        this.inventarTaskUsers = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchBaumArt() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/TreeExamination/GetCreateData/${this.baumKontrollData.taskId}/${this.treeId}`
        );

        // console.log("baumArt", response.data);

        this.baumArt = response.data;

        this.baumArtValue = this.baumArt.treeTypeName;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    showPopupFunction() {
      this.showUsersPopup = true;
    },

    closePopupFunction() {
      this.showUsersPopup = false;

      this.baumKontrollData.freelanceFirstName = null;
      this.baumKontrollData.freelanceLastName = null;
      this.freelancerInitials = null;
      this.baumKontrollData.treeExaminationUsers = [];
    },

    userExists(user) {
      return (
        this.baumKontrollData.treeExaminationUsers.find(
          f => f.id === user.id
        ) !== undefined
      );
    },

    showFrelancerInputs() {
      this.freelancerInputs = !this.freelancerInputs;
    },

    addUser(user) {
      this.baumKontrollData.treeExaminationUsers.push(user);

      const date = new Date();
      this.baumKontrollData.acquisitionDate = moment(date).format("YYYY-MM-DD");
    },

    removeUser(user) {
      const index = this.baumKontrollData.treeExaminationUsers.findIndex(
        f => f.id === user.id
      );
      if (index !== -1) {
        this.baumKontrollData.treeExaminationUsers.splice(index, 1);
      }
    },

    removeFrelancer() {
      this.baumKontrollData.freelanceFirstName = null;
      this.baumKontrollData.freelanceLastName = null;
      this.freelancerInitials = null;
    },

    selectCard(cardId) {
      this.baumKontrollData.colorTypeId = cardId;
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

    clearacquisitionDate() {
      this.baumKontrollData.acquisitionDate = null;
    },

    async submitFunction() {
      // console.log("submiiit: ", this.baumKontrollData);

      if (this.isEditBK === true) {
        /* here we edit */
        this.baumKontrollData.id = this.treeExaminationId;
        this.isLoading = true;
        try {
          const response = await axios.put(
            "https://tilia.rrota.org/api/TreeExamination/Update",
            this.baumKontrollData
          );

          if (response.status === 200) {
            // console.log("createResponse: ", response);

            this.allowNavigate = true;
            this.isLoading = false;
            this.hasError = false;
            this.showCreatePopup = false;
            this.showAlert = true;
          }
        } catch (error) {
          console.log(error);
          this.isLoading = false;
          this.hasError = true;
          this.showAlert = true;
        }
      } else {
        /* here we create */
        this.baumKontrollData.id = 0;
        this.isLoading = true;
        try {
          const response = await axios.post(
            "https://tilia.rrota.org/api/TreeExamination/Create",
            this.baumKontrollData
          );

          if (response.status === 200) {
            // console.log("createResponse: ", response);

            this.allowNavigate = true;
            this.isLoading = false;
            this.hasError = false;
            this.showCreatePopup = false;
            this.showAlert = true;
          }
        } catch (error) {
          console.log(error);
          this.isLoading = false;
          this.hasError = true;
          this.showAlert = true;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.custom-image{
  height: 50px;
  width: 50px;
}
.view-only {
  opacity: 0.95;
  pointer-events: none !important;
}

.wrapper {
  padding-bottom: 50px;
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

.same-param-link {
  display: block;
  width: fit-content;
  margin-left: auto;
  color: #fff !important;
}

.separator {
  background-color: #fff;
}

.add-new {
  display: block;
  font-size: 16px;
  line-height: 24px;
  color: #fff !important;
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.2s;
  text-decoration: underline;
  margin-top: 15px;
  margin-bottom: 20px;

  &:hover {
    transition: all 0.2s;
    opacity: 0.9;
  }

  .custom-add-icon {
    font-size: 22px;
    margin-right: 8px;
    color: #1db954;
  }
}

.cards-holder {
  margin-bottom: 30px !important;
}

.intro-info {
  .intro-details {
    display: flex;
    align-items: flex-start;
    gap: 10px;

    .info-text {
      margin-bottom: 16px;
    }
  }

  .acc-name-duration {
    margin-top: 0;

    .acc-name {
      text-transform: capitalize;
      display: flex;
      align-items: center;

      .initials {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #494949;
        padding: 8px;
        border-radius: 100%;
        margin-right: 10px;
        margin-left: 10px;
        text-transform: uppercase;
        font-size: 10px;
        font-weight: 500;
        color: #1db954;
        width: 36px;
        height: 36px;
      }
    }

    .duration {
      margin-left: 46px;
    }
  }

  .item-detail {
    margin-bottom: 20px;

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
      margin-bottom: 16px;
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

      &.red-border {
        border-color: #c82210;
      }

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

.form-element-holder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 20px;

  &.start {
    justify-content: start !important;
  }

  &.end {
    justify-content: end !important;
  }

  .custom-label,
  label {
    font-size: 16px !important;
    line-height: 24px !important;
    color: #fff !important;
  }

  .custom-title {
    display: flex;
    font-size: 18px;
    line-height: 27px;
    font-weight: 500;
    padding-bottom: 5px;
    border-bottom: 1px solid #757575;
    margin-bottom: 20px;

    .remove-root-dmg {
      display: block;
      margin-left: auto;
    }
  }

  .fields {
    &.one-line {
      display: flex;
      align-items: center;
      gap: 10px;

      .custom-label {
        margin-bottom: 0;
      }
    }

    .number-input {
      input[type="text"] {
        text-align: center !important;
      }

      fieldset {
        border-right: 0;
        border-radius: 0;
        border-width: 1px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
    }

    .custom-checkbox {
      margin: 0;
    }

    .v-select__selections {
      min-height: 48px !important;
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    margin-top: 50px;
    padding-top: 30px;
    border-top: 1px solid #757575;
    margin-bottom: 100px;

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

.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
  padding: 25px;
  border: 2px solid #494949;
  border-radius: 5px;
  height: 100%;

  &.custom-green {
    .card-title {
      &::before {
        background-color: #1db954;
      }
    }
  }

  &.custom-yellow {
    .card-title {
      &::before {
        background-color: #fff500;
      }
    }
  }

  &.custom-red {
    .card-title {
      &::before {
        background-color: #c82210;
      }
    }
  }

  &.custom-blue {
    .card-title {
      &::before {
        background-color: #118afa;
      }
    }
  }

  &.card-selected {
    border-color: #1db954;
  }

  .card-title {
    display: block;
    position: relative;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 15px;
    padding-left: 45px;

    &::before {
      content: "";
      width: 35px;
      height: 35px;
      background-color: red;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 100%;
    }
  }

  .card-description {
    font-size: 14px;
    line-height: 21px;
    margin-bottom: 0;
    color: #757575;
  }
}

.expansion-panels {
  .v-expansion-panel {
    border: 1px solid #494949;
    border-radius: 6px !important;

    &.v-expansion-panel--active {
      border-color: #fff;
    }

    &.nested-accordion {
      margin-bottom: 30px;

      .v-expansion-panel-header {
        padding: 20px 24px;
        font-size: 16px;
        background-color: #494949;
      }
    }

    .v-expansion-panel-header {
      padding: 22px 24px;
      font-size: 25px;
      line-height: normal;
    }

    .v-expansion-panel-header--active {
      border-bottom: 1px solid #fff;
    }

    .v-expansion-panel-content__wrap {
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }

  .v-input__append-outer,
  .v-input__prepend-outer {
    margin: 0;
    background: #1db954;
    // padding: 16px;
    cursor: pointer;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;

    .v-input__icon {
      width: 56px;
      height: 56px;
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
      font-size: 14px;
    }
  }
}

.preview-images {
  .remove-image-preview {
    position: absolute;
    right: 0;
    top: 0;
    margin: 0 !important;
    padding: 0 !important;
    min-width: 20px !important;
    width: 20px !important;
    height: 20px !important;
  }
}

.custom-heading {
  font-size: 18px;
  line-height: 27px;
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

.cancel-popup,
.seal-popup,
.create-popup {
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
      flex-direction: column;
      justify-content: center;

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
