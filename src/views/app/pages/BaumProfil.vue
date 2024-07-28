<template>
  <div>
    <v-card class="custom-buttons-holder">
      <v-container fluid>
        <v-row justify="end">
          <v-col cols="6">
            <v-row class="first-row">
                <a class="duplify" :class="{ disabled: !isTree }" @click.prevent="duplicateTree">
                  <span class="mdi mdi-content-copy custom-icon"></span
                  ><span class="mr-5">Duplizieren</span>
                </a> 
                <a href="#" class="edit" :class="{ disabled: !isTree }" @click.prevent="editTree">
                  <span class="mdi mdi-pencil-outline custom-icon"></span
                  ><span>Bearbeiten</span>
                </a>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card class="tree-area-info" :loading="isLoading">
      <v-container fluid v-if="hasError == false">
        <v-row>
          <v-col cols="7" class="left-side">
            <v-row>
              <v-col cols="12" class="tree-area-heading">
                <span class="avatar-color green"></span>

                <div class="title-details">
                  <p class="title">{{ treeOrAreaData ? treeOrAreaData.name : null }}</p>
                  <p class="extra-info">{{ treeOrAreaData ? treeOrAreaData.treeTypeLatinName : null }}</p>
                  <p class="extra-info">{{ treeOrAreaData ? treeOrAreaData.treeTypeGermanName : null }}</p>
                </div>
              </v-col>
            </v-row>

            <v-divider class="custom-divider"></v-divider>

            <v-row class="tree-area-props">
              <v-col cols="3" class="item-detail">
                <p class="item-title">Bedeutung:</p>
                <p class="item-desc">{{ treeOrAreaData ? treeOrAreaData.meaningType : null }}</p>
              </v-col>
              <v-col cols="3" class="item-detail">
                <p class="item-title">Alter:</p>
                <p class="item-desc">{{ treeOrAreaData ? treeOrAreaData.age : null }}</p>
              </v-col>
              <v-col cols="3" class="item-detail">
                <p class="item-title">AnzStämme:</p>
                <p class="item-desc">{{ treeOrAreaData && treeOrAreaData.technicalDatas && treeOrAreaData.technicalDatas.length > 0 ? treeOrAreaData.technicalDatas[treeOrAreaData.technicalDatas.length - 1].trunksNumber : null }}</p>
              </v-col>
              <v-col cols="3" class="item-detail">
                <p class="item-title">Stammumfang:</p>
                <p class="item-desc">{{ treeOrAreaData && treeOrAreaData.technicalDatas && treeOrAreaData.technicalDatas.length > 0 ? treeOrAreaData.technicalDatas[treeOrAreaData.technicalDatas.length - 1].trunkCircumference : null }}</p>
              </v-col>
              <v-col cols="3" class="item-detail">
                <p class="item-title">Baum Höhe [m]:</p>
                <p class="item-desc">{{ treeOrAreaData && treeOrAreaData.technicalDatas && treeOrAreaData.technicalDatas.length > 0 ? treeOrAreaData.technicalDatas[treeOrAreaData.technicalDatas.length - 1].treeHeight : null }}</p>
              </v-col>
              <v-col cols="3" class="item-detail">
                <p class="item-title">Kronen Ø [m]:</p>
                <p class="item-desc">{{ treeOrAreaData && treeOrAreaData.technicalDatas && treeOrAreaData.technicalDatas.length > 0 ? treeOrAreaData.technicalDatas[treeOrAreaData.technicalDatas.length - 1].crownDiameter : null }}</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5">
            <div class="map">
             <TreeMap :regions="mapRegions" :coordinates="inventarCoordinates" :fromViewTree="viewTree" :treeId="treeId" :areaId="areaId" :isTree="isTree" :treeCoordinates="getTreeCoordinates" :from="fromWhere"/>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import TreeMap from './map/TreeMap.vue';
import { mapGetters, mapActions } from "vuex";

export default {
  components:{TreeMap},
  data() {
    return {
      isLoading: true,
      hasError: false,
      treeOrAreaData: [],
      mapRegions:[],
      isTree: null,
      treeId: null,
      areaId: null,
      viewTree:true,
      treeCoordinate:null,
      fromWhere:'baumProfil'
    };
  },
  mounted() {
    
    this.isTree = this.getIsTree;
    this.treeId = this.getTreeId;
    this.areaId = this.getAreaId;
    console.log(this.getIsTree);
    this.treeCoordinate = this.$route.params.coord
    if (this.isTree) {
      this.fetchTreeData();
    } else {
      this.fetchAreaData();
    }
  },
  computed: {
    ...mapGetters(["inventarId","inventarCoordinates","getTreeCoordinates","getTreeId","getAreaId","getIsTree"])
  },
  methods: {
        ...mapActions([
      "addTreeCoordinates",
      "addTreeId",
      "addAreaId",
      "addIsTree",
      "addTreeItem",
      "addAreaItem"
    ]),
    editTree(){
      console.log("treeId",this.getTreeId);
      this.$router.push({ name:'Bearbeiten', params:{treeId: this.getTreeId, coord: this.getTreeCoordinates}});
    },
    async duplicateTree() {
          const response = await axios.get(
            `https://tilia.rrota.org/api/Tree/GetTree/${this.inventarId}/${this.getTreeId}`
          );

          // Encode the data as a query parameter
          const dataParam = encodeURIComponent(JSON.stringify(response.data));

          this.$router.push({
            name: 'NeuerBaum',
            query: {
              inventoryId: this.inventarId,
              data: dataParam
            }
          });
        },

    async fetchTreeData() {
      
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Tree/GetTree/${this.inventarId}/${this.getTreeId}`
        );

        this.treeOrAreaData = response.data;

        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },

    async fetchAreaData() {
      try {
        const response = await axios.get(
          `https://tilia.rrota.org/api/Tree/GetArea/${this.inventarId}/${this.getAreaId}`
        );
        this.treeOrAreaData = response.data;
        // console.log("treeOrAreaData",this.treeOrAreaData);
        this.isLoading = false;
        this.hasError = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },
    fetchMapRegionTrees() {
            axios
                .get(`https://tilia.rrota.org/api/Tree/MapRegion/${this.inventarId}`)
                .then((response) => {
                    // Handle the response from the server
                    this.mapRegions = response.data.treeRegions;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
  },
  created(){
    this.fetchMapRegionTrees()
  }

};
</script>

<style scoped lang="scss">
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
  opacity: .5;
}

.custom-divider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.tree-area-info {
  padding-bottom: 30px;
}

.left-side {
  padding-right: 100px;

  .tree-area-heading {
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

  .tree-area-props {
    .item-detail {
      margin-bottom: 50px;
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
    }
  }
}

.map {
  height: 550px;

}
</style>
