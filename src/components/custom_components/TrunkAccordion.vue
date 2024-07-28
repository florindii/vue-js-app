<template>
  <div>
    <v-row class="justify-space-between" :class="viewOnly ? 'view-only' : ''">
      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationTrunk.graftingPoint"
              hide-details
              @click="toggleAccordion()"
              label="Verdelungsstelle"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields one-line">
            <v-checkbox
              v-model="treeExaminationTrunk.skew"
              hide-details
              label="Schrägstand"
              class="custom-checkbox"
            >
            </v-checkbox>
            <v-text-field
              :disabled="isSkewValueDisabled"
              v-model="treeExaminationTrunk.skewValue"
              type="text"
              outlined
              clearable
              hide-details
              append-outer-icon="o"
              class="number-input"
              @input="handleInputChange($event, 'skewValue')"
            ></v-text-field>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <span
                  class="mdi mdi-information-symbol text-h4 cursor"
                  v-on="on"
                  size="large"
                ></span>
              </template>
              <span>2020:</span><br />
              <span>Schiefstand/Schrägstand: 30°</span><br />
              <span>2019:</span><br />
              <span>Schiefstand/Schrägstand: 25°</span><br />
              <span>2018:</span><br />
              <span>Schiefstand/Schrägstand: 20°</span><br />
            </v-tooltip>
          </div>
        </div>
      </v-col>
      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields one-line">
            <p class="custom-label">Richtung:</p>
            <v-autocomplete
              outlined
              hide-details
              v-model="treeExaminationTrunk.directionTypeId"
              :items="directionItems"
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
    </v-row>

    <v-row :class="viewOnly ? 'view-only' : ''">
      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields one-line">
            <v-checkbox
              v-model="treeExaminationTrunk.inclinationMeasurement"
              hide-details
              label="Neigungsmessung:"
              class="custom-checkbox"
            >
            </v-checkbox>
            <v-text-field
              :disabled="isMeaurmentValueDisabled"
              v-model="treeExaminationTrunk.inclinationMeasurementValue"
              type="text"
              outlined
              clearable
              hide-details
              append-outer-icon="cm"
              class="number-input"
              @input="handleInputChange($event, 'inclinationMeasurementValue')"
            >
            </v-text-field>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- nested expansion panel below -->
        <v-expansion-panels v-model="accordionOpen" multiple>
          <v-expansion-panel class="nested-accordion">
            <v-expansion-panel-header>
              Beschreibung der Verdelungsstelle
            </v-expansion-panel-header>
            <v-expansion-panel-content :class="viewOnly ? 'view-only' : ''">
              <v-row class="">
                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields one-line">
                      <p class="custom-label">Höhe:</p>
                      <v-text-field
                        v-model="treeExaminationTrunk.height"
                        type="text"
                        outlined
                        clearable
                        hide-details
                        append-outer-icon="m"
                        class="number-input"
                        @input="handleInputChange($event, 'height')"
                      ></v-text-field>
                    </div>
                  </div>
                </v-col>
                <v-col cols="4" class="form-element-holder align-center">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationTrunk.wellGrown"
                        hide-details
                        label="gut verwachsen"
                        class="custom-checkbox "
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>
                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationTrunk.ingrownBark"
                        hide-details
                        label="eingewachsene Rinde"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="form-element-holder">
                  <div>
                    <p class="custom-label">Info:</p>
                    <div class="fields">
                      <v-textarea
                        outlined
                        auto-grow
                        :counter="maxCharacters"
                        v-model="treeExaminationTrunk.info"
                      ></v-textarea>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    
    <v-row class="justify-space-between" :class="viewOnly ? 'view-only' : ''">
      <v-col cols="2" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationTrunk.inharmonious"
              hide-details
              label="unharmonisch"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
      <v-col cols="2" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationTrunk.stemShoots"
              hide-details
              label="Stammoustriebe"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
      <v-col cols="2" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationTrunk.rotationalGrowth"
              hide-details
              label="Drehwuchs"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
      <v-col cols="2" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationTrunk.leaks"
              hide-details
              label="Leckstellen"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
      <v-col cols="2" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationTrunk.damagedAreas"
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
                        v-model="treeExaminationTrunk.necrosis"
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
                        v-model="treeExaminationTrunk.wound"
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
                        v-model="treeExaminationTrunk.crack"
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
                        v-model="treeExaminationTrunk.fungalFruitingBody"
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
                        v-model="treeExaminationTrunk.drillHole"
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
                v-show="treeExaminationTrunk.necrosis"
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
                v-show="treeExaminationTrunk.crack"
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

              <v-row :class="viewOnly ? 'view-only' : ''">
                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-label">Pathogene:</p>

                      <v-autocomplete
                        v-model="treeExaminationTrunk.beetleId"
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
                        v-model="treeExaminationTrunk.parasitId"
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
                        v-model="treeExaminationTrunk.mushroomTypeId"
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
                        v-model="treeExaminationTrunk.remarks"
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
                        v-model="treeExaminationTrunk.good"
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
                        v-model="treeExaminationTrunk.diffuse"
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
                        v-model="treeExaminationTrunk.noReaction"
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
                        v-model="treeExaminationTrunk.dyingBack"
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
                        v-model="treeExaminationTrunk.description"
                      ></v-textarea>
                    </div>
                  </div>
                </v-col>

                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationTrunk.unchanged"
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
                        v-model="treeExaminationTrunk.change"
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
                      v-if="treeExaminationTrunk.trunkImages.length > 0"
                    >
                      <v-col
                        cols="2"
                        v-for="(image,
                        index) in treeExaminationTrunk.trunkImages"
                        :key="index"
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
                            @click="removeTrunkBaseImage(index)"
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
                  <template>
              
                </template>
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
      treeExaminationTrunk: {
        directionTypeId: [],
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
        trunkImages: []
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
      selectedtrunkImages: [],
      beetleItems: [],
      parasitItems: [],
      mushroomItems: []
    };
  },
  watch: {
    object: {
      handler: function(val) {
        if (val) {
          this.$emit("thirdAccordion", val);
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
    "treeExaminationTrunk.necrosis": function(newValue, oldValue) {
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
          this.treeExaminationTrunk.trunkNecrosisDamagedAreaDetails = [];
        });
      }
    },
    "treeExaminationTrunk.crack": function(newValue, oldValue) {
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
          this.treeExaminationTrunk.trunkCrackDamagedAreaDetails = [];
        });
      }
    }
  },
  computed: {
    object() {
      return this.treeExaminationTrunk;
    },
    isSkewValueDisabled() {
      return !this.treeExaminationTrunk.skew;
    },
    isMeaurmentValueDisabled() {
      return !this.treeExaminationTrunk.inclinationMeasurement;
    }
  },
  mounted() {
    this.fetchBeetleOptions();
    this.fetchParasitOptions();
    this.fetchMushroomOptions();

    // console.log("initialDataThirdAccordion: ", this.initialData);

    this.treeExaminationTrunk = { ...this.initialData };

    /* prepopulate crackDamage if there are on initial data */
    if (this.treeExaminationTrunk.trunkCrackDamagedAreaDetails.length > 0) {
      /* make it empty then popullate */
      this.crackDamage = [];
      this.treeExaminationTrunk.trunkCrackDamagedAreaDetails.forEach(
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
    if (this.treeExaminationTrunk.trunkNecrosisDamagedAreaDetails.length > 0) {
      /* make it empty then popullate */
      this.necroseDamage = [];
      this.treeExaminationTrunk.trunkNecrosisDamagedAreaDetails.forEach(
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
    handleInputChange(event, propertyName) {
      {
        if (event === "" || event === null) {
          this.$set(this.treeExaminationTrunk, propertyName, 0);
        }
      }
    },

    toggleAccordion() {
      if (this.treeExaminationTrunk.graftingPoint) {
        this.accordionOpen = [0]; // Index of the accordion item to open
      } else {
        this.accordionOpen = [];
      }
    },

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
        damagedAreaTypeId: DamageAreaTypes.Trunk_Necrosis,
        directionTypeId: this.necroseDamage[index].inputs.selectedDirection,
        height: this.necroseDamage[index].inputs.DmgHeight,
        length: this.necroseDamage[index].inputs.DmgLength,
        width: this.necroseDamage[index].inputs.DmgBroad,
        description: this.necroseDamage[index].inputs.DmgDescription
      };

      this.treeExaminationTrunk.trunkNecrosisDamagedAreaDetails.push(
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
        damagedAreaTypeId: DamageAreaTypes.Trunk_Crack,
        directionTypeId: this.crackDamage[index].inputs.selectedDirection,
        height: this.crackDamage[index].inputs.DmgHeight,
        length: this.crackDamage[index].inputs.DmgLength,
        width: this.crackDamage[index].inputs.DmgBroad,
        description: this.crackDamage[index].inputs.DmgDescription
      };

      this.treeExaminationTrunk.trunkCrackDamagedAreaDetails.push(newCrackDmg);

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

          this.treeExaminationTrunk.trunkImages.push(fileData);
        };
      }

      this.selectedRootDamageImages = []; // Clear the selected files after uploading
    },

    removeTrunkImage(index) {
      this.treeExaminationTrunk.trunkImages.splice(index, 1);
      this.selectedtrunkImages = [];
    },

    updateTrunkDamagedAreaNecrose(necroseDamage) {
      /* this function prepares data on trunkBaseDamagedAreaDetails handles removing of item aswell */
      this.treeExaminationTrunk.trunkNecrosisDamagedAreaDetails = necroseDamage.map(
        item => {
          return {
            damagedAreaTypeId: DamageAreaTypes.Trunk_Necrosis,
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
      this.treeExaminationTrunk.trunkCrackDamagedAreaDetails = crackDamage.map(
        item => {
          return {
            damagedAreaTypeId: DamageAreaTypes.Trunk_Crack,
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
<style>
.cursor {
  cursor: pointer;
}
</style>
