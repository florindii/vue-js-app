<template>
  <div>
    <v-row :class="viewOnly ? 'view-only' : ''">
      <v-col cols="6" class="form-element-holder">
        <div>
          <div class="fields one-line">
            <p class="custom-label">Hauptgabelung:</p>
            <v-checkbox
              v-model="treeExaminationCrownBase.harmonious"
              hide-details
              label="harmonisch/gut verwachsen"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationCrownBase.vBifurcation"
              hide-details
              label="V-Gabelung"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationCrownBase.ingrownBark"
              hide-details
              label="mit eingewachsener Rinde"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row :class="viewOnly ? 'view-only' : ''">
      <v-col cols="6" class="form-element-holder">
        <div>
          <div class="fields one-line">
            <v-checkbox
              v-model="treeExaminationCrownBase.secured"
              hide-details
              label="gesichert"
              class="custom-checkbox"
            ></v-checkbox>
            <v-select
              v-if="treeExaminationCrownBase.secured"
              v-model="treeExaminationCrownBase.throughCutId"
              :items="directionItems"
              item-text="name"
              item-value="value"
              outlined
              hide-details
              clearable
            >
              <v-icon slot="append" color="white">
                mdi-chevron-down
              </v-icon>
            </v-select>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationCrownBase.damagedAreas"
              hide-details
              label="Schadstellen"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- from here are new -->
    <v-row>
      <v-col cols="12">
        <!-- nested expansion panel below -->
        <v-expansion-panels>
          <v-expansion-panel class="nested-accordion">
            <v-expansion-panel-header>
              Beschreibung der Schadstellen
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row :class="viewOnly ? 'view-only' : ''">
                <v-col cols="3" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrownBase.necrosis"
                        hide-details
                        label="Nekrose"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col cols="3" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrownBase.wound"
                        hide-details
                        label="Wunde"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col cols="3" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrownBase.crack"
                        hide-details
                        label="Riss"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col cols="3" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrownBase.fungalFruitingBody"
                        hide-details
                        label="Pilzfruchtkörper"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col cols="3" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrownBase.drillHole"
                        hide-details
                        label="Frassgang/Bohrloch"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <!-- necrose -->
              <v-row
                class="root-damage"
                v-show="treeExaminationCrownBase.necrosis"
                v-for="(item, index) in necroseDamage"
                :key="'necrosis' + index"
                :class="viewOnly ? 'view-only' : ''"
              >
                <v-col cols="12" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-title">
                        {{ index + 1 }}. Nekrose:
                        <a
                          href="#"
                          v-if="necroseDamage.length > 1"
                          class="remove-root-dmg"
                          @click.prevent="deleteNecroseDmgContainer(index)"
                          ><span class="mdi mdi-close"></span
                        ></a>
                      </p>
                    </div>
                  </div>
                </v-col>
                <v-col cols="2" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Richtung:</p>

                      <v-autocomplete
                        v-model="item.inputs.selectedDirection"
                        :items="directionItems"
                        outlined
                        hide-details
                        item-text="name"
                        item-value="value"
                        small-chips
                        clearable
                      >
                        <v-icon slot="append" color="white">
                          mdi-chevron-down
                        </v-icon>
                        <template #selection="{ item }">
                          <v-chip color="green" small>{{ item.name }}</v-chip>
                        </template>
                      </v-autocomplete>
                    </div>
                  </div>
                </v-col>

                <v-col cols="2" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Höhe:</p>

                      <v-text-field
                        v-model="item.inputs.DmgHeight"
                        type="text"
                        outlined
                        clearable
                        hide-details
                        append-outer-icon="cm"
                        class="number-input"
                      ></v-text-field>
                    </div>
                  </div>
                </v-col>

                <v-col cols="2" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Länge:</p>

                      <v-text-field
                        v-model="item.inputs.DmgLength"
                        type="text"
                        outlined
                        clearable
                        hide-details
                        append-outer-icon="cm"
                        class="number-input"
                      ></v-text-field>
                    </div>
                  </div>
                </v-col>

                <v-col cols="2" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Breite:</p>

                      <v-text-field
                        v-model="item.inputs.DmgBroad"
                        type="text"
                        outlined
                        clearable
                        hide-details
                        append-outer-icon="cm"
                        class="number-input"
                      ></v-text-field>
                    </div>
                  </div>
                </v-col>

                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Beschreibung:</p>

                      <v-text-field
                        v-model="item.inputs.DmgDescription"
                        type="text"
                        outlined
                        clearable
                        hide-details
                      ></v-text-field>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-divider></v-divider>
                  <a
                    href="#"
                    class="add-new"
                    @click.prevent="cloneNewNecroseDmg(index)"
                  >
                    <span class="mdi mdi-plus-thick custom-add-icon"></span
                    ><span>Add New</span>
                  </a>
                </v-col>
              </v-row>

              <!-- riss - crack  -->
              <v-row
                class="root-damage"
                v-show="treeExaminationCrownBase.crack"
                v-for="(item, index) in crackDamage"
                :key="'crack' + index"
                :class="viewOnly ? 'view-only' : ''"
              >
                <v-col cols="12" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-title">
                        {{ index + 1 }}. Riss:
                        <a
                          href="#"
                          v-if="crackDamage.length > 1"
                          class="remove-root-dmg"
                          @click.prevent="deleteCrackDmgContainer(index)"
                          ><span class="mdi mdi-close"></span
                        ></a>
                      </p>
                    </div>
                  </div>
                </v-col>
                <v-col cols="2" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Richtung:</p>

                      <v-select
                        v-model="item.inputs.selectedDirection"
                        :items="directionItems"
                        outlined
                        hide-details
                        item-text="name"
                        item-value="value"
                        small-chips
                        clearable
                      >
                        <v-icon slot="append" color="white">
                          mdi-chevron-down
                        </v-icon>
                        <template #selection="{ item }">
                          <v-chip color="green" small>{{ item.name }}</v-chip>
                        </template>
                      </v-select>
                    </div>
                  </div>
                </v-col>

                <v-col cols="2" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Höhe:</p>

                      <v-text-field
                        v-model="item.inputs.DmgHeight"
                        type="text"
                        outlined
                        clearable
                        hide-details
                        append-outer-icon="cm"
                        class="number-input"
                      ></v-text-field>
                    </div>
                  </div>
                </v-col>

                <v-col cols="2" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Länge:</p>

                      <v-text-field
                        v-model="item.inputs.DmgLength"
                        type="text"
                        outlined
                        clearable
                        hide-details
                        append-outer-icon="cm"
                        class="number-input"
                      ></v-text-field>
                    </div>
                  </div>
                </v-col>

                <v-col cols="2" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Breite:</p>

                      <v-text-field
                        v-model="item.inputs.DmgBroad"
                        type="text"
                        outlined
                        clearable
                        hide-details
                        append-outer-icon="cm"
                        class="number-input"
                      ></v-text-field>
                    </div>
                  </div>
                </v-col>

                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Beschreibung:</p>

                      <v-text-field
                        v-model="item.inputs.DmgDescription"
                        type="text"
                        outlined
                        clearable
                        hide-details
                      ></v-text-field>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-divider></v-divider>
                  <a
                    href="#"
                    class="add-new"
                    @click.prevent="cloneNewCrackDmg(index)"
                  >
                    <span class="mdi mdi-plus-thick custom-add-icon"></span
                    ><span>Add New</span>
                  </a>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Pathogene:</p>

                      <v-autocomplete
                        v-model="treeExaminationCrownBase.beetleId"
                        :items="beetleItems"
                        item-text="name"
                        item-value="id"
                        outlined
                        clearable
                        multiple
                        small-chips
                        hint="Note: lorem ipsum"
                        persistent-hint
                      >
                        <v-icon slot="append" color="white">
                          mdi-chevron-down
                        </v-icon>
                        <template #selection="{ item }">
                          <v-chip color="green" small>{{ item.name }}</v-chip>
                        </template>
                      </v-autocomplete>
                    </div>
                  </div>
                </v-col>

                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Parasiten:</p>

                      <v-autocomplete
                        v-model="treeExaminationCrownBase.parasitId"
                        :items="parasitItems"
                        item-text="germanName"
                        item-value="id"
                        outlined
                        clearable
                        multiple
                        small-chips
                        hint="Note: lorem ipsum"
                        persistent-hint
                      >
                        <v-icon slot="append" color="white">
                          mdi-chevron-down
                        </v-icon>
                        <template #selection="{ item }">
                          <v-chip color="green" small>{{
                            item.germanName
                          }}</v-chip>
                        </template>
                      </v-autocomplete>
                    </div>
                  </div>
                </v-col>

                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Parasiten:</p>

                      <v-autocomplete
                        v-model="treeExaminationCrownBase.mushroomTypeId"
                        :items="mushroomItems"
                        item-text="germanName"
                        item-value="id"
                        outlined
                        clearable
                        multiple
                        small-chips
                        hint="Note: lorem ipsum"
                        persistent-hint
                      >
                        <v-icon slot="append" color="white">
                          mdi-chevron-down
                        </v-icon>
                        <template #selection="{ item }">
                          <v-chip color="green" small>{{
                            item.abbreviation
                          }}</v-chip>
                        </template>
                      </v-autocomplete>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-row :class="viewOnly ? 'view-only' : ''">
                <v-col cols="12" class="form-element-holder">
                  <div>
                    <p class="custom-label">Bemerkungen:</p>

                    <div class="fields">
                      <v-textarea
                        outlined
                        auto-grow
                        :counter="maxCharacters"
                        v-model="treeExaminationCrownBase.remarks"
                      ></v-textarea>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-row :class="viewOnly ? 'view-only' : ''">
                <v-col cols="12">
                  <p class="custom-heading">
                    Ausprägung Wundrand:
                  </p>
                </v-col>

                <v-col cols="3" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrownBase.good"
                        hide-details
                        label="gut"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col cols="3" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrownBase.diffuse"
                        hide-details
                        label="diffus"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col cols="3" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrownBase.noReaction"
                        hide-details
                        label="keine Reaktion"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col cols="3" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrownBase.dyingBack"
                        hide-details
                        label="zurücksterbend"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-row :class="viewOnly ? 'view-only' : ''">
                <v-col cols="4" class="form-element-holder">
                  <div>
                    <p class="custom-label">Beschreibung:</p>

                    <div class="fields">
                      <v-textarea
                        outlined
                        auto-grow
                        :counter="maxCharacters"
                        v-model="treeExaminationCrownBase.description"
                      ></v-textarea>
                    </div>
                  </div>
                </v-col>

                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrownBase.unchanged"
                        hide-details
                        label="unverändert"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col cols="4" class="form-element-holder">
                  <div>
                    <p class="custom-label">Veränderung:</p>

                    <div class="fields">
                      <v-textarea
                        outlined
                        auto-grow
                        :counter="maxCharacters"
                        v-model="treeExaminationCrownBase.change"
                      ></v-textarea>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-row :class="viewOnly ? 'view-only' : ''">
                <v-col cols="6" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Foto:</p>
                    </div>

                    <v-row
                      class="preview-images"
                      v-if="treeExaminationCrownBase.crownBaseImages.length > 0"
                    >
                      <v-col
                        cols="2"
                        v-for="(image,
                        index) in treeExaminationCrownBase.crownBaseImages"
                      >
                        <v-img
                          :src="getImageSrc(image)"
                          class="custom-preview-image"
                          cover
                          aspect-ratio="1"
                        >
                          <v-btn
                            class="remove-image-preview"
                            tile
                            width="20"
                            color="error"
                            @click="removeTrunkImage(index)"
                          >
                            <v-icon size="16">mdi mdi-close</v-icon>
                          </v-btn>
                        </v-img>
                        <p >{{ image.fileName }}</p>
                      </v-col>
                    </v-row>
                    <div class="upload-buttons">
                      <input
                      type="file"
                      accept="image/*"
                      capture="camera"
                      @change="handleFileChange"
                      ref="fileInput"
                      multiple
                      style="display: none;"
                    />
                    <div class="custom-file-input" @click="openFileInput">
                      <img
                        src="../../assets/images/icons/upload-gallery-image.svg"
                        alt="Upload Icon"
                        class="custom-upload-icon"
                      />
                    </div>
                      <input
                      type="file"
                      accept="image/*"
                      capture="camera"
                      @change="handleFileChange"
                      multiple
                      ref="fileInput"
                      style="display: none;"
                    />
                    <div class="custom-file-input" @click="openFileInput">
                      <img
                        src="../../assets/images/icons/upload-camera-image.svg"
                        alt="Upload Icon"
                        class="custom-upload-icon"
                      />
                    </div>
                  </div>
                  </div>
                </v-col> 
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import axios from "axios";
import DamageAreaTypes from "@/consts/damageAreaTypes";
import DirectionTypes from "@/consts/directionTypes";
export default {
  props: ["initialData", "viewOnly"],
  data() {
    return {
      maxCharacters: 150,
      accordionOpen: [],
      hasClass: false,
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
        crownBaseImages: []
      },
      directionItems: DirectionTypes,

      necroseDamage: [
        {
          inputs: {
            selectedDirection: null,
            DmgHeight: null,
            DmgLength: null,
            DmgBroad: null,
            DmgDescription: null
          },
          classes: [
            {
              class: "root-damage"
            }
          ],
          isDuplicatedWith: null
        }
      ],

      crackDamage: [
        {
          inputs: {
            selectedDirection: null,
            DmgHeight: null,
            DmgLength: null,
            DmgBroad: null,
            DmgDescription: null
          },
          classes: [
            {
              class: "root-damage"
            }
          ],
          isDuplicatedWith: null
        }
      ],
      selectedCrownBaseImages: [],
      beetleItems: [],
      parasitItems: [],
      mushroomItems: []
    };
  },
  watch: {
    object: {
      handler: function(val) {
        if (val) {
          this.$emit("fourthAccordion", val);
        }
      },
      deep: true
    },

    necroseDamage: {
      handler: function(newVal) {
        this.updateTrunkDamagedAreaNecrose(newVal);
      },
      deep: true
    },
    crackDamage: {
      handler: function(newVal) {
        this.updateTrunkDamagedAreaCrack(newVal);
      },
      deep: true
    },
    "treeExaminationCrownBase.necrosis": function(newValue, oldValue) {
      if (newValue === false) {
        /* remove all necroseDamage items except index 0 */
        this.necroseDamage = this.necroseDamage.slice(0, 1);

        /* reset it */
        this.necroseDamage[0].inputs = {
          selectedDirection: null,
          DmgHeight: null,
          DmgLength: null,
          DmgBroad: null,
          DmgDescription: null
        };

        /* reset original object to empty array using nextTick */
        this.$nextTick(() => {
          this.treeExaminationCrownBase.crownBaseNecrosisDamagedAreaDetails = [];
        });
      }
    },
    "treeExaminationCrownBase.crack": function(newValue, oldValue) {
      if (newValue === false) {
        /* remove all necroseDamage items except index 0 */
        this.crackDamage = this.crackDamage.slice(0, 1);

        /* reset it */
        this.crackDamage[0].inputs = {
          selectedDirection: null,
          DmgHeight: null,
          DmgLength: null,
          DmgBroad: null,
          DmgDescription: null
        };

        /* reset original object to empty array using nextTick */
        this.$nextTick(() => {
          this.treeExaminationCrownBase.crownBaseCrackDamagedAreaDetails = [];
        });
      }
    }
  },
  computed: {
    object() {
      return this.treeExaminationCrownBase;
    }
  },
  mounted() {
    this.fetchBeetleOptions();
    this.fetchParasitOptions();
    this.fetchMushroomOptions();

    // console.log("initialDataFourthAccordion: ", this.initialData);

    this.treeExaminationCrownBase = { ...this.initialData };

    /* prepopulate crackDamage if there are on initial data */
    if (
      this.treeExaminationCrownBase.crownBaseCrackDamagedAreaDetails.length > 0
    ) {
      /* make it empty then popullate */
      this.crackDamage = [];
      this.treeExaminationCrownBase.crownBaseCrackDamagedAreaDetails.forEach(
        (element, index) => {
          const newItem = {
            inputs: {
              selectedDirection: element.directionTypeId,
              DmgHeight: element.height,
              DmgLength: element.length,
              DmgBroad: element.width,
              DmgDescription: element.description
            },
            classes: [
              {
                class: "root-damage"
              }
            ],
            isDuplicatedWith: null
          };

          this.crackDamage.push(newItem);
        }
      );
    }

    /* prepopulate necroseDamage if there are on initial data */
    if (
      this.treeExaminationCrownBase.crownBaseNecrosisDamagedAreaDetails.length >
      0
    ) {
      /* make it empty then popullate */
      this.necroseDamage = [];
      this.treeExaminationCrownBase.crownBaseNecrosisDamagedAreaDetails.forEach(
        (element, index) => {
          const newItem = {
            inputs: {
              selectedDirection: element.directionTypeId,
              DmgHeight: element.height,
              DmgLength: element.length,
              DmgBroad: element.width,
              DmgDescription: element.description
            },
            classes: [
              {
                class: "root-damage"
              }
            ],
            isDuplicatedWith: null
          };

          this.necroseDamage.push(newItem);
        }
      );
    }
  },
  methods: {
    deleteNecroseDmgContainer(index) {
      this.necroseDamage = this.necroseDamage.filter((item, i) => i !== index);
    },

    deleteCrackDmgContainer(index) {
      this.crackDamage = this.crackDamage.filter((item, i) => i !== index);
    },

    cloneNewNecroseDmg(index) {
      console.log("addNewIndex", index);

      /* populate trunkBaseDamagedAreaDetails */

      const newNecroseDmg = {
        damagedAreaTypeId: DamageAreaTypes.CrownBase_Necrosis,
        directionTypeId: this.necroseDamage[index].inputs.selectedDirection,
        height: this.necroseDamage[index].inputs.DmgHeight,
        length: this.necroseDamage[index].inputs.DmgLength,
        width: this.necroseDamage[index].inputs.DmgBroad,
        description: this.necroseDamage[index].inputs.DmgDescription
      };

      this.treeExaminationCrownBase.crownBaseNecrosisDamagedAreaDetails.push(
        newNecroseDmg
      );

      this.necroseDamage.splice(index + 1, 0, {
        inputs: {
          selectedDirection: null,
          DmgHeight: null,
          DmgLength: null,
          DmgBroad: null,
          DmgDescription: null
        },
        classes: [
          {
            class: "root-damage"
          }
        ],
        isDuplicatedWith: null
      });
    },

    cloneNewCrackDmg(index) {
      console.log("addNewIndex", index);

      /* populate trunkBaseDamagedAreaDetails */

      const newCrackDmg = {
        damagedAreaTypeId: DamageAreaTypes.CrownBase_Crack,
        directionTypeId: this.crackDamage[index].inputs.selectedDirection,
        height: this.crackDamage[index].inputs.DmgHeight,
        length: this.crackDamage[index].inputs.DmgLength,
        width: this.crackDamage[index].inputs.DmgBroad,
        description: this.crackDamage[index].inputs.DmgDescription
      };

      this.treeExaminationCrownBase.crownBaseCrackDamagedAreaDetails.push(
        newCrackDmg
      );

      this.crackDamage.splice(index + 1, 0, {
        inputs: {
          selectedDirection: null,
          DmgHeight: null,
          DmgLength: null,
          DmgBroad: null,
          DmgDescription: null
        },
        classes: [
          {
            class: "root-damage"
          }
        ],
        isDuplicatedWith: null
      });
    },

    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          const base64String = e.target.result.split(",")[1]; // Extract the base64 string
          const fileData = {
            document: base64String,
            nameBase64: base64String,
            fileName: file.name,
            fileExtension: file.name.split(".").pop()
          };

          this.treeExaminationCrownBase.crownBaseImages.push(fileData);
        };
      }

      this.selectedRootDamageImages = []; // Clear the selected files after uploading
    },

    removeTrunkImage(index) {
      this.treeExaminationCrownBase.crownBaseImages.splice(index, 1);
      this.selectedCrownBaseImages = [];
    },

    updateTrunkDamagedAreaNecrose(necroseDamage) {
      /* this function prepares data on trunkBaseDamagedAreaDetails handles removing of item aswell */
      this.treeExaminationCrownBase.crownBaseNecrosisDamagedAreaDetails = necroseDamage.map(
        item => {
          return {
            damagedAreaTypeId: DamageAreaTypes.CrownBase_Necrosis,
            directionTypeId: item.inputs.selectedDirection,
            height: item.inputs.DmgHeight,
            length: item.inputs.DmgLength,
            width: item.inputs.DmgBroad,
            description: item.inputs.DmgDescription
          };
        }
      );
    },

    updateTrunkDamagedAreaCrack(crackDamage) {
      this.treeExaminationCrownBase.crownBaseCrackDamagedAreaDetails = crackDamage.map(
        item => {
          return {
            damagedAreaTypeId: DamageAreaTypes.CrownBase_Crack,
            directionTypeId: item.inputs.selectedDirection,
            height: item.inputs.DmgHeight,
            length: item.inputs.DmgLength,
            width: item.inputs.DmgBroad,
            description: item.inputs.DmgDescription
          };
        }
      );
    },
    async fetchBeetleOptions() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Beetle/GetAll`
        );

        // console.log("beetle", response.data);

        this.beetleItems = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchParasitOptions() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Parasit/GetAll`
        );

        // console.log("parasits", response.data);

        this.parasitItems = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchMushroomOptions() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/MushroomType/GetAll`
        );

        // console.log("mushrooms", response.data);

        this.mushroomItems = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    getImageSrc(image) {
      if(image.nameBase64 != null){
         return  `data:image/${image.fileName};base64,${image.nameBase64}`;
      }
      else{
         return `data:image/${image.fileName};base64,${image.document}`;
      }
    }
  }
};
</script>
<style></style>
