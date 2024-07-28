<template>
  <div>
    <v-card class="custom-buttons-holder">
      <v-container fluid>
        <v-row justify="end">
          <v-col cols="8">
            <v-row class="first-row">
              <v-col cols="3">
                <a href="#" class="print">
                    <img class="custom-map-area-icon" src="../../../assets/images/icons/printer-outline.svg" /> 
                  <span>Karte Drucken</span>
                </a>
              </v-col>
              <v-col cols="3">
                <a href="#" class="edit" :class="{ disabled: isEditDisabled }">
                  <img class="custom-map-area-icon" src="../../../assets/images/icons/pencil-outline.svg" /> 
                  <span @click.prevent="editMethod(inventarId)"
                    >Bearbeiten</span
                  >
                </a>
              </v-col>
              <v-col cols="4">
                <v-btn
                  block
                  size="x-large"
                  height="54px"
                  color="#1db954"
                  class="download-btn"
                  @click.prevent="DawnloadInventar"
                >
                  <v-icon>mdi mdi-tray-arrow-down</v-icon>
                  Inventar herunterladen
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="second-row">
              <v-col cols="4">
                <v-select
                  v-model="selectedYear"
                  :items="orderedYears"
                  outlined
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card :loading="isLoading">
      <div v-if="hasError == false">
        <v-card class="general-card general-info-card">
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 class="custom-title">Inventar Info</h1>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="info-holder">
                  <div class="info-item">
                    <p class="column-title">Total Bäume</p>
                    <p>
                      <span class="mdi mdi-tree-outline"></span>
                      {{ inventarInfo ? inventarInfo.totalTrees : null }}
                    </p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">ProjektNr</p>
                    <p>
                      {{ inventarInfo ? inventarInfo.projectNumber : null }}
                    </p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Verantwortlicher</p>

                    <template v-if="inventarInfo !== null">
                      <div
                        class="acc-name-duration"
                        v-for="(acc, index) in inventarInfo.responsible"
                        :key="index"
                      >
                        <p class="acc-name">
                          <span class="initials">
                            {{ getInitials(acc.fullName) }}
                          </span>
                          {{ acc.fullName }}
                        </p>
                      </div>
                    </template>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Spez. Std</p>
                    <p>{{ inventarInfo ? inventarInfo.normalHours : null }}</p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Bp1.Std</p>
                    <p>{{ inventarInfo ? inventarInfo.extraHours : null }}</p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Mat. Fr.</p>
                    <p>{{ inventarInfo ? inventarInfo.material : null }}</p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Bearbeitung</p>

                    <template v-if="inventarInfo !== null">
                      <div
                        class="acc-name-duration"
                        v-for="(acc, index) in inventarInfo.editor"
                        :key="index"
                      >
                        <p class="acc-name">
                          <span class="initials">
                            {{ getInitials(acc.fullName) }}
                          </span>
                          {{ acc.fullName }}
                        </p>
                      </div>
                    </template>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Read Only</p>

                    <template v-if="inventarInfo !== null">
                      <div
                        class="acc-name-duration"
                        v-for="(acc, index) in readOnlyAccounts"
                        :key="index"
                      >
                        <p class="acc-name">
                          <span class="initials">
                            {{ getInitials(acc.firstName, acc.lastName) }}
                          </span>
                          {{ acc.firstName }} {{ acc.lastName }}
                        </p>
                        <p class="duration">
                          Note: {{ durationInDays(acc.readOnlyExpire) }}
                        </p>
                      </div>
                    </template>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Read/Write</p>

                    <template v-if="inventarInfo !== null">
                      <div
                        class="acc-name-duration"
                        v-for="(acc, index) in readAndWriteAccounts"
                        :key="index"
                      >
                        <p class="acc-name">
                          <span class="initials">
                            {{ getInitials(acc.firstName, acc.lastName) }}
                          </span>
                          {{ acc.firstName }} {{ acc.lastName }}
                        </p>
                        <p class="duration">
                          Note: {{ durationInDays(acc.readAndWriteExpire) }}
                          <br />
                          Area: {{ acc.area }}
                        </p>
                      </div>
                    </template>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="general-card owner-info">
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 class="custom-title">Adressen Verwalten</h1>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="info-holder">
                  <div class="info-item">
                    <p class="column-title">KundenLogin</p>

                    <template v-if="inventarInfo !== null">
                      <div class="acc-name-duration">
                        <p class="acc-name">
                          <span class="initials">
                            {{
                              getInitials(
                                inventarInfo
                                  ? inventarInfo.inventoryOwner.firstName
                                  : null,
                                inventarInfo
                                  ? inventarInfo.inventoryOwner.lastName
                                  : null
                              )
                            }}
                          </span>
                          {{
                            inventarInfo
                              ? inventarInfo.inventoryOwner.firstName
                              : null
                          }}
                          {{
                            inventarInfo
                              ? inventarInfo.inventoryOwner.lastName
                              : null
                          }}
                        </p>
                      </div>
                    </template>
                  </div>

                  <div class="info-item">
                    <p class="column-title">KundenNr</p>
                    <p>
                      {{
                        inventarInfo
                          ? inventarInfo.inventoryOwner.userNumber
                          : null
                      }}
                    </p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Email</p>
                    <p>
                      {{
                        inventarInfo ? inventarInfo.inventoryOwner.email : null
                      }}
                    </p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Telefon</p>
                    <p>
                      {{
                        inventarInfo
                          ? inventarInfo.inventoryOwner.phoneNumber
                          : null
                      }}
                    </p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Adresse</p>
                    <p>asdasdasdasd</p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Plz</p>
                    <p>asdasdasdasd</p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Ort</p>
                    <p>asdasdasdasd</p>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Architekt</p>

                    <div class="acc-name-duration">
                      <p class="acc-name">
                        <span class="initials">
                          {{
                            getInitials(
                              inventarInfo
                                ? inventarInfo.inventoryOwner.architect
                                : null
                            )
                          }}
                        </span>
                        {{
                          inventarInfo
                            ? inventarInfo.inventoryOwner.architect
                            : null
                        }}
                      </p>
                    </div>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Gärtner vor Ort</p>
                    <div class="acc-name-duration">
                      <p class="acc-name">
                        <span class="initials">
                          {{
                            getInitials(
                              inventarInfo
                                ? inventarInfo.inventoryOwner.gardener
                                : null
                            )
                          }}
                        </span>
                        {{
                          inventarInfo
                            ? inventarInfo.inventoryOwner.gardener
                            : null
                        }}
                      </p>
                    </div>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Holzabfuhr</p>

                    <div class="acc-name-duration">
                      <p class="acc-name">
                        <span class="initials">
                          {{
                            getInitials(
                              inventarInfo
                                ? inventarInfo.inventoryOwner.woodRemoval
                                : null
                            )
                          }}
                        </span>
                        {{
                          inventarInfo
                            ? inventarInfo.inventoryOwner.woodRemoval
                            : null
                        }}
                      </p>
                    </div>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Info</p>
                    <p>
                      {{
                        inventarInfo
                          ? inventarInfo.inventoryOwner.description
                          : null
                      }}
                    </p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="general-card documents-info">
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 class="custom-title">Dokumente</h1>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="info-holder">
                  <div class="info-item">
                    <p class="column-title">Offerte</p>

                    <div
                      class="documents"
                      v-if="
                        inventarInfo && inventarInfo.inventoryOfferDocuments
                      "
                    >
                      <a
                        :href="doc.document"
                        class="doc"
                        v-for="doc in inventarInfo.inventoryOfferDocuments"
                        :key="doc.id"
                        target="_blank"
                        download
                        >{{ doc.fileName || "Herunterladen" }}
                        <span class="mdi mdi-file-outline"></span>
                      </a>
                    </div>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Auftragsbestätigung</p>

                    <div
                      class="documents"
                      v-if="
                        inventarInfo && inventarInfo.inventoryOrderDocuments
                      "
                    >
                      <a
                        :href="doc.document"
                        class="doc"
                        v-for="doc in inventarInfo.inventoryOrderDocuments"
                        :key="doc.id"
                        target="_blank"
                        download
                        >{{ doc.fileName || "Herunterladen" }}
                        <span class="mdi mdi-file-outline"></span>
                      </a>
                    </div>
                  </div>

                  <div class="info-item">
                    <p class="column-title">Rechnungen</p>

                    <div
                      class="documents"
                      v-if="
                        inventarInfo && inventarInfo.inventoryInvoiceDocuments
                      "
                    >
                      <a
                        :href="doc.document"
                        class="doc"
                        v-for="doc in inventarInfo.inventoryInvoiceDocuments"
                        :key="doc.id"
                        target="_blank"
                        download
                        >{{ doc.fileName || "Herunterladen" }}
                        <span class="mdi mdi-file-outline"></span>
                      </a>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import { eventBus } from "../../../main";

export default {
  data() {
    return {
      isLoading: true,
      hasError: false,
      inventarId: this.$route.query.id,
      inventarInfo: null,
      readOnlyAccounts: null,
      readAndWriteAccounts: null,
      years: [],
      selectedYear: 2023,
      isEditDisabled: false,
      userCanEdit: false,
      userCanView: false,
      userCanDelete: false,
      tableData:null
    };
  },
  watch: {
    selectedYear() {
      this.fetchInventarInfo();
    }
  },
  computed: {
    orderedYears() {
      return this.years.slice().reverse();
    }
  },
  mounted() {
    this.selectedYear = this.$route.params.year || 2023;
    this.fetchYears(), this.fetchInventarInfo();
  },
  methods: {
    ...mapActions([
      "updateInventarId",
      "updateSelectedYear",
      "updateInventarCoordinates",
      "fetchTreeTableData"
    ]),
    async DawnloadInventar(){
      this.updateInventarId(this.inventarId);
      this.updateSelectedYear(this.selectedYear);
      await this.fetchTrees();


    },
    async fetchTrees() {
      eventBus.$emit("onTableFilter");
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Tree/GetAll/${this.inventarId}?`
        );

        /* check if there are data */
        if (Object.keys(response.data).length > 0) {
          this.tableData = response.data;
          this.fetchTreeTableData(this.tableData)
          /* change user privileges */
          this.userCanDelete = response.data.access.canDelete;
          this.userCanEdit = response.data.access.canEdit;
          this.userCanView = response.data.access.canView;
        }
          console.log("tableData",this.tableData);
        this.isloading = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },
        createParamString() {
      const params = [];
      var invetoryIdd = "";

      if (this.inventoryId !== null && this.inventoryId !== undefined) {
        invetoryIdd = this.inventoryId + "?";
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
    async fetchInventarInfo() {
      try {
        const response = await axios.get(
          "https://tilia.rrota.org/api/Inventory/Get/" +
            this.inventarId +
            "/" +
            this.selectedYear
        );
        // console.log("inventarInfo", response.data);
        this.inventarInfo = response.data;

        this.findReadOnlyAcc();
        this.findReadAndWriteAcc();
        this.isLoading = false;

        if (this.inventarInfo.isLocked === true) {
          this.isEditDisabled = true;
        }
      } catch (error) {
        console.log(error);
        this.hasError = true;
        this.isLoading = false;
      }
    },

    findReadOnlyAcc() {
      const rOAcc = this.inventarInfo.inventoryAccess;
      if (rOAcc) {
        this.readOnlyAccounts = rOAcc.filter(c => c.readOnly === true);
      }
    },

    findReadAndWriteAcc() {
      const rAwAcc = this.inventarInfo.inventoryAccess;
      if (rAwAcc) {
        this.readAndWriteAccounts = rAwAcc.filter(c => c.readAndWrite === true);
      }
    },

    durationInDays(dateTime) {
      let now = moment();
      let expiration = moment(dateTime);
      let duration = null;
      let calculatedDuration = 0;

      if (expiration > now) {
        duration = expiration.subtract(1, "minutes").diff(now);

        calculatedDuration = Math.ceil(duration / (1000 * 60 * 60 * 24));
      }

      /* return calculated duration in days */
      return calculatedDuration > 0 ? calculatedDuration + " days" : "expired";
    },

    async fetchYears() {
      try {
        const response = await axios.get(
          "https://tilia.rrota.org/api/Inventory/GetYears"
        );
        // console.log("years", response.data);
        this.years = response.data;
        this.isLoading = false;
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

    editMethod(id) {
      this.$router.push({
        name: "Inventar bearbeiten",
        params: { id: id, year: this.selectedYear }
      });
    }
  }
};
</script>

<style lang="scss">
.general-card {
  background-color: transparent !important;
  box-shadow: none;
  margin-bottom: 50px;
}
.custom-title {
  margin-bottom: 0;
  border-bottom: 1px solid #fff;
  padding-top: 10px;
  padding-bottom: 15px;
}
.info-holder {
  display: flex;
  flex-wrap: wrap;
  row-gap: 40px;
  padding-top: 15px;
  padding-bottom: 10px;

  .info-item {
    width: 20%;
    padding-right: 10px;

    p {
      margin-bottom: 5px;
      font-size: 16px;
      line-height: 18px;
      font-weight: 400;
      letter-spacing: 0.1px;

      &.column-title {
        font-size: 18px;
        line-height: 21px;
        font-weight: 500;
      }
    }

    .doc {
      display: flex;
      align-items: center;
      max-width: 80%;
      margin-bottom: 20px;
      position: relative;
      border: 1px solid #494949;
      margin-top: 20px;
      color: #fff;
      transition: all 0.2s;
      font-size: 14px;
      line-height: 21px;

      &:hover {
        color: #1db954;
        border-color: #1db954;
        transition: all 0.2s;
      }

      &:last-child {
        margin-bottom: 0;
      }
      padding-left: 10px;
      padding-top: 8px;
      padding-bottom: 8px;
      padding-right: 10px;

      span {
        font-size: 13px;
        margin-left: auto;
      }
    }

    .acc-name-duration {
      margin-top: 10px;

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
  }
}
.custom-map-area-icon{
  margin-right: 8px;
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
