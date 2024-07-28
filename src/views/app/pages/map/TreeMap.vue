<template>
<div class="map">

    <l-map :maxZoom="maxZoom" :key="mapKey" :center="center" @click="onMapClick" ref="map" @ready="onMapReady">
        <l-tile-layer :url="currentLayer.url" :attribution="currentLayer.attribution"></l-tile-layer>
        <l-control class="topright-fullScreenMap" v-if="fromViewTree">
            <div class="undo-redo-clean fullscreen">
                <button class="btn" @click.prevent="fullScreenMap">
                    <img src="../../../../assets/images/fullscreen.svg" alt="location" width="31" height="31"/>
                </button>
            </div>
        </l-control>
        <l-control class="topright" v-if="isCreatingPolygon">
            <div class="undo-redo-clean">
                <button class="btn" @click="resetMap">
                    <img width="20" height="18" src="../../../../assets/images/clear-points.png" alt="location" />
                    <span>reset</span>
                </button>
                <button class="btn" @click="undoPolygon">
                    <img src="../../../../assets/images/undo.png" alt="add-zones" />
                    <span>undo</span>
                </button>

                <button class="btn" @click="redoPolygon">
                    <img src="../../../../assets/images/redo.png" alt="location" />
                    <span>redo</span>
                </button>
                <button class="btn" @click="closeIsCreatingPolygonMode">
                    <img src="../../../../assets/images/close_white_border.png" alt="location" />
                    <span></span>
                </button>
            </div>
        </l-control>
        <l-control-zoom />
        <l-control class="my-controls" v-if="!fromViewTree">
            <button class="location" @click="goToMyLocation">
                <img src="../../../../assets/images/my-location.png" alt="location" />
            </button>
            <button class="add-points" @click="togglePolygonCreationMode">
                <img src="../../../../assets/images/add-zones.png" alt="add-zones" />
            </button>
        </l-control>
        <l-layer-group>
            <l-polygon v-for="(zone, index) in mapRegions" :ikey="`inventar${index}`" :lat-lngs="zone.coordinates" :color="color" :options="polygonOptions" @click="onZone(zone,zone.id,index)">
                <!-- <l-tooltip ref="tooltip">{{ zone.inventoryId }}</l-tooltip> -->
                <!-- <l-popup
            ref="popup"
            :content="JSON.stringify(zone.name)"
            :options="popupOptions"
          ></l-popup> -->
                <l-tooltip :options="{permanent: true, direction: 'center'}">{{ zone.name }}</l-tooltip>
            </l-polygon>
            <l-polygon v-for="(zone, index) in AreaRegions" :key="`area${index}`" :lat-lngs="zone.coordinates" :color="zone.colorTypeId" :fillColor="zone.colorTypeId" :options="polygonOptionsArea" @click="onZone(zone,zone.id,index)">
                <!-- <l-tooltip ref="tooltip">{{ zone.inventoryId }}</l-tooltip> -->
                <!-- <l-popup
            ref="popup"
            :content="JSON.stringify(zone.name)"
            :options="popupOptions"
          ></l-popup> -->
                <l-tooltip :options="{permanent: true, direction: 'center'}">area - {{ zone.areaId }}</l-tooltip>
            </l-polygon>
            <l-polygon v-for="(zone, index) in treeRegions" :key="`tree${index}`" :lat-lngs="zone.coordinates" :color="zone.colorTypeId" :fillcolor="zone.colorTypeId" :options="getPolygonOptions(zone.crownDiameter, zone.id)" @click="onZone(zone,zone.id,index)">
                    <l-tooltip v-if="zoom >= 19" :options="{permanent: true, direction: 'center',className: 'custom-polygon'}">{{ zone.name }}</l-tooltip>
            </l-polygon>

            <l-polyline v-if="polygonPoints.length > 1" :lat-lngs="polygonPoints" :color="color" :options="polylineOptions">
                <template v-for="(point, index) in polygonPoints">
                    <l-marker :key="'marker-' + index" :lat-lng="point" :draggable="true" @dragend="(event) => onMarkerDragEnd(event, index)">
                        <l-icon :icon-size="[25, 41]" :icon-anchor="[13, 41]" :icon-url="'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png'">
                            <div style="
                    font-size: 12px;
                    color: white;
                    background: black;
                    text-align: center;
                    line-height: 1.5;">
                                {{ index + 1 }}
                            </div>
                        </l-icon>
                    </l-marker>
                </template>
            </l-polyline>
            <template v-for="(point, index) in markers" >
              
            <l-marker  :key="'marker-' + index" :lat-lng="point" :draggable="false" class="markerTree">
                <l-icon :icon-size="[25, 41]" :icon-anchor="[13, 41]" :icon-url="require('@/assets/images/tree-icon.svg')" >
                </l-icon>
            </l-marker>
            </template>
            <template v-if="treeCoordinates" >
              
              <l-marker :lat-lng="treeCoordinates" :draggable="false" class="markerTree">
                  <l-icon :icon-size="[25, 41]" :icon-anchor="[13, 41]" :icon-url="require('@/assets/images/tree-icon.svg')" >
                  </l-icon>
              </l-marker>
              </template>

        </l-layer-group>
    </l-map>
</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";
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
    LMarker,
    LPolyline
} from "vue2-leaflet";
import axios from "axios";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import {
    Icon
} from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw";
import L from "leaflet";
import * as turf from '@turf/turf';

export default {
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
        LMarker,
        LPolyline
    },
    props: ['centerr', 'coordinates', 'treeCoordinates' ,'whichForm','from','fromViewTree','treeId','isTree','areaId','taskId','year'],
    data() {
        return {
            centerMapDynamically: null,
            maxZoom: 25,
            mapKey: 0,
            center: [51.49, -0.05], // set your initial center
            url: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, // set your tile layer URL
            apikey: "AIzaSyC27AbpxpWs0UKZEzUcq-qQ4zDcI_D4jKo",
            currentLayer: {
                name: "",
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            },
            clickLatLngs: [],
            isCreatingPolygon: false,
            polygonPoints: [],
            redoPolygonPoints: [],
            mapRegions: [],
            AreaRegions: [],
            treeRegions: [],
            polygonOptions: {
                fillColor: "#FFFFFF",
                color: "#494949",
                weight: 3,
                opacity: 0.6,
                fillOpacity: 0.6,
            },
            polygonOptionsArea: {
                weight: 1,
                border: "3px solid #A4A4A4",
                opacity: 0.6,
                fillOpacity: 0.6,
            },
            polygonOptionsTree: {
                fillColor: "#A4A4A4",
                color: "#A4A4A4",
                weight: 200,
                border: "3px solid #A4A4A4",
                opacity: 0.6,
                fillOpacity: 0.6
            },
            polylineOptions: {},
            popupOptions: {
                closeButton: false,
                autoClose: false,
                autoOpenPopup: true,
            },
            color: "#A4A4A4",
            layers: [{
                name: "Regions",
                active: true,
                leafletLayer: null,
                layer: L.layerGroup(),
            }, ],
            zoom: 0, // Initial zoom
            markers: [],
            markerAdded: false,
            formType:""
        };
    },
    computed: {
        ...mapGetters(["mapRegionData", "error", "loggedInUser", "inventarId"]),
        checkForm(){
          if(this.whichForm == "bereich"){
            this.markers = []
          }
        }
    },
    methods: {
          getPolygonOptions(size, id) {
            let scaledSize;
            if(size < 10) {
                let growSize = size + 1
                scaledSize = growSize * 8.3;
            }
            
            else {
            scaledSize = size * 1.3;
            }
            const strokeWidth = id === this.clickedZoneId ? 3 : scaledSize;
            return {
                fillColor: this.color,
                color: this.color,
                weight: strokeWidth, // Bind weight property to a dynamic value (e.g., size)
                border: `${3}px solid ${this.color}`, // Bind border property to a dynamic value
                opacity: 0.6,
                fillOpacity: 0.6,
                // className: "custom-polygon",
            };
        },
        onZone(zone, id, index) {
            console.log(zone);
        },
        onMarkerDragEnd(event, index) {
            // this.$set(this.polygonPoints, index, latlng);
            const latlng = event.target.getLatLng();
            const newLat = latlng.lat;
            const newLng = latlng.lng;
            this.$set(this.polygonPoints, index, [newLat, newLng]);
            this.savePolygon();
        },
        goToMyLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const latlng = [position.coords.latitude, position.coords.longitude];
                    this.$refs.map.mapObject.setView(latlng, 15); // Set the map view to your location with zoom level 15
                });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        },

        onMapReady() {
            this.mapReady = true;
            if (this.coordinates) {
                this.centerMapOnZoneFromIn();
            } else {

                this.centerMapOnZone();
            }
        },
        centerMapOnZone() {
            // Find the average latitude and longitude of all points in the zone

            if (this.centerMapDynamically != null) {
                const latlngBounds = L.latLngBounds(this.centerMapDynamically);
                const center = latlngBounds.getCenter();

                // Use Leaflet's fitBounds method to set the map view to display the entire zone
                this.$refs.map.mapObject.fitBounds(latlngBounds);

                // Update the component's center and zoom properties to reflect the new map view
                this.center = [center.lat, center.lng];
                this.zoom = this.$refs.map.mapObject.getZoom();
            }
        },
        //  onMapClick(event) {
        //     if (this.isCreatingPolygon) {
        //         const latlng = event.latlng;
        //         this.polygonPoints.push([latlng.lat, latlng.lng]);
        //         if (this.polygonPoints.length > 1) {
        //             const lastIndex = this.polygonPoints.length - 1;
        //             const lastPoint = this.polygonPoints[lastIndex];
        //             const previousPoint = this.polygonPoints[lastIndex - 1];
        //             const polyline = L.polyline(
        //                 [previousPoint, lastPoint],
        //                 this.polylineOptions
        //             );
        //             polyline.addTo(this.$refs.map.mapObject);
        //             this.savePolygon();
        //         }
        //     }
        // },
        onMapClick(event) {
            
          if(this.whichForm == "baum"){
             if (this.isCreatingPolygon) {
                const latlng = event.latlng;
                this.markers.push([latlng.lat, latlng.lng]);
                if(this.markers.length > 1){
                      this.markers.shift();
               } 
                this.saveMarker([latlng.lat, latlng.lng]);
                this.markerAdded = true;
                this.getTreeMapRegionsFromClickOfUser([latlng.lat, latlng.lng])
            }
          } else {
            if (this.isCreatingPolygon) {
                this.markers = []
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
          }
           
        },
        saveMarker(marker) {
          console.log("marker",marker);
            // Save the marker or send its coordinates to the database
            // You can modify this method to suit your needs
            this.$emit("latlngs-updated", marker);

        },
        resetMap() {
            const map = this.$refs.map.mapObject;
            map.eachLayer((layer) => {
                if (layer instanceof L.Polyline) {
                    const latlngs = layer.getLatLngs().flat();
                    const coords = this.polygonPoints.map((point) => L.latLng(point));
                    if (JSON.stringify(latlngs) === JSON.stringify(coords)) {
                        map.removeLayer(layer);
                    }
                }
            });

            // Reset the polygon points array
            this.polygonPoints = [];
            this.$emit("latlngs-updatedArea", this.polygonPoints);
            this.savePolygon();
        },
        undoPolygon() {
            if (this.polygonPoints.length === 0) {
                return;
            }

            const map = this.$refs.map.mapObject;

            // Remove the last polyline from the map
            let lastPolyline;
            map.eachLayer((layer) => {
                if (layer instanceof L.Polyline) {
                    lastPolyline = layer;
                }
            });
            if (lastPolyline) {
                map.removeLayer(lastPolyline);
            }

            // Store the last removed polygon in a variable for redo functionality
            const lastPolygonPoints = this.polygonPoints.pop();

            // Update the polygonPoints array and emit the updated value
            this.$emit("latlngs-updatedArea", this.polygonPoints);

            // Optionally, you can also call this.savePolygon() here to update your data model.

            // Implement redo functionality by storing the last removed polygon in a variable
            // and adding it back to the map.
            this.redoPolygonPoints.push(lastPolygonPoints);
            this.savePolygon();
        },
        redoPolygon() {
            if (this.redoPolygonPoints && this.redoPolygonPoints.length > 0) {
                const map = this.$refs.map.mapObject;

                // Get the last removed polygon from the redoPolygonPoints array
                const lastPolygonPoints = this.redoPolygonPoints.pop();

                if (lastPolygonPoints) {
                    // Add the polygon back to the polygonPoints array and emit the updated value
                    this.polygonPoints.push(lastPolygonPoints);
                    this.$emit("latlngs-updatedArea", this.polygonPoints);

                    // Create a polyline for the last polygon and add it to the map
                    const polyline = L.polyline(lastPolygonPoints, this.polylineOptions);
                    polyline.addTo(map);
                    this.savePolygon();
                }
            }
        },

        togglePolygonCreationMode() {
            this.isCreatingPolygon = !this.isCreatingPolygon;
            if (this.isCreatingPolygon) {
                this.polygonPoints = [];
            }
        },
        closeIsCreatingPolygonMode() {
            this.isCreatingPolygon = false;
        },
        fullScreenMap() {
        this.$router.push({
            name: "TreeList",
            params: { isTree: this.isTree, treeId: this.treeId, areaId: this.areaId, coord: this.inventarCoordinates, treeCord:this.treeCoordinates,from:this.from, taskId:this.taskId, year:this.year }
          });
        },
        savePolygon() {
            // Send the polygonPoints array to the database
            // and store the new polygon in this.mapRegions
            this.mapRegions.push({
                coordinates: this.polygonPoints,
            });

            this.$emit("latlngs-updatedArea", this.polygonPoints);
        },
        handeldata(data) {
            this.mapKey += 1;
            setTimeout(() => {
                this.center = data;
            }, 100);
        },
        ...mapActions(["mapRegion", "addTreeCoordinates"]),
       async setMapDataRegions() {
           await axios
                .get("https://tilia.rrota.org/api/Inventory/MapRegion")
                .then((response) => {
                    this.mapRegions = response.data;

                })
                .catch((error) => {
                    // Handle Errors here.
                    // var errorCode = error.code;
                    // var errorMessage = error.message;
                    console.log(error);

                    // ...
                });
        },
        async setMapDataAreaRegions() {
            await axios
                .get(`https://tilia.rrota.org/api/Tree/MapRegion/${this.inventarId}`)
                .then((response) => {

                    this.AreaRegions = response.data.areaRegions;

                })
                .catch((error) => {
                    // Handle Errors here.
                    // var errorCode = error.code;
                    // var errorMessage = error.message;
                    console.log(error);

                    // ...
                });
        },

        async setMapDataTreeRegions() {
                if(this.from == 'edit' || this.from == 'baumProfil'){
                    try {
                const response = await axios.get(`https://tilia.rrota.org/api/Tree/MapRegion/${this.inventarId}`);
                const treeRegions = response.data.treeRegions;
                // console.log("ciird",this.treeCoordinates);
                const centerCoordinate = this.treeCoordinates;
                const radius = 50; // Radius in meters

                // Filter treeRegions based on nearest polygons
                const filteredTreeRegions = treeRegions.filter(tree => {
                const treeCoordinate = tree.coordinates;
                const distance = turf.distance(centerCoordinate, treeCoordinate, { units: 'meters' });
                return distance <= radius;
                });

                // Convert single coordinate pair to an array of arrays
                const data = filteredTreeRegions.map(region => {
                return {
                    ...region,
                    coordinates: [region.coordinates],
                };
                });

                console.log("data",data);

                this.treeRegions = data;
            } catch (error) {
                console.log(error);
            }
                } else {
                    return
                }
            },

            async getTreeMapRegionsFromClickOfUser(latlng) {
                if(this.from == 'create'){
                    try {
                const response = await axios.get(`https://tilia.rrota.org/api/Tree/MapRegion/${this.inventarId}`);
                const treeRegions = response.data.treeRegions;
                // console.log("ciird",this.treeCoordinates);
                const centerCoordinate = latlng;
                const radius = 50; // Radius in meters

                // Filter treeRegions based on nearest polygons
                const filteredTreeRegions = treeRegions.filter(tree => {
                const treeCoordinate = tree.coordinates;
                const distance = turf.distance(centerCoordinate, treeCoordinate, { units: 'meters' });
                console.log("distanca",distance);
                return distance <= radius;
                });

                // Convert single coordinate pair to an array of arrays
                const data = filteredTreeRegions.map(region => {
                return {
                    ...region,
                    coordinates: [region.coordinates],
                };
                });

                console.log("data",data);

                this.treeRegions = data;
            } catch (error) {
                console.log(error);
            }
                } else {
                    return
                }
            },

        centerMapOnZoneFromIn() {
            // Find the average latitude and longitude of all points in the zone
            const latlngs = JSON.parse(this.coordinates);
            const latlngBounds = L.latLngBounds(latlngs);
            const center = latlngBounds.getCenter();

            // Use Leaflet's fitBounds method to set the map view to display the entire zone
            this.$refs.map.mapObject.fitBounds(latlngBounds);

            // Update the component's center and zoom properties to reflect the new map view
            this.center = [center.lat, center.lng];
            this.zoom = this.$refs.map.mapObject.getZoom();
        },
        onZoomEnd() {
            this.zoom = this.$refs.map.mapObject.getZoom(); // Update the zoom property
            this.updateTooltipFontSize(); // Update the font size of the tooltip
        },
        updateTooltipFontSize() {
            const customPolygons = document.querySelectorAll(".custom-polygon");
            customPolygons.forEach((polygon) => {
                const tooltip = polygon.querySelector(".leaflet-tooltip");
                if (tooltip) {
                    const fontSize = Math.round(polygon.style.weight * 0.1); // Calculate the font size based on the polygon's weight
                    tooltip.style.fontSize = `${fontSize}px`; // Set the font size of the tooltip
                }
            });
        },
      handleCustomForm(form){
        console.log("form",form);
        this.formType = form
      }
    },
    created() {
        
        this.setMapDataAreaRegions()
        this.setMapDataTreeRegions()
        this.setMapDataRegions();



    },


watch: {
  checkForm(newVal){
    return newVal
  }
},
    beforeUnmount() {
        // Remove the zoomend event listener before unmounting the component
        this.$refs.map.mapObject.off("zoomend", this.onZoomEnd);
    },
    mounted() {
    // this.$parent.$on('form-event', this.handleCustomForm); 
    
    console.log("from",this.from);

        
        this.$refs.map.mapObject.on("zoomend", this.onZoomEnd);
        this.$parent.$on('send-cordinates', (dataFromParent) => {

            const latlngBounds = L.latLngBounds(dataFromParent);
            const center = latlngBounds.getCenter();

            // Use Leaflet's fitBounds method to set the map view to display the entire zone
            this.$refs.map.mapObject.fitBounds(latlngBounds);

            // Update the component's center and zoom properties to reflect the new map view
            this.center = [center.lat, center.lng];
            this.zoom = this.$refs.map.mapObject.getZoom();

        });
        this.$parent.$on("my-event", this.handeldata);
        this.mapRegions.forEach((el, index) => this.$refs.popup[index].openPopup());
    },
};
</script>

<style lang="scss">


.map {
    width: 100%;
    height: calc(100vh - 75px);

    .highlighted {
    fill-opacity: 1 !important;
    stroke-width: 80 !important;
    stroke-color: red !important;
}

    .custom-icon {
        background-image: none !important;
    }

    .tooltip-content {
        font-size: 12px !important;
    }

    .custom-polygon-highlighted {
        color: blue;
    }

    .topright-fullScreenMap {
        padding: 8px;
        position: absolute;
        top: -10px;
        right: -10px;
        background-color: #2A2B2A;
        opacity: 0.8;
    }

    .leaflet-control-attribution {
        display: none !important;
    }

    .leaflet-tooltip {
        background-color: transparent;
        border: 0;
        // font-size: 22px;
        box-shadow: none;
        font-style: normal;
        font-weight: 600;
        line-height: 30px;
        color: #2A2B2A;
    }

    .leaflet-control-zoom-in,
    .leaflet-control-zoom-out {
        background-color: #fff;
    }

    .leaflet-left .leaflet-control-zoom {
        display: none;
    }

    .leaflet-right .leaflet-control-zoom {
        position: relative;
        top: 271px;
        right: -10px;
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
        position: relative;
        top: 261px;
        right: -10px;
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

    .topright {
        position: relative;
        top: -180px;
        right: -10px;

        .undo-redo-clean {
            background: #2a2b2a;
            opacity: 0.8;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;

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
}
</style>
