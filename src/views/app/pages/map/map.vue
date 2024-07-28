<template>
<div class="map">
    <l-map :zoom="zoom" :key="mapKey" :center="center" @click="onMapClick" ref="map" @ready="onMapReady">
        <l-tile-layer :url="currentLayer.url" :attribution="currentLayer.attribution"></l-tile-layer>
        <l-control v-if="notHaveCoordinate" class="without-coordinate">
            <div>
                Dieses Inventar hat keine Koordinaten und kann nicht auf der Karte eingezeichnet werden! 
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
                <button class="btn" @click="closeIsCreatingPolygonMode" style="width:44px;height:44px">
                    <img src="../../../../assets/images/close_white_border.png" alt="location" />
                    <span></span>
                </button>
            </div>
        </l-control>
        <l-control-zoom />
        <l-control class="my-controls">
            <button class="location" @click="goToMyLocation">
                <img src="../../../../assets/images/my-location.png" alt="location" />
            </button>
            <button class="add-points" @click="togglePolygonCreationMode">
                <img src="../../../../assets/images/add-zones.png" alt="add-zones" />
            </button>
        </l-control>
        <l-layer-group>
            <l-polygon v-for="(zone, index) in mapRegions" :key="index" :lat-lngs="zone.coordinates" :color="color" :options="polygonOptions" @click="onZone(zone,zone.id,index)">
                <!-- <l-tooltip ref="tooltip">{{ zone.inventoryId }}</l-tooltip> -->
                <!-- <l-popup
            ref="popup"
            :content="JSON.stringify(zone.name)"
            :options="popupOptions"
          ></l-popup> -->
                <l-tooltip :options="{permanent: true, direction: 'center'}">{{ zone.name }}</l-tooltip>
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
                    line-height: 1.5;
                  ">
                                {{ index + 1 }}
                            </div>
                        </l-icon>
                    </l-marker>
                </template>
            </l-polyline>
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
    },
    props:

        ['centerr', 'coordinates'],
    data() {
        return {
            centerMapDynamically: null,
            zoom: 12,
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
            polygonOptions: {
                fillColor: "#A4A4A4",
                color: "#A4A4A4",
                weight: 1,
                border: " 3px solid #A4A4A4",
                opacity: 0.6,
                fillOpacity: 0.6,
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
            notHaveCoordinate:false
        };
    },
    computed: {
        ...mapGetters(["mapRegionData", "error", "loggedInUser"]),
    },
    methods: {
        onZone(zone, id, index) {
            console.log(zone);
        },
        onMarkerDragEnd(event, index) {
            // this.$set(this.polygonPoints, index, latlng);
            const latlng = event.target.getLatLng();
            console.log(latlng);
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
                console.log(this.centerMapDynamically);
                const center = latlngBounds.getCenter();

                // Use Leaflet's fitBounds method to set the map view to display the entire zone
                this.$refs.map.mapObject.fitBounds(latlngBounds);

                // Update the component's center and zoom properties to reflect the new map view
                this.center = [center.lat, center.lng];
                this.zoom = this.$refs.map.mapObject.getZoom();
            }
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
            this.$emit("latlngs-updated", this.polygonPoints);
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
            this.$emit("latlngs-updated", this.polygonPoints);

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
                    this.$emit("latlngs-updated", this.polygonPoints);

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
        savePolygon() {
            // Send the polygonPoints array to the database
            // and store the new polygon in this.mapRegions
            this.mapRegions.push({
                coordinates: this.polygonPoints,
            });
            this.$emit("latlngs-updated", this.polygonPoints);
            console.log("regions", this.mapRegions);
        },
        handeldata(data) {
            console.log("d", data);
            this.mapKey += 1;
            setTimeout(() => {
                this.center = data;
            }, 100);
        },
        ...mapActions(["mapRegion"]),
        setMapDataRegions() {
            axios
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
    },
    created() {

        this.setMapDataRegions();

    },
    watch: {},
    mounted() {
        this.$parent.$on('send-cordinates', (dataFromParent) => {

            if(dataFromParent.length == 0) {
                this.notHaveCoordinate = true
            } else {
                const latlngBounds = L.latLngBounds(dataFromParent);
            const center = latlngBounds.getCenter();

            // Use Leaflet's fitBounds method to set the map view to display the entire zone
            this.$refs.map.mapObject.fitBounds(latlngBounds);

            // Update the component's center and zoom properties to reflect the new map view
            this.center = [center.lat, center.lng];
            this.zoom = this.$refs.map.mapObject.getZoom();
            }

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
    .leaflet-control-attribution{
        display: none !important;
    }
    .without-coordinate{
        color: #2A2B2A;
        font-size: 20px;
        margin-top: 10px;
        margin-left: 20px;
        text-align: center;
        background: #fff;        
    }
    .leaflet-tooltip {
        background-color: transparent;
        border: 0;
        font-size: 22px;
        box-shadow: none;
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
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
         position: absolute;
         top: -10px;
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
