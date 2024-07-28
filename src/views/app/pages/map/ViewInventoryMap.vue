<template>
  <v-container fluid d-flex class="klkl">
    <div class="left-side-map">
      <img
        class="vertical-title-img"
        src="../../../../assets/images/arrow-right-white.png"
        alt="arrow-right-white"
        @click="closeViewMap"
      />
      <h2 class="vertical-h2" @click="closeViewMap">Karte schließen</h2>
    </div>
    <div class="map print-map">
      <l-map
        :zoom="zoom"
        :key="mapKey"
        :center="center"
        @click="onMapClick"
        ref="map"
        @ready="onMapReady"
        id="map-id"
      >
        <l-tile-layer
          :url="currentLayer.url"
          :attribution="currentLayer.attribution"
        ></l-tile-layer>

        <l-control class="topright">
          <div class="undo-redo-clean">
            <button class="btn" @click="closeViewMap">
              <!-- <img
                src=""
                width="20"
                height="18"
                alt="location"
              /> -->
              <span></span>
            </button>
          </div>
        </l-control>
        <l-control-zoom />
        <l-control class="my-controls">
          <button class="location" @click="goToMyLocation">
            <img
              src="../../../../assets/images/my-location.png"
              alt="location"
            />
          </button>
        </l-control>
        <l-layer-group>
          <l-polygon
            v-for="(zone, index) in mapRegions"
            :ref="zone"
            :key="index"
            :lat-lngs="zone.coordinates"
            :options="polygonOptions"
            :disabled="zone.isLocked"
            :fillColor="zone.isLocked ? '#2A2B2A' : polygonOptions.fillColor"
            @click="zone.isLocked == true ? null : onZone(zone, $event)"
            :interactive="!zone.isLocked"
          >
            <l-popup
              ref="popup"
              :close-button="false"
              :options="popupOptions"
              v-if="!loader"
            >
              <div class="popup-content">
                <div class="title">
                  <img
                    src="../../../../assets/images/map-icon-viewed.png"
                    alt="map-icon"
                    width="27px"
                    height="25px"
                  />
                  <h2>Basel-Kloster Wettingen</h2>
                </div>
                <div class="selected-yars">
                  <v-select
                    v-model="selectedYear"
                    :items="orderedYears"
                    outlined
                    @change="changeyear"
                  >
                    <template #selectedYear="{ selectedYear }">
                      {{ selectedYear || "Select a year" }}
                    </template>
                  </v-select>
                </div>
                <div class="informations">
                  <div class="popup-description">
                    <span>Anz. Baume:</span>
                    <span v-if="inventarInformation.totalTrees">{{
                      inventarInformation.totalTrees
                    }}</span>
                    <span v-else>-</span>
                  </div>
                  <div class="popup-description">
                    <span>Norm [h]</span>
                    <span v-if="inventarInformation.normalHours">
                      {{ inventarInformation.normalHours }}
                    </span>
                    <span v-else> - </span>
                  </div>
                  <div class="popup-description">
                    <span>Spez [h]</span>
                    <span v-if="inventarInformation.specialHours">{{
                      inventarInformation.specialHours
                    }}</span>
                    <span v-else>-</span>
                  </div>
                  <div class="popup-description">
                    <span>Aufwand Material</span>
                    <span v-if="inventarInformation.material">
                      {{ inventarInformation.material }}
                    </span>
                    <span v-else> - </span>
                  </div>
                </div>
                <div class="footer-links">
                  <button class="btn" @click.prevent="printMap">
                    Karte Drucken
                  </button>
                  <button class="btn" @click.prevent="goToInventarInfo(zone)">
                    Ansicht
                  </button>
                </div>
              </div>
            </l-popup>

            <l-tooltip
              v-if="zone.isLocked"
              :options="{ permanent: true, direction: 'center' }"
              ><div class="locked">
                <span>{{ zone.name }}</span>
                <img src="../../../../assets/images/lock.svg" alt="locked" />
              </div>
            </l-tooltip>
            <l-tooltip
              :class="{ 'clicked-zone': zoneClicked === zone }"
              v-else
              :options="{ permanent: true, direction: 'center' }"
              >{{ zone.name }}</l-tooltip
            >
          </l-polygon>
          <l-polyline
            v-if="polygonPoints.length > 1"
            :lat-lngs="polygonPoints"
            :color="color"
            :options="polylineOptions"
          >
          </l-polyline>
        </l-layer-group>
      </l-map>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import domToImage from "dom-to-image";
import leafletImage from "leaflet-image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  LMap,
  LTileLayer,
  LPolygon,
  LTooltip,
  LLayerGroup,
  LIcon,
  LPopup,
  LDrawToolbar,
  LControlZoom,
  LControl,
  LMarker
} from "vue2-leaflet";
import axios from "axios";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw";
import L from "leaflet";

export default {
  name: "Inventarliste",
  components: {
    LMap,
    LTileLayer,
    LPolygon,
    LTooltip,
    LLayerGroup,
    LIcon,
    LPopup,
    LDrawToolbar,
    LControlZoom,
    LControl,
    LMarker
  },
  props: ["centerr"],
  data() {
    return {
      zoom: 12,
      mapKey: 0,
      center: [72.012782, 0.208447], // set your initial center
      url: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, // set your tile layer URL
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      apikey: "AIzaSyC27AbpxpWs0UKZEzUcq-qQ4zDcI_D4jKo",
      currentLayer: {
        name: "",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      },
      clickLatLngs: [],
      isCreatingPolygon: false,
      polygonPoints: [],
      redoPolygonPoints: [],
      mapRegions: [],
      polygonOptions: {
        fillColor: "#FFFFFF",
        color: "#494949",
        weight: 3,
        opacity: 0.6,
        fillOpacity: 0.6
      },
      polylineOptions: {},
      popupOptions: {
        closeButton: true,
        autoClose: false,
        autoOpenPopup: true
      },
      inventarInformation: {},
      layers: [
        {
          name: "Regions",
          active: true,
          leafletLayer: null,
          layer: L.layerGroup()
        }
      ],
      years: [],
      selectedYear: 2023,
      zoneId: null,
      loader: false,
      zoneClicked: null,
      clickedLayer: null
    };
  },
  computed: {
    ...mapGetters(["mapRegionData", "error", "loggedInUser"]),

    orderedYears() {
      return this.years.slice().reverse();
    }
  },
  watch: {},
  methods: {
    async printMap() {
      try {
        const mapContainer = document.querySelector(".map");

        const popup = document.querySelector(".leaflet-popup");
        popup.style.display = "none";
        this.loader = true;

        const imageWidth = mapContainer.clientWidth;
        const imageHeight = mapContainer.clientHeight;
        console.log(mapContainer);
        console.log(imageWidth, imageHeight);
        const imageUrl = await domToImage.toPng(mapContainer);
        console.log(imageUrl);
        // Create a temporary link to download the image
        const link = document.createElement("a");
        link.download = "map-screenshot.png";
        link.href = imageUrl;
        link.click();
        this.loader = false;

        popup.style.display = "block";
      } catch (error) {
        console.error(error);
      }
      //   try {
      //     const mapContainer = document.querySelector('.map');

      //     const popup = document.querySelector('.leaflet-popup');
      //     popup.style.display = 'none';
      //     this.loader = true;

      //       const map = this.$refs.map.mapObject
      //     console.log(map)

      //     leafletImage(map, function(err, canvas) {
      //     // now you have canvas
      //     // example thing to do with that canvas:
      //     var img = document.createElement('img');
      //     var dimensions = map.getSize();
      //     img.width = dimensions.x;
      //     img.height = dimensions.y;
      //     img.src = canvas.toDataURL();
      //     const link = document.createElement('a');
      //     link.download = 'map-screenshot.png';
      //     link.href = canvas.toDataURL();
      //     link.click();
      //     // document.getElementById('images').innerHTML = '';
      //     // document.getElementById('images').appendChild(img);
      // });

      //     // const imageUrl = await domToImage.toPng(mapContainer, { width: imageWidth, height: imageHeight });

      //     // console.log(imageUrl)

      //     // // Create a temporary link to download the image
      //     // const link = document.createElement('a');
      //     // link.download = 'map-screenshot.png';
      //     // link.href = imageUrl;
      //     // link.click();
      //     // this.loader = false

      //     // popup.style.display = 'block';

      //   } catch (error) {
      //     console.log(error);
      //   }
    },
    downloadURI(uri, name) {
      var link = document.createElement("a");

      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      //after creating link you should delete dynamic link
      //clearDynamicLink(link);
    },
    goToInventarInfo(zone) {
      this.$router.push({
        name: "InventarInfo",
        query: { id: zone.inventoryId },
        params: { title: zone.name }
      });
    },
    changeyear() {
      this.fetchInventarInfo();
    },
    fetchInventarInfo() {
      axios
        .get(
          `https://tilia.rrota.org/api/Inventory/MapInfo/${this.zoneId}/${this.selectedYear}`
        )
        .then(response => {
          this.inventarInformation = response.data;
        })
        .catch(error => {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          console.log(error);

          // ...
        });
    },
    async fetchYears() {
      try {
        const response = await axios.get(
          "https://tilia.rrota.org/api/Inventory/GetYears"
        );
        console.log("years", response.data);
        this.years = response.data;
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.hasError = true;
      }
    },
    onZone(zone, event) {
      const id = this.$route.params.id;
      const year = this.$route.params.year;
      this.zoneId = zone.inventoryId;
      const map = this.$refs.map.mapObject;
      this.zoneClicked = zone;
      // Find the clicked layer
      const clickedLayer = event.target;

      // // Do something with the clicked layer
      // const clickedZoneStyle = document.querySelector(".leaflet-tooltip");
      // clickedZoneStyle.style.color = "white"
      // console.log("clickedZoneStyle",clickedLayer);

      // clickedLayer.setStyle({
      //   fillColor: '#151914',
      //   color: '#1DB954',
      //   weight: 2,
      //   border: "3px solid #A4A4A4",
      //   opacity: 0.7,
      // });

      this.clickedLayer = clickedLayer;

      // Listen to popup events
      clickedLayer.on("popupopen", this.onPopupOpen);
      clickedLayer.on("popupclose", this.onPopupClose);

      axios
        .get(
          `https://tilia.rrota.org/api/Inventory/MapInfo/${zone.inventoryId}/${year}`
        )
        .then(response => {
          console.log("resoinse", response.data);
          this.inventarInformation = response.data;
        })
        .catch(error => {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          console.log(error);

          // ...
        });
    },

    onPopupOpen(e) {
      // Update the style of the clicked layer
      this.clickedLayer.setStyle({
        fillColor: "#151914",
        color: "#1DB954",
        weight: 2,
        border: "3px solid #A4A4A4",
        opacity: 0.7
      });
      // Get the tooltip element for the clicked layer
      const tooltip = this.clickedLayer.getTooltip().getElement();
      // Update the tooltip style
      tooltip.classList.add("white-tooltip");
    },
    onPopupClose(e) {
      // Reset the style of the clicked layer
      this.clickedLayer.setStyle({
        fillColor: "#FFFFFF",
        color: "#494949",
        weight: 3,
        opacity: 0.6,
        fillOpacity: 0.6
      });
      // Get the tooltip element for the clicked layer
      const tooltip = this.clickedLayer.getTooltip().getElement();
      // Update the tooltip style
      tooltip.classList.remove("white-tooltip");
    },
    goToMyLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const latlng = [position.coords.latitude, position.coords.longitude];
          this.$refs.map.mapObject.setView(latlng, 15); // Set the map view to your location with zoom level 15
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },

    // changeTileLayer(layer) {
    //   console.log(layer);
    //   this.selectedLayer = layer;
    //   this.currentLayer = layer;
    // },
    //    onMapClick(e) {
    //     console.log(e.latlng);
    //     const latlng = e.latlng;
    //     this.clickLatLngs.push([latlng.lat, latlng.lng]);
    //      if (this.clickLatLngs.length >= 3) {
    //       const lastIndex = this.mapRegions.length - 1;
    //       const lastRegion = this.mapRegions[lastIndex].region;
    //       lastRegion.push(this.clickLatLngs);
    //       this.clickLatLngs = [];
    //       console.log('Region updated:', lastRegion);
    //       const obj = {
    //         inventoryId: 152,
    //         name: "inventory i ri",
    //         lastRegion
    //       }
    //       this.mapRegions.push(obj)
    //       this.$emit('items-updated', this.clickLatLngs);
    //     }

    // },
    onMapReady() {
      this.mapReady = true;
      this.centerMapOnZone();
    },
    closeViewMap() {
      this.$router.go(-1);
    },
    onMapClick(event) {
      if (this.isCreatingPolygon) {
        const latlng = event.latlng;
        this.polygonPoints.push([latlng.lat, latlng.lng]);
        if (this.polygonPoints.length > 1) {
          const lastIndex = this.polygonPoints.length - 1;
          const lastPoint = this.polygonPoints[lastIndex];
          const previousPoint = this.polygonPoints[lastIndex - 1];
          const polyline = L.polyline(
            [previousPoint, lastPoint],
            this.polylineOptions
          );
          polyline.addTo(this.$refs.map.mapObject);
          this.savePolygon();
        }
      }
    },
    handeldata(data) {
      this.mapKey += 1;
      setTimeout(() => {
        this.center = data;
      }, 100);
    },
    ...mapActions(["mapRegion"]),
    setMapDataRegions() {
      axios
        .get("https://tilia.rrota.org/api/Inventory/MapRegionByUser")
        .then(response => {
          this.mapRegions = response.data;
        })
        .catch(error => {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          console.log(error);

          // ...
        });
    },

    centerMapOnZone() {
      // Find the average latitude and longitude of all points in the zone
      const latlngs = JSON.parse(this.$route.params.coord);
      console.log("latlngs", latlngs);
      const latlngBounds = L.latLngBounds(latlngs);
      const center = latlngBounds.getCenter();

      // Use Leaflet's fitBounds method to set the map view to display the entire zone
      this.$refs.map.mapObject.fitBounds(latlngBounds);

      // Update the component's center and zoom properties to reflect the new map view
      this.center = [center.lat, center.lng];
      this.zoom = this.$refs.map.mapObject.getZoom();
    }
  },
  created() {
    this.setMapDataRegions();

    this.fetchYears();
  },
  watch: {},
  mounted() {
    // this.center = JSON.parse(this.$route.params.coord);

    // this.$parent.$on("send-cordinatess", (data) => {
    //   console.log("erdh", data);
    //   setTimeout(() => {
    //     this.center = data;
    //   }, 200); // delay the emission of the event by 2 seconds
    // });

    const id = this.$route.params.id;
  }
};
</script>
<style lang="scss">
.left-side-map {
  height: calc(100vh - 75px);
  width: 43px;
  .vertical-title-img {
    margin-top: 116px;
    margin-bottom: 32px;
    cursor: pointer;
  }

  .vertical-h2 {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    width: 200px;
    height: 24px;
    margin-left: -92px;
    color: #ffffff;
    transform: rotate(-90deg);
    cursor: pointer;
  }
}

.map {
  width: 100%;
  height: calc(100vh - 75px);
  .white-tooltip {
    color: white !important;
  }

  .leaflet-popup-tip-container {
    .leaflet-popup-tip {
      background: #1c1e1c !important;
    }
  }

  .leaflet-container a.leaflet-popup-close-button {
    top: 20px !important;
    right: 20px !important;
    font: 26px/24px Tahoma, Verdana, sans-serif !important;
    color: #fff !important;
  }
  .leaflet-popup-content-wrapper {
    background: #1c1e1c;
    border: 1px solid #494949;
    border-radius: 10px;
    width: 420px;
    height: auto;

    .leaflet-popup-content {
      max-width: 90%;
      width: 90% !important;
      background: #1c1e1c;

      div {
        .popup-content {
          padding: 10px;
          background: #1c1e1c;
          color: #fff;
          border-radius: 5px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          padding-top: 35px;
          padding-bottom: 35px;

          .title {
            display: flex;
            border-bottom: 1px solid #494949;
            padding-bottom: 10px;
            h2 {
              font-style: normal;
              font-weight: 500;
              font-size: 18px;
              line-height: 27px;
              color: #ffffff;
              margin-left: 20px;
            }
          }

          .selected-yars {
            margin-top: 30px;

            select {
              width: 309px;
              height: 40px;
              background: #1c1e1c;
              border: 1px solid #494949;
              border-radius: 5px;
              color: #fff;
            }
          }

          .informations {
            border-bottom: 1px solid #494949;
          }

          .footer-links {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;

            .btn {
              font-style: normal;
              font-weight: 400;
              font-size: 16px;
              line-height: 24px;
              /* identical to box height */
              display: flex;
              align-items: center;
              text-decoration-line: underline;

              /* Wireframes/Colors/White */

              color: #ffffff;

              &:first-child {
                &::before {
                  content: "";
                  display: inline-block;
                  background-image: url("../../../../assets/images/print.png");
                  background-position: center;
                  background-size: cover;
                  width: 20px;
                  height: 21px;
                  margin-right: 10px;
                }
              }
            }
          }
        }

        .popup-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .popup-description {
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          padding-bottom: 25px;
          /* identical to box height */

          /* UI/White */

          color: #ffffff;
          display: flex;
          justify-content: space-between;

          span:last-child {
            margin-right: 70px;
            text-align: left;
          }
        }

        .popup-image {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          margin-top: 10px;
        }
      }
    }
  }

  .leaflet-tooltip {
    background-color: transparent;
    border: 0;
    font-size: 12px;
    box-shadow: none;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
    color: #2a2b2a;

    .locked {
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.85;
      z-index: 1;
      span {
        z-index: 0;
      }
      img {
        z-index: 9998;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .clicked-zone .leaflet-tooltip {
    color: #fff !important;
  }
  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out {
    background-color: #fff;
  }
  .leaflet-left .leaflet-control-zoom {
    display: none;
  }
  .leaflet-right .leaflet-control-zoom {
    position: fixed;
    top: 42%;
    right: 14px;
    background: #2a2b2a;
    opacity: 0.8;
  }
  .leaflet-right .leaflet-control-zoom .leaflet-bar {
    border-radius: none;
  }
  .leaflet-touch .leaflet-bar a {
    background: #2a2b2a;
    opacity: 0.8;
    color: white;
  }
  .my-controls {
    position: fixed;
    top: 48.9%;
    right: 14px;
    /* padding: 1.8px; */
    background: #2a2b2a;
    opacity: 0.8;
    /* border-top-left-radius: 2px; */
    /* border-top-right-radius: 2px; */
    background: #2a2b2a;
    opacity: 0.8;
    /* width: 30px; */
    padding-bottom: 5px;
    padding-top: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;

    button.location {
      color: white;
      width: 34px;
      height: 30px;
      line-height: 30px;
      display: inline-block;
      /* text-align: center; */
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
      border-top: 1px solid #a4a4a4;
      padding-top: 7px;
      cursor: pointer;
    }

    button.add-points {
      border-top: 1px solid #a4a4a4;
      padding-top: 10px;
      cursor: pointer;
    }
  }
  .topright .undo-redo-clean {
    background: #2a2b2a;
    background-image: url("../../../../assets/images/close_white_border.png");
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.8;
    padding: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -10px;
    right: -10px;
    .btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      border-right: 1px solid #a4a4a4;
      padding-right: 10px;
      cursor: pointer;
    }
    .btn:last-child {
      border-right: none;
    }
    span {
      margin-top: 5px;
    }
  }
}
</style>
