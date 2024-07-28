<template>
  <div>
    <v-row :class="viewOnly ? 'view-only' : ''">
      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Standort/Sozialgefüge:</p>

            <v-autocomplete
              v-model="treeExaminationCrown.locationId"
              :items="locationsItems"
              item-text="name"
              item-value="id"
              outlined
              clearable
            >
              <v-icon slot="append" color="white">
                mdi-chevron-down
              </v-icon>
            </v-autocomplete>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Grosse Wunden:</p>

            <v-text-field
              v-model="treeExaminationCrown.majorWounds"
              type="text"
              outlined
              clearable
              append-outer-icon="Stk."
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Hohlungen:</p>

            <v-text-field
              v-model="treeExaminationCrown.hollows"
              type="text"
              outlined
              clearable
              append-outer-icon="Stk."
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Kritische Gabelungen:</p>

            <v-text-field
              v-model="treeExaminationCrown.criticalForks"
              type="text"
              outlined
              clearable
              append-outer-icon="Stk."
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Kronenverankerung dynamisch:</p>

            <v-text-field
              v-model="treeExaminationCrown.crownAnchorage"
              type="text"
              outlined
              clearable
              append-outer-icon="Stk."
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Starr</p>

            <v-text-field
              v-model="treeExaminationCrown.rigid"
              type="text"
              outlined
              clearable
              append-outer-icon="Stk."
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Astbruche:</p>

            <v-text-field
              v-model="treeExaminationCrown.branchFractures"
              type="text"
              outlined
              clearable
              append-outer-icon="Stk."
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Totäste zentral:</p>

            <v-text-field
              v-model="treeExaminationCrown.deadBranches"
              type="text"
              outlined
              clearable
              append-outer-icon="%"
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Peripher:</p>

            <v-text-field
              v-model="treeExaminationCrown.peripheral"
              type="text"
              outlined
              clearable
              append-outer-icon="%"
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Sekundärtriebanteil:</p>

            <v-text-field
              v-model="treeExaminationCrown.secondaryDriveShare"
              type="text"
              outlined
              clearable
              append-outer-icon="%"
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Triebwachstumslänge:</p>

            <v-text-field
              v-model="treeExaminationCrown.shootGrowthLength"
              type="text"
              outlined
              clearable
              append-outer-icon="cm"
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Vorzeitiger Laubfall:</p>

            <v-text-field
              v-model="treeExaminationCrown.prematureLeafFall"
              type="text"
              outlined
              clearable
              append-outer-icon="%"
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Verlichtung:</p>

            <v-text-field
              v-model="treeExaminationCrown.defoliation"
              type="text"
              outlined
              clearable
              append-outer-icon="%"
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Verfärbung:</p>
            <v-checkbox
              v-model="treeExaminationCrown.discoloration"
              hide-details
              label="Gesamt"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Astweise:</p>

            <v-text-field
              v-model="treeExaminationCrown.branchByBranch"
              type="text"
              outlined
              clearable
              append-outer-icon="%"
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Wipfeldürr Kronenlänge:</p>

            <v-text-field
              v-model="treeExaminationCrown.crownLength"
              type="text"
              outlined
              clearable
              append-outer-icon="%"
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>
    </v-row>

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
                        v-model="treeExaminationCrown.necrosis"
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
                        v-model="treeExaminationCrown.wound"
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
                        v-model="treeExaminationCrown.crack"
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
                        v-model="treeExaminationCrown.fungalFruitingBody"
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
                        v-model="treeExaminationCrown.drillHole"
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
                v-show="treeExaminationCrown.necrosis"
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

              <v-row
                class="root-damage"
                v-show="treeExaminationCrown.crack"
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
                        v-model="treeExaminationCrown.beetleId"
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
                        v-model="treeExaminationCrown.parasitId"
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
                        v-model="treeExaminationCrown.mushroomTypeId"
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
                        v-model="treeExaminationCrown.remarks"
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
                        v-model="treeExaminationCrown.good"
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
                        v-model="treeExaminationCrown.diffuse"
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
                        v-model="treeExaminationCrown.noReaction"
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
                        v-model="treeExaminationCrown.dyingBack"
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
                        v-model="treeExaminationCrown.description"
                      ></v-textarea>
                    </div>
                  </div>
                </v-col>

                <v-col cols="4" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationCrown.unchanged"
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
                        v-model="treeExaminationCrown.change"
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
                      v-if="treeExaminationCrown.crownImages.length > 0"
                    >
                      <v-col
                        cols="2"
                        v-for="(image,
                        index) in treeExaminationCrown.crownImages"
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
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row :class="viewOnly ? 'view-only' : ''">
      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Gesundheit:</p>

            <v-autocomplete
              v-model="treeExaminationCrown.healthId"
              :items="healthItems"
              item-text="description"
              item-value="id"
              outlined
              clearable
            >
              <v-icon slot="append" color="white">
                mdi-chevron-down
              </v-icon>
            </v-autocomplete>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Schädigung:</p>

            <v-text-field
              v-model="treeExaminationCrown.injury"
              type="text"
              outlined
              clearable
              append-outer-icon="%"
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Verkehrssicherheit:</p>

            <v-autocomplete
              v-model="treeExaminationCrown.roadSafetyId"
              :items="roadSafetyItems"
              item-text="description"
              item-value="id"
              outlined
              clearable
            >
              <v-icon slot="append" color="white">
                mdi-chevron-down
              </v-icon>
            </v-autocomplete>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row :class="viewOnly ? 'view-only' : ''">
      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationCrown.habitatTree"
              hide-details
              label="Habitatbaum"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row :class="viewOnly ? 'view-only' : ''">
      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Käfer:</p>

            <v-autocomplete
              v-model="treeExaminationCrown.beetlesId"
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

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Insekten:</p>

            <v-autocomplete
              v-model="treeExaminationCrown.insectsId"
              :items="insectsItems"
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
                <v-chip color="green" small>{{ item.germanName }}</v-chip>
              </template>
            </v-autocomplete>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Vogel:</p>

            <v-autocomplete
              v-model="treeExaminationCrown.birdId"
              :items="birdsItems"
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

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Säugetiere:</p>

            <v-autocomplete
              v-model="treeExaminationCrown.mammalsId"
              :items="mamalsItems"
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
      isLoading: true,
      hasError: false,
      directionItems: DirectionTypes,
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
        secondaryCrown: true,

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
        crownImages: []
      },

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

      locationsItems: [],
      healthItems: [],
      roadSafetyItems: [],
      beetleItems: [],
      insectsItems: [],
      birdsItems: [],
      mamalsItems: [],
      parasitItems: [],
      mushroomItems: [],
      selectedCrownImages: []
    };
  },
  mounted() {
    this.fetchLocations();
    this.fetchHealthOptions();
    this.fetchRoadSafetyOptions();
    this.fetchBeetleOptions();
    this.fetchInsectsOptions();
    this.fetchBirdsOptions();
    this.fetchMammalsOptions();
    this.fetchParasitOptions();
    this.fetchMushroomOptions();

    // console.log("initialDataFifthAccordion: ", this.initialData);

    this.treeExaminationCrown = { ...this.initialData };

    /* prepopulate crackDamage if there are on initial data */
    if (this.treeExaminationCrown.crownCrackDamagedAreaDetails.length > 0) {
      /* make it empty then popullate */
      this.crackDamage = [];
      this.treeExaminationCrown.crownCrackDamagedAreaDetails.forEach(
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
    if (this.treeExaminationCrown.crownNecrosisDamagedAreaDetails.length > 0) {
      /* make it empty then popullate */
      this.necroseDamage = [];
      this.treeExaminationCrown.crownNecrosisDamagedAreaDetails.forEach(
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
  watch: {
    objekti: {
      handler: function(val, oldVal) {
        if (val) {
          this.$emit("kroneAccordion", val);
        }
      },
      deep: true
    },
    necroseDamage: {
      handler: function(newVal) {
        this.updateCrownDamagedAreaNecrose(newVal);
      },
      deep: true
    },
    crackDamage: {
      handler: function(newVal) {
        this.updateCrownDamagedAreaCrack(newVal);
      },
      deep: true
    },

    "treeExaminationCrown.necrosis": function(newValue, oldValue) {
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
          this.treeExaminationCrown.crownNecrosisDamagedAreaDetails = [];
        });
      }
    },

    "treeExaminationCrown.crack": function(newValue, oldValue) {
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
          this.treeExaminationCrown.crownCrackDamagedAreaDetails = [];
        });
      }
    }
  },
  computed: {
    objekti() {
      return this.treeExaminationCrown;
    }
  },
  methods: {
    async fetchLocations() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Location/GetAll`
        );

        // console.log("locationsItems", response.data);

        this.locationsItems = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchHealthOptions() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Health/GetAll`
        );

        // console.log("Healthitems", response.data);

        this.healthItems = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchRoadSafetyOptions() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/RoadSafety/GetAll`
        );

        // console.log("roadSafety", response.data);

        this.roadSafetyItems = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
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

    async fetchInsectsOptions() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/InsectType/GetAll`
        );

        // console.log("insects", response.data);

        this.insectsItems = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchBirdsOptions() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Bird/GetAll`
        );

        // console.log("birds", response.data);

        this.birdsItems = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchMammalsOptions() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Mammals/GetAll`
        );

        // console.log("Mammals", response.data);

        this.mamalsItems = response.data;

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

    cloneNewNecroseDmg(index) {
      console.log("addNewIndex", index);

      /* populate trunkBaseDamagedAreaDetails */

      const newNecroseDmg = {
        damagedAreaTypeId: DamageAreaTypes.Crown_Necrosis,
        directionTypeId: this.necroseDamage[index].inputs.selectedDirection,
        height: this.necroseDamage[index].inputs.DmgHeight,
        length: this.necroseDamage[index].inputs.DmgLength,
        width: this.necroseDamage[index].inputs.DmgBroad,
        description: this.necroseDamage[index].inputs.DmgDescription
      };

      this.treeExaminationCrown.crownNecrosisDamagedAreaDetails.push(
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
        damagedAreaTypeId: DamageAreaTypes.Crown_Crack,
        directionTypeId: this.crackDamage[index].inputs.selectedDirection,
        height: this.crackDamage[index].inputs.DmgHeight,
        length: this.crackDamage[index].inputs.DmgLength,
        width: this.crackDamage[index].inputs.DmgBroad,
        description: this.crackDamage[index].inputs.DmgDescription
      };

      this.treeExaminationCrown.crownCrackDamagedAreaDetails.push(newCrackDmg);

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

    deleteNecroseDmgContainer(index) {
      this.necroseDamage = this.necroseDamage.filter((item, i) => i !== index);
    },

    deleteCrackDmgContainer(index) {
      this.crackDamage = this.crackDamage.filter((item, i) => i !== index);
    },

    updateCrownDamagedAreaNecrose(necroseDamage) {
      /* this function prepares data on trunkBaseDamagedAreaDetails handles removing of item aswell */
      this.treeExaminationCrown.crownNecrosisDamagedAreaDetails = necroseDamage.map(
        item => {
          return {
            damagedAreaTypeId: DamageAreaTypes.Crown_Necrosis,
            directionTypeId: item.inputs.selectedDirection,
            height: item.inputs.DmgHeight,
            length: item.inputs.DmgLength,
            width: item.inputs.DmgBroad,
            description: item.inputs.DmgDescription
          };
        }
      );
    },

    updateCrownDamagedAreaCrack(crackDamage) {
      this.treeExaminationCrown.crownCrackDamagedAreaDetails = crackDamage.map(
        item => {
          return {
            damagedAreaTypeId: DamageAreaTypes.Crown_Crack,
            directionTypeId: item.inputs.selectedDirection,
            height: item.inputs.DmgHeight,
            length: item.inputs.DmgLength,
            width: item.inputs.DmgBroad,
            description: item.inputs.DmgDescription
          };
        }
      );
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

          this.treeExaminationCrown.crownImages.push(fileData);
        };
      }

      this.selectedRootDamageImages = []; // Clear the selected files after uploading
    },
    removeTrunkBaseImage(index) {
      this.treeExaminationCrown.crownImages.splice(index, 1);
      this.selectedCrownImages = [];
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
