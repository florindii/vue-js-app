<template>
  <div>
    <v-row :class="viewOnly ? 'view-only' : ''">
      <v-col cols="12" class="form-element-holder">
        <div>
          <p class="custom-label">Beeinträchtigung:*</p>

          <div class="fields">
            <v-textarea
              outlined
              auto-grow
              :counter="maxCharacters"
              name="damage"
              v-model="treeExaminationRootSpace.impairment"
              ref="damage"
            ></v-textarea>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row :class="viewOnly ? 'view-only' : ''">
      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.suspectedRootDamage"
              @click="toggleAccordion()"
              hide-details
              label="Verdacht Wurzelschäden"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.suspicionCaneRot"
              hide-details
              label="Verdacht Stockfäule"
              class="custom-checkbox"
            ></v-checkbox>
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
              Beschreibung der Wurzelschäden
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row :class="viewOnly ? 'view-only' : ''">
                <v-col cols="6" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <v-checkbox
                        v-model="treeExaminationRootSpace.constructionSite"
                        hide-details
                        label="Baustelle / Arbeiten in der umgebung"
                        class="custom-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col cols="6" class="form-element-holder">
                  <div>
                    <div class="fields one-line">
                      <p class="custom-label">Datum:</p>

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
                            hide-details
                            v-on="on"
                            @click:clear="clearDate()"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="treeExaminationRootSpace.date"
                          no-title
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="dateMenu = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="
                              $refs.dateMenu.save(treeExaminationRootSpace.date)
                            "
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-row
                class="root-damage"
                v-for="(item, index) in rootDamage"
                :key="index"
                :class="viewOnly ? 'view-only' : ''"
              >
                <v-col cols="12" class="form-element-holder">
                  <div>
                    <div class="fields">
                      <p class="custom-title">
                        {{ index + 1 }}. Wurzelschaden:
                        <a
                          href="#"
                          v-if="rootDamage.length > 1"
                          class="remove-root-dmg"
                          @click.prevent="deleteRootDmgContainer(index)"
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
                        item-text="name"
                        item-value="value"
                        outlined
                        hide-details
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
                        v-model="item.inputs.rootDmgHeight"
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
                        v-model="item.inputs.rootDmgLength"
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
                        v-model="item.inputs.rootDmgBroad"
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
                        v-model="item.inputs.rootDmgDescription"
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
                    @click.prevent="cloneNewRootDmg(index)"
                  >
                    <span class="mdi mdi-plus-thick custom-add-icon"></span
                    ><span>Add New</span>
                  </a>
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
                      v-if="treeExaminationRootSpace.rootSpaceImages.length > 0"
                    >
                      <v-col
                        cols="2"
                        v-for="(image,
                        index) in treeExaminationRootSpace.rootSpaceImages"
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
                            @click="removeRootDmgImage(index)"
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

                <v-col cols="6" class="form-element-holder">
                  <div>
                    <p class="custom-label">Info*</p>

                    <div class="fields">
                      <v-textarea
                        outlined
                        auto-grow
                        :counter="maxCharacters"
                        v-model="treeExaminationRootSpace.info"
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

    <v-row :class="viewOnly ? 'view-only' : ''">
      <v-col cols="6" class="form-element-holder">
        <div>
          <div class="fields one-line">
            <p class="custom-label">Abstand ab Stammrand:</p>

            <v-text-field
              v-model="treeExaminationRootSpace.trunkEdgeDistance"
              type="text"
              outlined
              clearable
              hide-details
              append-outer-icon="m"
              class="number-input"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.floorCrack"
              hide-details
              label="Bodenriss"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.floorSealing"
              hide-details
              label="Bodenversiegelung"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.silting"
              hide-details
              label="Verschlämmung"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.floorCompaction"
              hide-details
              label="Bodenverdichtung"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.waterlogging"
              hide-details
              label="Vernässung"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.floorApplication"
              hide-details
              label="Bodenauftrag"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.waterShortage"
              hide-details
              label="Wassermangel"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.visibleRootsNearSurface"
              hide-details
              label="Sichtbare oberflächennahe Wurzeln"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.roadSaltSuspicion"
              hide-details
              label="Verdacht auf Streusalz"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="form-element-holder">
        <div>
          <div class="fields">
            <v-checkbox
              v-model="treeExaminationRootSpace.floorRemoval"
              hide-details
              label="Bodenabtrag"
              class="custom-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Weiter Stoffeinträge:</p>

            <v-autocomplete
              v-model="treeExaminationRootSpace.otherSubstanceInputsId"
              :items="otherSubstanceItems"
              item-text="name"
              item-value="id"
              outlined
              multiple
              small-chips
              hint="Note: lorem ipsum"
              clearable
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
            <p class="custom-label">Pilze:</p>

            <v-autocomplete
              v-model="treeExaminationRootSpace.mushroomTypeId"
              :items="mushroomItems"
              item-text="abbreviation"
              item-value="id"
              outlined
              multiple
              small-chips
              hint="Note: lorem ipsum"
              clearable
              persistent-hint
            >
              <v-icon slot="append" color="white">
                mdi-chevron-down
              </v-icon>
              <template #selection="{ item }">
                <v-chip color="green" small>{{ item.abbreviation }}</v-chip>
              </template>
            </v-autocomplete>
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="form-element-holder">
        <div>
          <div class="fields">
            <p class="custom-label">Richtung:</p>

            <v-autocomplete
              v-model="treeExaminationRootSpace.directionTypeId"
              :items="directionItems"
              item-text="name"
              item-value="value"
              outlined
              multiple
              small-chips
              clearable
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
import moment from "moment";
import axios from "axios";
import DamageAreaTypes from "@/consts/damageAreaTypes";
import DirectionTypes from "@/consts/directionTypes";
import ColorTypes from "@/consts/colorTypes";

export default {
  props: ["initialData", "viewOnly"],
  data() {
    return {
      maxCharacters: 150,
      accordionOpen: [],
      treeExaminationRootSpace: {
        suspectedRootDamage: false,
        suspicionCaneRot: false,
        trunkEdgeDistance: 0,
        damagedTrunkEdgeDistance: 0,
        floorApplication: false,
        floorRemoval: false,
        floorCompaction: false,
        floorSealing: false,
        silting: false,
        waterlogging: false,
        waterShortage: false,
        roadSaltSuspicion: false,
        floorCrack: false,
        visibleRootsNearSurface: false,
        otherSubstanceInputsId: [],
        mushroomTypeId: [],
        directionTypeId: [],
        impairment: "string",
        constructionSite: false,
        date: null,
        info: "string",
        rootSpaceDamagedAreaDetails: [],
        rootSpaceImages: []
      },
      // imagesFromBackend: [],
      otherSubstanceItems: [],
      mushroomItems: [],
      directionItems: DirectionTypes,
      dateMenu: false,

      selectedRootDamageImages: [],

      rootDamage: [
        {
          inputs: {
            selectedDirection: null,
            rootDmgHeight: null,
            rootDmgLength: null,
            rootDmgBroad: null,
            rootDmgDescription: null
          },
          classes: [
            {
              class: "root-damage"
            }
          ],
          isDuplicatedWith: null
        }
      ]
    };
  },
  watch: {
    objekti: {
      handler: function(val, oldVal) {
        if (val) {
          this.$emit("firstAccordion", val);
        }
      },
      deep: true
    }
  },
  computed: {
    objekti() {
      return this.treeExaminationRootSpace;
    },
    dateToShow() {
      return this.treeExaminationRootSpace.date
        ? moment(this.treeExaminationRootSpace.date).format("DD-MM-YYYY")
        : null;
    }
  },
  // created() {
  //   this.getFromEditAndPreviewImages();
  // },
  mounted() {
    this.fetchOthersubstanceInputs();
    this.fetchMushroomItems();

    console.log("initialDataFirstAccordion: ", this.initialData);
    /* populate fields initially */
    this.treeExaminationRootSpace = { ...this.initialData };
  },
  methods: {
    toggleAccordion() {
      if (this.treeExaminationRootSpace.suspectedRootDamage) {
        this.accordionOpen = [0]; // Index of the accordion item to open
      } else {
        this.accordionOpen = [];
      }
    },
    async fetchOthersubstanceInputs() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/OtherSubstanceInputs/GetAll`
        );

        // console.log("othersubstanceItems", response.data);

        this.otherSubstanceItems = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchMushroomItems() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/MushroomType/GetAll`
        );

        // console.log("mushroomItems", response.data);

        this.mushroomItems = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    clearDate() {
      this.treeExaminationRootSpace.date = null;
    },

    cloneNewRootDmg(index) {
      console.log("addnewIndex: ", index);

      this.rootDamage.splice(index + 1, 0, {
        inputs: {
          selectedDirection: null,
          rootDmgHeight: null,
          rootDmgLength: null,
          rootDmgBroad: null,
          rootDmgDescription: null
        },
        classes: [
          {
            class: "root-damage"
          }
        ],
        isDuplicatedWith: null
      });

      // this.objects.forEach((object) => {
      //   if (object.index > index) {
      //     object.index += 1;
      //   }
      // });
      console.log(this.rootDamage);
    },

    deleteRootDmgContainer(index) {
      this.rootDamage = this.rootDamage.filter((item, i) => i !== index);
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

          this.treeExaminationRootSpace.rootSpaceImages.push(fileData);
        };
      }

      this.selectedRootDamageImages = []; // Clear the selected files after uploading
    },
    // previewRootDamageImages(event) {
    //   for (let i = 0; i < event.target.files.length; i++) {
    //     alert();

    //     const file = this.selectedRootDamageImages[i];

    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = e => {
    //       const base64String = e.target.result.split(",")[1]; // Extract the base64 string
    //       const fileData = {
    //         document: base64String,
    //         fileName: file.name,
    //         fileExtension: file.name.split(".").pop()
    //       };

    //      var r =  this.treeExaminationRootSpace.rootSpaceImages.push(fileData);
    //      console.log(r);
    //     };
    //   }

    //   this.selectedRootDamageImages = []; // Clear the selected files after uploading
    // },

    // async getFromEditAndPreviewImages() {
    //   if (this.initialData) {
    //     const images = this.initialData.rootSpaceImages;

    //     for (let i = 0; i < images.length; i++) {
    //       const file = images[i];
    //       const data = await fetch(file.document);
    //       const blob = await data.blob();

    //       const base64data = await new Promise(resolve => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(blob);
    //         reader.onloadend = () => {
    //           const base64 = reader.result;
    //           resolve(base64);
    //         };
    //       });

    //       // console.log("asdasd", base64data);

    //       const fileData = {
    //         nameBase64: base64data.split(",")[1],
    //         fileName: file.fileName,
    //         fileExtension: file.fileName.split(".").pop()
    //       };
    //       // this.treeExaminationRootSpace.rootSpaceImages.push(fileData);

    //       this.imagesFromBackend.push(fileData); // Push base64data into the imagesFromBackend array
    //     }

    //     this.selectedRootDamageImages = []; // Clear the selected files after uploading
    //     this.treeExaminationRootSpace.rootSpaceImages = [];
    //     this.treeExaminationRootSpace.rootSpaceImages = this.imagesFromBackend;
    //   }

    //   // console.log(this.imagesFromBackend);
    // },

    removeRootDmgImage(index) {
      this.treeExaminationRootSpace.rootSpaceImages.splice(index, 1);
      this.selectedRootDamageImages = [];
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
.upload-buttons {
  display: flex;
  align-items: center;
}
.v-input {
    align-items: flex-start;
    display: flex;
    flex: none;
    font-size: 16px;
    letter-spacing: normal;
    max-width: 100%;
    text-align: left;
}
.v-text-field{
  margin: 0;
  padding: 0;
}
.custom-file-input{
  margin-right: 20px;
  cursor: pointer;
}
</style>