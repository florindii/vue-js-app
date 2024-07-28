<template>
<v-container fluid d-flex>
    <div class="left-side" v-if="this.$route.params.isTree != null && this.$route.params.treeId != null && this.$route.params.areaId != null">
        <img src="../../../../assets/images/arrow-right-white.png" alt="arrow-right-white" @click="closeViewMap"/>
        <h2 @click="closeViewMap">Karte schließen</h2>
    </div>
    <div class="map">

        <l-map :maxZoom="maxZoom" :key="mapKey" :center="center" @click="onMapClick" ref="map" @ready="onMapReady">
            <l-tile-layer :url="currentLayer.url" :attribution="currentLayer.attribution"></l-tile-layer>

            <l-control class="topright">
                <div class="undo-redo-clean dark-bg">
                    <button class="btn close" @click="closeViewMap" v-if="this.$route.params.isTree != null && this.$route.params.treeId != null && this.$route.params.areaId != null">
                        <img class="close-btn-img" src="../../../../assets/images/close_white_border.png" alt="location" width="32px" height="32px" />
                        <span></span>
                    </button>
                </div>
            </l-control>
            <l-control-zoom />
            <l-control class="my-controls">
                <button class="location" @click="goToMyLocation">
                    <img src="../../../../assets/images/my-location.png" alt="location" />
                </button>
            </l-control>
            <l-layer-group>
                <l-polygon v-for="(zone, index) in AreaRegions" :key="`area${index}`" :lat-lngs="zone.coordinates" :color="zone.colorTypeId" :fillColor="zone.colorTypeId" :options="polygonOptionsArea" @click="onArea(zone, $event)">
                    <l-popup ref="popup" :close-button="false" :options="popupOptions">
                        <div class="popup-content">
                            <div class="title">
                                <img src="../../../../assets/images/map-icon-viewed.png" alt="map-icon" width="27px" height="25px" />
                                <h2>Basel-Kloster Wettingen</h2>
                            </div>

                            <div class="informations" v-if="areaInfo">
                                <div class="popup-description">
                                    <span>ID:</span>
                                    <span> {{ areaInfo.id }} </span>
                                </div>
                                <div class="popup-description">
                                    <span>Abkürzung</span>
                                    <span>{{ areaInfo.abbreviation }}</span>
                                </div>
                                <div class="popup-description">
                                    <span>Latein:</span>
                                    <span> {{ areaInfo.treeTypeLatinName }} </span>
                                </div>
                                <div class="popup-description">
                                    <span>Baumhöhe:</span>
                                    <span> {{ areaInfo.technicalDatas[0].treeHeight }}</span>
                                </div>
                                <div class="popup-description">
                                    <span>Kronen Ø:</span>
                                    <span> {{ areaInfo.technicalDatas[0].crownDiameter }}</span>
                                </div>
                                <div class="popup-description">
                                    <span>Baumhöhe:</span>
                                    <span> {{ areaInfo.technicalDatas[0].trunkCircumference }}</span>
                                </div>
                                <div class="popup-description">
                                    <span>Baumkontrolle:</span>
                                </div>
                                <div class="popup-description">
                                    <span>Kronenverankerung:</span>
                                </div>
                                <div class="popup-description">
                                    <span>Kronenbegrenzungsschnitt:</span>
                                </div>
                            </div>
                            <div v-else>Loading...</div>
                            <div class="footer-links">
                                <button class="btn" @click.prevent="closeViewMap">
                                    Ansicht
                                </button>
                            </div>
                        </div>
                    </l-popup>
                    <l-tooltip :options="{permanent: true, direction: 'center'}">area - {{ zone.areaId }}</l-tooltip>
                </l-polygon>
                <l-polygon v-for="(zone, index) in treeRegions" :key="`tree${index}`" :lat-lngs="zone.coordinates" :color="zone.colorTypeId" :options="getPolygonOptions(zone.crownDiameter, zone.id)" @click="onTree(zone, $event)" style="z-index:999">
                    <l-popup ref="popup" :close-button="false" :options="popupOptions" >
                        <div class="popup-content">
                            <div class="title">
                                <img src="../../../../assets/images/map-icon-viewed.png" alt="map-icon" width="27px" height="25px" />
                                <h2>Basel-Kloster Wettingen</h2>
                            </div>

                            <div class="informations" v-if="treeInfo">
                                <div class="popup-description">
                                    <span>ID:</span>
                                    <span> {{ treeInfo.id }} </span>
                                </div>
                                <div class="popup-description">
                                    <span>Abkürzung</span>
                                    <span>{{ treeInfo.abbreviation }}</span>
                                </div>
                                <div class="popup-description">
                                    <span>Latein:</span>
                                    <span> {{ treeInfo.treeTypeLatinName }} </span>
                                </div>
                                <div class="popup-description">
                                    <span>Baumhöhe:</span>
                                    <span> {{ treeInfo.technicalDatas[0].treeHeight }}</span>
                                </div>
                                <div class="popup-description">
                                    <span>Kronen Ø:</span>
                                    <span> {{ treeInfo.technicalDatas[0].crownDiameter }}</span>
                                </div>
                                <div class="popup-description">
                                    <span>Baumhöhe:</span>
                                    <span> {{ treeInfo.technicalDatas[0].trunkCircumference }}</span>
                                </div>
                                <div class="popup-description">
                                    <span>Baumkontrolle:</span>
                                </div>
                                <div class="popup-description">
                                    <span>Kronenverankerung:</span>
                                </div>
                                <div class="popup-description">
                                    <span>Kronenbegrenzungsschnitt:</span>
                                </div>
                            </div>
                            <div v-else>loading...</div>

                            <div class="footer-links">
                                <button class="btn" @click.prevent="closeViewMap">
                                    Ansicht
                                </button>
                            </div>
                        </div>
                    </l-popup>
                    <l-tooltip v-if="zoom >= 19" :options="{permanent: true, direction: 'center',className: 'custom-polygon'}">{{ zone.name }}</l-tooltip>
                </l-polygon>
                <l-polygon v-for="(zone, index) in mapRegions" :ikey="`inventar${index}`" :lat-lngs="zone.coordinates" :color="color" :options="polygonOptions" style="z-index:0">
                </l-polygon>
                <template v-if="treeCoordinates" >
              
              <l-marker :lat-lng="treeCoordinates" :draggable="true" class="markerTree">
                  <l-icon :icon-size="[25, 41]" :icon-anchor="[13, 41]" :icon-url="require('@/assets/images/tree-icon.svg')" >
                  </l-icon>
              </l-marker>
              </template>
             
            </l-layer-group>
        </l-map>
    </div>
</v-container>
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
    props: ['centerr', 'coordinates', 'whichForm'],
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
            formType: "",
            treeInfo: null,
            areaInfo:null,
            clickedZoneId: null,
            openTreePopup: false,
            openAreaPopup: false,
            skip: 0,
            take: 400,
            zoomi:null,
            treeCoordinates:null,
            fromWhere:null,
            taskId:null,
            year:null
        };
    },
    computed: {
        ...mapGetters(["mapRegionData", "error", "loggedInUser", "inventarId", "inventarCoordinates"]),
        checkForm() {
            if (this.whichForm == "bereich") {
                this.markers = []
            }
        }
    },
    methods: {
        closeViewMap() {
            if(this.fromWhere == "TaskProfile"){
                this.$router.push({
                name: "TaskProfil",
                params: {
                    isTree: this.$route.params.isTree,
                    treeId: this.$route.params.treeId,
                    areaId: this.$route.params.areaId,
                    taskId: this.$route.params.taskId,
                    year: this.$route.params.year
                }
            });
            } else {
                this.$router.push({
                name: "BaumProfil",
                params: {
                    isTree: this.$route.params.isTree,
                    treeId: this.$route.params.treeId,
                    areaId: this.$route.params.areaId
                }
            });
            }
        },
        getPolygonOptions(size, id) {
            let scaledSize;
            if(size < 10) {
             scaledSize = (size +1) * 8.3;
            } else {
             scaledSize = (size + 1) * 1.3;
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
        onArea(zone, event) {
            console.log("clicku");
            this.clickedZoneId = zone.id;
            this.openAreaPopup = true;
            axios
                .get(`https://tilia.rrota.org/api/Tree/GetArea/${this.inventarId}/${zone.areaId}`)
                .then(response => {
                    console.log("area", response);
                    this.areaInfo = response.data

                })
                .catch(error => {
                    console.log("error", error);
                })
        },
        onTree(zone, event) {
            this.clickedZoneId = zone.treeId;
            this.openTreePopup = true

            if(this.treeInfo == null) {
                axios
                .get(`https://tilia.rrota.org/api/Tree/GetTree/${zone.inventoryId}/${zone.treeId}`)
                .then(response => {
                    this.treeInfo = response.data
                    console.log("hyni nget",response);
                })
                .catch(error => {
                    console.log("error", error);
                })
            } else {
                console.log("tre",this.treeInfo);
            }

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

            this.centerMapOnZoneFromIn();

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
            if (this.whichForm == "baum") {
                if (this.isCreatingPolygon) {
                    const latlng = event.latlng;
                    this.markers.push([latlng.lat, latlng.lng]);
                    if (this.markers.length > 1) {
                        this.markers.shift();
                    }
                    this.saveMarker([latlng.lat, latlng.lng]);
                    this.markerAdded = true;
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
            console.log("marker", marker);
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
        setMapDataAreaRegions() {
            axios
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

        setMapDataTreeRegions() {
         
            axios
                .get(`https://tilia.rrota.org/api/Tree/MapRegion/${this.inventarId}?skip=${this.skip}&take=${this.take}`)
                .then((response) => {
                    let data;
                         data = response.data.treeRegions.map(region => {
                        return {
                            ...region,
                            coordinates: [region.coordinates], // Convert single coordinate pair to an array of arrays
                        };
                    })
                    console.log("data",data);
                    // Update the skip value for the next request
                    this.skip += this.take;

                    // Append the new data to the existing treeRegions array
                    this.treeRegions = [...this.treeRegions, ...data];

                    // this.skip =  this.treeRegions.length - 1    

                    console.log("tree",this.treeRegions);
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
            const latlngs = JSON.parse(this.inventarCoordinates);
            const latlngBounds = L.latLngBounds(latlngs);
            const center = latlngBounds.getCenter();
            // Use Leaflet's fitBounds method to set the map view to display the entire zone
            this.$refs.map.mapObject.fitBounds(latlngBounds);

            // Update the component's center and zoom properties to reflect the new map view
            this.center = [center.lat, center.lng];
            this.zoom = 14;
        },
        onZoomEnd() {
            this.zoom = this.$refs.map.mapObject.getZoom(); // Update the zoom property
            this.updateTooltipFontSize(); // Update the font size of the tooltip
            console.log("zoom",this.zoom);
                this.setMapDataTreeRegions()
            
        },
        updateTooltipFontSize() {
            const customPolygons = document.querySelectorAll(".custom-polygon");
            console.log("custom polygn",customPolygons);
            customPolygons.forEach((polygon) => {
                const tooltip = polygon.querySelector(".leaflet-tooltip");
                console.log("tooltip",polygon);
                if (tooltip) {
                    console.log("polgon",polygon);
                    const fontSize = Math.round(polygon.style.weight * 0); // Calculate the font size based on the polygon's weight
                    tooltip.style.backgroundColor = `${fontSize}px`; // Set the font size of the tooltip
                }
            });
        },
        handleCustomForm(form) {
            console.log("form", form);
            this.formType = form
        }
    },
    created() {
        this.setMapDataRegions();

    },

    watch: {
        checkForm(newVal) {
            return newVal
        },
        zoomi:{
           handler(newVal, oldVal) {
            console.log("newVal",newVal);
        }
        }
    },
    // beforeUnmount() {
    //     // Remove the zoomend event listener before unmounting the component
    //     this.$refs.map.mapObject.off("zoomend", this.onZoomEnd);
    // },
    mounted() {
        this.treeCoordinates = this.$route.params.treeCord;
        this.fromWhere = this.$route.params.from
         this.zoomi = this.$refs.map.mapObject.getZoom();
        this.setMapDataAreaRegions()
        // this.setMapDataTreeRegions()
        // this.$parent.$on('form-event', this.handleCustomForm); 
        console.log("parametrat prej routit",this.$route.params);
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
                
    },
};
</script>

    
<style lang="scss">
.left-side {
    height: calc(100vh - 75px);
    width: 43px;

    img {
        margin-top: 116px;
        margin-bottom: 32px;
        cursor: pointer;
    }

    h2 {
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
                        margin-top: 10px;
                        border-bottom: 1px solid #494949;
                    }

                    .footer-links {
                        margin-top: 20px;
                        display: flex;
                        justify-content: flex-end;

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

    .dark-bg {
        background-color: #2A2B2A;
        opacity: 0.8;
    }

    width: 100%;
    height: calc(100vh - 75px);

    .custom-icon {
        background-image: none !important;
    }

    .tooltip-content {
        font-size: 12px !important;
    }

    .leaflet-control-attribution {
        display: none !important;
    }

    // .leaflet-tooltip {
    //     background-color: transparent;
    //     border: 0;
    //     box-shadow: none;
    //     font-style: normal;
    //     color: #2A2B2A;
    // }

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

            .close-btn-img {
                position: absolute;
                left: 10px;
            }

            .btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 10px;
                border-right: 1px solid #a4a4a4;
                padding-right: 10px;
                cursor: pointer;
                width: 32px;
                height: 32px;
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
