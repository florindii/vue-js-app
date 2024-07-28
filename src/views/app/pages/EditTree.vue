<template>
<div class="wrapper">
    <v-card class="left-side-edit-tree">
        <v-container fluid>
            <div class="link-control mt-4">
                <a href="#" v-show="userCanDelete" class="abbrechen" @click.prevent="openDeleteDialog"> <img src="../../../assets/images/delete-icon.png" alt=""> <span>Löschen</span></a>
                <a href="#" class="abbrechen" @click.prevent="cancelDialog = true">Abbrechen</a>
            </div>
            <v-sheet class="mx-auto" v-if="inline == 'baum'">
                <v-form ref="baumForm" class="baum-form">
                    <v-row class="mt-4">
                        <v-col cols="6">
                            <label for="Inventory:">BaumID*</label>
                            <v-text-field v-model="createTree.name" type="text" :rules="nameRules" outlined clearable hide-details required></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <label for="Inventory:">Baumart*</label>
                            <v-select v-model="selectedTreeTypeId" :items="treeType" item-value="id" :item-text="item => `${item.abbreviation} - ${item.germanName}`" :rules="[(v) => !!v || 'Item is required']" outlined clearable hide-details required @change="selectTreeTypeId(selectedTreeTypeId)">
                            </v-select>
                        </v-col>
                    </v-row>
                    <v-row class="mt-4">
                        <v-col cols="6">
                            <label for="Koord SN*">Koord SN*</label>
                            <v-text-field v-model.number="createTree.treeLatitude" type="number" :rules="numberRules" outlined clearable hide-details required></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <label for="Koord WE*">Koord WE*</label>
                            <v-text-field v-model.number="createTree.treeLongitude" type="number" :rules="numberRules" outlined clearable hide-details required></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class="mt-4">
                        <v-col class="location-point d-flex">
                            <p class="locate">oder</p>
                            <img src="../../../assets/images/location-point.png" alt="location-point" class="img" />
                            <a @click.prevent="getCoordinatesFromMyLocation" class="link">Meinen Standort ermitteln</a>
                        </v-col>
                    </v-row>

                    <v-row class="mt-12">
                        <v-col cols="12">
                            <label for="Inventory:">Bedeutung*</label>
                            <v-select v-model="selectedMeaningTypeId" :items="meaningTypes" item-value="id" :item-text="item => `${item.name}/${item.abbreviation}`" :rules="[(v) => !!v || 'Item is required']" outlined clearable hide-details required @change="selectedMeaning(selectedMeaningTypeId)"></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-radio-group v-model="selectedOption" class="custom-radio-btn">
                                <v-col cols="6">
                                    <v-radio :label="optionsPlaceType.markant" value="Markant"></v-radio>
                                <v-radio class="mt-4" :label="optionsPlaceType.privat" value="Privat"></v-radio>
                                </v-col>
                                <v-col cols="6">
                                    <v-radio :label="optionsPlaceType.strassenbaum" value="Strassenbaum"></v-radio>
                                <v-radio class="mt-4" :label="optionsPlaceType.geschutzt" value="Geschutzt"></v-radio>
                                </v-col>
                            </v-radio-group>
                        </v-col>
                        <span v-if="!isRadioGroupValid" class="error-message">Bitte wählen Sie mindestens eine Option.</span>
                    </v-row>

                    <v-row class="mt-2">
                        <v-col cols="6">
                            <label for="Kemjahr*">Kemjahr*</label>
                            <v-menu v-model="menuKemjahr" :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field :rules="dateRulesAtLeastOne" v-model="selectedDateKemjahr" append-icon="mdi-calendar-blank-outline" outlined readonly clearable hide-details placeholder="YYYY-MM-DD" v-on="on" />
                                </template>
                                <v-date-picker v-model="selectedDateKemjahr" no-title scrollable @input="menuKemjahr = false, formattedDateKemjahr">
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="6">
                            <label for="Pflanzdate">Pflanzdate*</label>
                            <v-menu v-model="menuPflanzdate" :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field :rules="dateRulesAtLeastOne" required v-model="selectedDatePflanzdate" append-icon="mdi-calendar-blank-outline" outlined placeholder="YYYY-MM-DD" readonly clearable hide-details v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="selectedDatePflanzdate" no-title scrollable @input="menuPflanzdate = false, formattedDatePflanzdate">
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>

                    <v-row class="mt-4">
                        <v-col cols="6">
                            <label for="Fall datum*">Fall datum</label>
                            <v-menu v-model="menuFulldate" :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="selectedFullDate" append-icon="mdi-calendar-blank-outline" outlined placeholder="YYYY-MM-DD" readonly clearable hide-details v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="selectedFullDate" no-title scrollable @input="menuFulldate = false, formattedDateFullDate">
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>

                    <v-row class="mt-4">
                        <v-col cols="12">
                            <h2 class="technical-date">Technische Daten</h2>
                        </v-col>
                    </v-row>

                    <div class="populated" v-for="(item, index) in technicalSepcs" :key="index">
                        <v-row class="mt-4">
                            <v-col cols="12">
                                <div class="d-flex justify-space-between align-center" style="cursor:pointer">
                                    <span class="number"> {{index + 1}} </span>
                                    <div v-if="technicalSepcs.length > 1" @click="deleteTechnicalSpecsContainer(index)"><img src="../../../assets/images/close_white.png" alt="close"></div>
                                </div>
                                <div style="width:100%;border: 1px solid #494949;margin-top:10px"></div>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="6">
                                <label for="Anzahl Stämme*">Anzahl Stämme*</label>
                                <v-text-field v-model="item.inputs.numberOfTrunks" type="number" outlined clearable hide-details></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <label for="Erfassungdatum*">Erfassungdatum*</label>
                                <v-menu v-model="menuEntryDate[index]" :close-on-content-click="false" transition="scale-transition" offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field required v-model="selectedEntryDate[index]" append-icon="mdi-calendar-blank-outline" outlined placeholder="YYYY-MM-DD" readonly clearable hide-details v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="selectedEntryDate[index]" no-title scrollable @input="formattedDateEntryDate(selectedEntryDate[index],index)">
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="4">
                                <label for="Stammumfang*">Stammumfang*</label>
                                <v-text-field v-model="item.inputs.perimeterTrunk" type="number" outlined clearable hide-details append-icon="cm" class="custom-prefix-two-letters"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <label for="Baumhohe*">Baumhohe*</label>
                                <v-text-field v-model="item.inputs.treeHeight" type="number" outlined clearable hide-details append-icon="m" class="custom-prefix-one-letter"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <label for="Kronendurchmesser*">Kronendurchmesser*</label>
                                <v-text-field v-model="item.inputs.crownDiameter" type="number" outlined clearable hide-details append-icon="m" class="custom-prefix-one-letter"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="6">
                                <label for="Stammneigung*">Stammneigung*</label>
                                <v-text-field v-model="item.inputs.trunkSlope" type="number" outlined clearable hide-details append-icon="O" class="custom-prefix-one-letter"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <label for="Baumhohe*">Stammneigung Richtung*</label>
                                <v-select v-model="selectedSlopeTypes[index]" :items="selectedDirectionSlope" item-value="value" :item-text="item => `${item.text}`" outlined clearable hide-details @change="selectedSlope(selectedSlopeTypes[index],index)"></v-select>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="4">
                                <label for="Wurzelraum*">Wurzelraum*</label>
                                <v-select v-model="rootSpaceTypeId[index]" :items="rootSpaceTypes" item-value="id" :item-text="item => `${item.abbreviation} - ${item.name}`" outlined clearable hide-details @change="selectedRoot(rootSpaceTypeId[index], index)"></v-select>
                            </v-col>
                            <v-col cols="4">
                                <label for="Flache*">Flache*</label>
                                <v-text-field v-model="item.inputs.surface" type="number" outlined clearable hide-details append-icon="㎡" class="custom-prefix-one-letter"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <label for="Breite*">Breite*</label>
                                <v-text-field v-model="item.inputs.wide" type="number" outlined clearable hide-details append-icon="m" class="custom-prefix-one-letter"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="6">
                                <label for="Umrandung*">Umrandung*</label>
                                <v-select v-model="borderTypeId[index]" :items="borderTypes" item-value="id" :item-text="item => `${item.abbreviation} - ${item.name}`" outlined clearable hide-details @change="selectedBorder(borderTypeId[index], index)"></v-select>
                            </v-col>
                            <v-col cols="6">
                                <label for="Bedeckung*">Bedeckung*</label>
                                <v-select v-model="coverageTypeId[index]" :items="coverageTypes" item-value="id" :item-text="item => `${item.abbreviation} - ${item.name}`" outlined clearable hide-details @change="selectedCover(coverageTypeId[index],index)"></v-select>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="6">
                                <label for="Bewuchs*">Bewuchs*</label>
                                <v-select v-model="vegetationTypeId[index]" :items="vegetationTypes" item-value="id" :item-text="item => `${item.abbreviation} - ${item.name}`" outlined clearable hide-details @change="selectedVegetable(vegetationTypeId[index], index)"></v-select>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="12">
                                <label for="Info*">Info*</label>
                                <v-textarea v-model="item.inputs.info" type="text" outlined clearable hide-details variant="solo"></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div class="add-new-user">
                                    <img src="../../../assets/images/plus_Black.png" alt="plus" />
                                    <a href="#" @click.prevent="cloneTechnicalSpecs(index)">Neue Adresse hinzufügen
                                    </a>
                                </div>
                            </v-col>
                        </v-row>

                    </div>

                    <div class="d-flex flex-column mt-6 mb-12">
                        <v-row>
                            <div></div>
                            <v-col cols="6">
                                <v-btn class="cancel-btn mt-4" block @click="cancelDialog = true">
                                    Abbrechen
                                </v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-btn class="save-btn mt-4" block @click="updateTree">
                                    Speichern
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-form>
            </v-sheet>
            <v-sheet class="mx-auto" v-else-if="inline == 'bereich'">
                <v-form ref="bereichForm" class="bereich-form">
                    <h2>Area koordinaten</h2>
                    <div style="width:100%;border: 1px solid #494949;margin-top:10px"></div>

                    <div class="populated-coordinates" v-for="(item, index) in clonedCoordinates" :key="`item-${index}`" v-bind="item.classes">
                        <v-row class="mt-4">
                            <v-col cols="12">
                                <div class="d-flex align-center justify-space-between">
                                    <div class="d-flex align-center"> <span class="number"> {{index + 1}}</span> <span class="koordinaten">Koordinaten:</span></div>
                                    <div style="cursor:pointer" v-if="clonedCoordinates.length > 3" @click="deleteCordinate(index)"><img src="../../../assets/images/close_white.png" alt="close"></div>
                                </div>

                                <div style="width:100%;border: 1px solid #494949;margin-top:10px"></div>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="6">
                                <v-text-field v-model="item.inputs.input1" :rules="numberRules" outlined clearable hide-details required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="item.inputs.input2" :rules="numberRules" outlined clearable hide-details required></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="12">
                                <div style="width:100%;border: 1px solid #494949;margin-top:0px"></div>
                                <div class="add-new-user">
                                    <div class="form-control-add-new">
                                        <img src="../../../assets/images/plus_Black.png" alt="plus" style="width: 15px; height: 15px" />
                                        <a @click.prevent="cloneForm(index)">Neuen punkt hinzufügen</a>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                    <v-row class="mt-6">
                        <v-col cols="12">
                            <h2>Stammdaten</h2>
                        </v-col>
                    </v-row>

                    <v-row class="mt-4">
                        <v-col cols="6">
                            <label for="Inventory:">BaumID*</label>
                            <v-text-field v-model="createArea.name" :rules="nameRules" outlined clearable hide-details required></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <label for="Inventory:">Baumart*</label>
                            <v-select v-model="selectedTreeTypeId" :items="treeType" item-value="id" :item-text="item => `${item.abbreviation} - ${item.germanName}`" :rules="[(v) => !!v || 'Item is required']" outlined clearable hide-details required @change="selectTreeTypeId(selectedTreeTypeId)">
                            </v-select>
                        </v-col>
                    </v-row>

                    <v-row class="mt-12">
                        <v-col cols="12">
                            <label for="Inventory:">Bedeutung*</label>
                            <v-select v-model="selectedMeaningTypeId" :items="meaningTypes" item-value="id" :item-text="item => `${item.name}/${item.abbreviation}`" :rules="[(v) => !!v || 'Item is required']" outlined clearable hide-details required @change="selectedMeaning(selectedMeaningTypeId)"></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-radio-group v-model="selectedOption" class="custom-radio-btn">
                                <v-radio :label="optionsPlaceType.markant" value="Markant"></v-radio>
                                <v-radio :label="optionsPlaceType.privat" value="Privat"></v-radio>
                                <v-radio :label="optionsPlaceType.strassenbaum" value="Strassenbaum"></v-radio>
                                <v-radio :label="optionsPlaceType.geschutzt" value="Geschutzt"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>

                    <v-row class="mt-2">
                        <v-col cols="6">
                            <label for="Kemjahr*">Kemjahr*</label>
                            <v-menu v-model="menuKemjahr" :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field :rules="dateRulesAtLeastOne" v-model="selectedDateKemjahr" append-icon="mdi-calendar-blank-outline" outlined readonly clearable hide-details placeholder="YYYY-MM-DD" v-on="on" />
                                </template>
                                <v-date-picker v-model="selectedDateKemjahr" no-title scrollable @input="menuKemjahr = false, formattedDateKemjahr">
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="6">
                            <label for="Pflanzdate">Pflanzdate*</label>
                            <v-menu v-model="menuPflanzdate" :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field :rules="dateRulesAtLeastOne" required v-model="selectedDatePflanzdate" append-icon="mdi-calendar-blank-outline" outlined placeholder="YYYY-MM-DD" readonly clearable hide-details v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="selectedDatePflanzdate" no-title scrollable @input="menuPflanzdate = false, formattedDatePflanzdate">
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>

                    <v-row class="mt-4">
                        <v-col cols="6">
                            <label for="Fall datum*">Fall datum*</label>
                            <v-menu v-model="menuFulldate" :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field :rules="dateRules" required v-model="selectedFullDate" append-icon="mdi-calendar-blank-outline" outlined placeholder="YYYY-MM-DD" readonly clearable hide-details v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="selectedFullDate" no-title scrollable @input="menuFulldate = false, formattedDateFullDate">
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>

                    <v-row class="mt-4">
                        <v-col cols="12">
                            <h2 class="technical-date">Technische Daten</h2>
                        </v-col>
                    </v-row>
                    <div class="populated" v-for="(item, index) in technicalSepcs" :key="index">
                        <v-row class="mt-4">
                            <v-col cols="12">
                                <div class="d-flex justify-space-between align-center" style="cursor:pointer">
                                    <span class="number"> {{index + 1}} </span>
                                    <div v-if="technicalSepcs.length > 1" @click="deleteTechnicalSpecsContainer(index)">X</div>
                                </div>
                                <div style="width:100%;border: 1px solid #494949;margin-top:10px"></div>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="6">
                                <label for="Anzahl Stämme*">Anzahl Stämmee*</label>
                                <v-text-field v-model="item.inputs.numberOfTrunks" outlined clearable hide-details></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <label for="Erfassungdatum*">Erfassungdatum*</label>
                                <v-menu v-model="menuEntryDate[index]" :close-on-content-click="false" transition="scale-transition" offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="selectedEntryDate[index]" append-icon="mdi-calendar-blank-outline" outlined placeholder="YYYY-MM-DD" readonly clearable hide-details v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="selectedEntryDate[index]" no-title scrollable @input="formattedDateEntryDate(selectedEntryDate[index],index)">
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="4">
                                <label for="Stammumfang*">Stammumfang*</label>
                                <v-text-field v-model="item.inputs.perimeterTrunk" outlined clearable hide-details append-icon="cm" class="custom-prefix-two-letters"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <label for="Baumhohe*">Baumhohe*</label>
                                <v-text-field v-model="item.inputs.treeHeight" outlined clearable hide-details append-icon="m" class="custom-prefix-one-letter"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <label for="Kronendurchmesser*">Kronendurchmesser*</label>
                                <v-text-field v-model="item.inputs.crownDiameter" outlined clearable hide-details append-icon="m" class="custom-prefix-one-letter"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="6">
                                <label for="Stammneigung*">Stammneigung*</label>
                                <v-text-field v-model="item.inputs.trunkSlope" outlined clearable hide-details append-icon="O" class="custom-prefix-one-letter"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <label for="Baumhohe*">Stammneigung Richtung*</label>
                                <v-select v-model="selectedSlopeTypes[index]" :items="selectedDirectionSlope" item-value="value" :item-text="item => `${item.text}`" outlined clearable hide-details @change="selectedSlope(selectedSlopeTypes[index],index)"></v-select>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="4">
                                <label for="Wurzelraum*">Wurzelraum*</label>
                                <v-select v-model="rootSpaceTypeId[index]" :items="rootSpaceTypes" item-value="id" :item-text="item => `${item.abbreviation} - ${item.name}`" outlined clearable hide-details @change="selectedRoot(rootSpaceTypeId[index], index)"></v-select>
                            </v-col>
                            <v-col cols="4">
                                <label for="Flache*">Flache*</label>
                                <v-text-field v-model="item.inputs.surface" outlined clearable hide-details append-icon="㎡" class="custom-prefix-one-letter"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <label for="Breite*">Breite*</label>
                                <v-text-field v-model="item.inputs.wide" outlined clearable hide-details append-icon="m" class="custom-prefix-one-letter"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="6">
                                <label for="Umrandung*">Umrandung*</label>
                                <v-select v-model="borderTypeId[index]" :items="borderTypes" item-value="id" :item-text="item => `${item.abbreviation} - ${item.name}`" outlined clearable hide-details @change="selectedBorder(borderTypeId[index], index)"></v-select>
                            </v-col>
                            <v-col cols="6">
                                <label for="Bedeckung*">Bedeckung*</label>
                                <v-select v-model="coverageTypeId[index]" :items="coverageTypes" item-value="id" :item-text="item => `${item.abbreviation} - ${item.name}`" outlined clearable hide-details @change="selectedCover(coverageTypeId[index],index)"></v-select>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="6">
                                <label for="Bewuchs*">Bewuchs*</label>
                                <v-select v-model="vegetationTypeId[index]" :items="vegetationTypes" item-value="id" :item-text="item => `${item.abbreviation} - ${item.name}`" outlined clearable hide-details @change="selectedVegetable(vegetationTypeId[index], index)"></v-select>
                            </v-col>
                        </v-row>
                        <v-row class="mt-6">
                            <v-col cols="12">
                                <label for="Info*">Info*</label>
                                <v-textarea v-model="item.inputs.info" outlined clearable hide-details variant="solo"></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div class="add-new-user">
                                    <img src="../../../assets/images/plus_Black.png" alt="plus" />
                                    <a href="#" @click.prevent="cloneTechnicalSpecs(index)">Neue Adresse hinzufügen
                                    </a>
                                </div>
                            </v-col>
                        </v-row>

                    </div>

                    <div class="d-flex flex-column mt-6 mb-12">
                        <v-row>
                            <div></div>
                            <v-col cols="6">
                                <v-btn class="cancel-btn mt-4" block @click="resetBereichtForm">
                                    Abbrechen
                                </v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-btn class="save-btn mt-4" block @click="createAreaOnTheMap">
                                    Erstellen
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-form>
            </v-sheet>
        </v-container>
    </v-card>
    <v-card style="width: 50vw;
    height: calc(100vh - 75px);
    z-index: 0;">
        <v-container fluid>
            <TreeMap :regions="mapRegions" :coordinates="inventarCoordinates" v-on:latlngs-updated="handleEventLatlngs" :whichForm="inline" :treeCoordinates="treeCoordinate" :from="fromWhere"/>
        </v-container>
    </v-card>
    <div class="delete-popup" v-show="deleteDialog" ref="deletePopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="deleteDialog = false"
          >mdi mdi-close</v-icon
        >

        <p class="title">Baum Löschen</p>

        <div class="description-holder">
          <v-icon color="#C82210" class="popup-icon"
            >mdi mdi-trash-can-outline</v-icon
          >

          <p class="description">
            Wollen Sie diesen Baum wirklich löschen?
          </p>
        </div>

        <div class="buttons">
          <v-btn
            size="x-large"
            height="54px"
            class="cancel-btn"
            @click="deleteDialog = false"
          >
            Abbrechen
          </v-btn>

          <v-btn
            size="x-large"
            height="54px"
            color="#c82210"
            class="delete-btn"
            @click="deleteTree"
          >
            Löschen
          </v-btn>
        </div>
      </div>
    </div>

    <div class="cancel-popup" v-if="cancelDialog" ref="cancelPopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="neinClickHandler"
          >mdi mdi-close</v-icon
        >

        <p class="title">Abbrechen</p>

        <div class="description-holder">
          <v-icon color="#C82210" class="popup-icon"
            >mdi mdi-alert-outline</v-icon
          >

          <p class="description">
            Wollen Sie die Aktion wirklich Abbrechen?
          </p>
        </div>

        <div class="buttons">
          <v-btn
            size="x-large"
            height="54px"
            class="cancel-btn"
            @click="neinClickHandler"
          >
            Nein
          </v-btn>

          <v-btn
            size="x-large"
            height="54px"
            color="#c82210"
            class="delete-btn"
            @click="redirectToList"
          >
            Ja
          </v-btn>
        </div>
      </div>
    </div>
    <!-- <div class="popup cancel-popup" v-if="cancelDialog">
        <h2>Baum Löschen</h2>
        <div class="title-dialog">
            <img src="../../../assets/images/delete-icon-popup.png" alt="delete" style="margin-bottom:20px">

            <h4>Wollen Sie diesen Baum wirklich löschen?</h4>
        </div>
        <div>
            <v-row>
                <v-col cols="6">
                    <v-btn class="cancel-btn mt-4" block @click="cancelDialog = false">
                        Nein
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn class="save-btn mt-4" block @click="goBack">
                        Ja
                    </v-btn>
                </v-col>
            </v-row>
        </div>
    </div> -->
    <template>
        <div class="text-center">
            <v-dialog v-model="createInventarDialog" width="auto">
                <img src="../../../assets/images/black-check.png" alt="check" style="width: 41px; height: 29px" />

                <v-card-text>
                    Der Baum wurde erfolgreich aktualisiert.
                </v-card-text>
            </v-dialog>
        </div>
    </template>
    <CustomLoader v-show="isLoading" />
</div>
</template>

<script>
import TreeMap from './map/TreeMap.vue'
import axios from "axios";
import CustomLoader from "../../../components/custom_components/CustomLoader.vue";
import {
    mapGetters,
    mapActions
} from "vuex";

export default {
        beforeRouteLeave(to, from, next) {
        if (this.nextRoute || this.allowNavigate) {
        next();
        } else {
        this.nextRoute = to;
        this.cancelDialog = true;
        }
    },
    name: "Bearbeiten",
    components: {
        TreeMap,
        CustomLoader
    },
    data() {
        return {
            allowNavigate: false,
            nextRoute: null,
            isLoading: false,
            userCanDelete: false,
            valid: true,
            createTree: {
                id: null,
                name: "",
                inventoryId: 0,
                treeTypeId: 0,
                meaningTypeId: 0,
                placeTypeId: null,
                treeLatitude: 0,
                treeLongitude: 0,
                germinationDate: null,
                plantingDate: null,
                dropDate: null,
                technicalDatas: [{
                    trunksNumber: 0,
                    acquisitionDate: "",
                    trunkCircumference: 0,
                    treeHeight: 0,
                    crownDiameter: 0,
                    trunkSlope: 0,
                    trunkSlopeDirectionType: "",
                    rootSpaceTypeId: 0,
                    area: 0,
                    wide: 0,
                    borderTypeId: 0,
                    coverageTypeId: 0,
                    vegetationTypeId: 0,
                    info: ""
                }]
            },
            createArea: {
                id: null,
                name: "",
                inventoryId: null,
                treeTypeId: null,
                meaningTypeId: null,
                placeTypeId: null,
                treeLatitude: null,
                treeLongitude: null,
                germinationDate: null,
                plantingDate: null,
                dropDate: null,
                technicalDatas: [{
                    trunksNumber: null,
                    acquisitionDate: "",
                    trunkCircumference: null,
                    treeHeight: null,
                    crownDiameter: null,
                    trunkSlope: null,
                    trunkSlopeDirectionType: "",
                    rootSpaceTypeId: null,
                    area: 0,
                    wide: null,
                    borderTypeId: null,
                    coverageTypeId: null,
                    vegetationTypeId: null,
                    info: ""
                }]
            },
            KemjahrDate: false,
            germinationDate: null,
            menuKemjahr: false,
            menuPflanzdate: false,
            menuFulldate: false,
            menuEntryDate: [],
            selectedDateKemjahr: "",
            hasUserInteracted: false,
            selectedDatePflanzdate: null,
            selectedFullDate: null,
            selectedEntryDate: [],
            requiredRule: [
                (v) => !!v || 'Date is required',
            ],
            Pflanzdate: null,
            Fulldate: null,
            column: null,
            inline: "baum",
            typeTree: "privat",
            selectedOption: null,
            optionsPlaceType: {
                markant: 'Markant',
                privat: 'Privat',
                strassenbaum: 'Strassenbaum',
                geschutzt: 'Geschutzt',
            },
            name: "",
            nameRules: [
                (v) => !!v || "Name is required",
            ],
            numberRules: [
                (v) => !!v || "Number should have more than two digits"
            ],
            selectInventoryId: null,
            treeType: [],
            selectedTreeTypeId: null,
            meaningTypes: [],
            selectedMeaningTypeId: null,
            // selectedDirectionSlope: ["N", "S", "W", "E"],
            directionSlope: {
                S: "S",
                SW: "SW",
                W: "W",
                NW: "NW",
                N: "N",
                NO: "NO",
                O: "O",
                SO: "SO",
            },
            selectedSlopeTypes: [],
            coverageTypes: [],
            coverageTypeId: [],
            vegetationTypes: [],
            vegetationTypeId: [],
            borderTypes: [],
            borderTypeId: [],
            rootSpaceTypes: [],
            rootSpaceTypeId: [],
            trunkSlopeDirectionType: null,
            select: null,
            items: ["N", "S", "W", "E"],
            checkbox: false,
            mapRegions: [],
            technicalSepcs: [{
                inputs: {
                    numberOfTrunks: null,
                    entryDate: null,
                    perimeterTrunk: null,
                    treeHeight: null,
                    crownDiameter: null,
                    trunkSlope: null,
                    trunkSlopeDirectionType: null,
                    rootSpaceTypeId: null,
                    surface: null,
                    wide: null,
                    borderTypeId: null,
                    coverageTypeId: null,
                    vegetationTypeId: null,
                    info: null,
                },
                classes: [{
                    class: "populated"
                }],
                isDuplicatedWith: null,
            }, ],
            cordinates: [],
            clonedCoordinates: [{
                    inputs: {
                        input1: null,
                        isValidInput1: true,
                        input2: null,
                        isValidInput2: true,
                    },
                    classes: [{
                        class: "populated-coordinates"
                    }],
                    isDuplicatedWith: null,
                },
                {
                    inputs: {
                        input1: null,
                        isValidInput1: true,
                        input2: null,
                        isValidInput2: true,
                    },
                    classes: [{
                        class: "populated-coordinates"
                    }],
                    isDuplicatedWith: null,
                },
                {
                    inputs: {
                        input1: null,
                        isValidInput1: true,
                        input2: null,
                        isValidInput2: true,
                    },
                    classes: [{
                        class: "populated-coordinates"
                    }],
                    isDuplicatedWith: null,
                },
            ],
            createInventarDialog: false,
            deleteDialog: false,
            cancelDialog: false,
            isTree:false,
            treeCoordinate:null,
            fromWhere:'edit'
        };
    },
    computed: {
        ...mapGetters(["getThemeMode", "inventarId", "inventarCoordinates"]),
         isRadioGroupValid() {
            return !!this.selectedOption;
        },
        selectedDirectionSlope() {
            return Object.entries(this.directionSlope).map(([value, text]) => ({
                value,
                text
            }));
        },
        greaterThanTwoRule() {
            return [
                (value) => value && value.toString().length > 2 || "Number should have more than two digits"
            ];
        },
        isDateSelected() {
            return !!this.selectedDateKemjahr || !!this.selectedDatePflanzdate;
        },
        dateRules() {
            return [
                v => !!v || 'Date is required'
            ];
        },
        dateRulesAtLeastOne(){
            return [
                this.isDateSelected || 'Please select at least one date.',
            ];
        },
        formattedDateKemjahr() {
            if (this.inline == "baum") {
                if (this.selectedDateKemjahr) {
                    const date = new Date(this.selectedDateKemjahr);
                    return this.createTree.germinationDate = date.toISOString();
                } else {
                    return '';
                }
            } else {
                if (this.selectedDateKemjahr) {
                    const date = new Date(this.selectedDateKemjahr);
                    return this.createArea.germinationDate = date.toISOString();
                } else {
                    return '';
                }
            }
        },

        formattedDatePflanzdate() {
            if (this.inline == "baum") {
                if (this.selectedDatePflanzdate) {
                    const date = new Date(this.selectedDatePflanzdate);
                    return this.createTree.plantingDate = date.toISOString();
                } else {
                    return '';
                }
            } else {
                if (this.selectedDatePflanzdate) {
                    const date = new Date(this.selectedDatePflanzdate);
                    return this.createArea.plantingDate = date.toISOString();
                } else {
                    return '';
                }
            }
        },
        formattedDateFullDate() {
            if (this.inline == "baum") {
                if (this.selectedFullDate !== null) {
                    const date = new Date(this.selectedFullDate);
                    return this.createTree.dropDate = date.toISOString();
                } else {
                    return null;
                }
            } else {
                if (this.selectedFullDate !== null) {
                    const date = new Date(this.selectedFullDate);
                    return this.createArea.dropDate = date.toISOString();
                } else {
                    return null;
                }
            }
        },

    },
    watch: {

        selectedOption(newVal) {
            if (this.inline == "baum") {
                this.createTree.placeTypeId = newVal
            } else {
                this.createArea.placeTypeId = newVal
            }
        },
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
        goBack() {
            this.$router.back();
    },
    redirectToList() {
      if (this.nextRoute) {
        this.$router.push(this.nextRoute);
      } else {
        this.allowNavigate = true;
        this.$router.push({
          name: "Baumliste"
        });
      }
    },
    neinClickHandler(){
      this.nextRoute = null;
      this.allowNavigate = false;
      this.cancelDialog = false;
    },
        getCoordinatesFromMyLocation() {
            if (navigator.geolocation) {
                console.log("navigator", navigator);
                navigator.geolocation.getCurrentPosition((position) => {
                    
                    // const latlng = [position.coords.latitude, position.coords.longitude];
                    this.createTree.treeLatitude = position.coords.latitude
                    this.createTree.treeLongitude = position.coords.longitude
                    // this.$refs.map.mapObject.setView(latlng, 15); // Set the map view to your location with zoom level 15
                });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        },
        formattedDateEntryDate(selectedEntryDate, index) {
            if (selectedEntryDate) {
                const date = new Date(selectedEntryDate);
                this.menuEntryDate[index] = false;
                return this.technicalSepcs[index].inputs.entryDate = date.toISOString();
            } else {
                return '';
            }
        },
        selectedTrunkSlopeDirection(trunkSlopeDirectionType, index) {
            this.trunkSlopeDirectionType = trunkSlopeDirectionType
            console.log(trunkSlopeDirectionType, index);

        },
        selectedRoot(rootSpace, index) {
            if (rootSpace) {

                this.technicalSepcs[index].inputs.rootSpaceTypeId = rootSpace
            }
        },
        selectedBorder(borderTypeId, index) {
            if (borderTypeId) {
                this.technicalSepcs[index].inputs.borderTypeId = borderTypeId
            }
        },
        selectedVegetable(vegetationTypeId, index) {
            if (vegetationTypeId) {

                this.technicalSepcs[index].inputs.vegetationTypeId = vegetationTypeId
            }
        },
        selectedCover(coverTypeId, index) {
            if (coverTypeId) {

                this.technicalSepcs[index].inputs.coverageTypeId = coverTypeId
            }
        },
        selectedSlope(selectedSlopeDirectionType, index) {
            console.log(selectedSlopeDirectionType, index);
            this.technicalSepcs[index].inputs.trunkSlopeDirectionType = selectedSlopeDirectionType
        },
        selectedMeaning(meaningTypeId) {
            if (this.inline == 'baum') {
                this.createTree.meaningTypeId = meaningTypeId
            } else {
                this.createArea.meaningTypeId = meaningTypeId
            }
        },
        selectTreeTypeId(treeTypeId) {
            if (this.inline == "baum") {
                this.createTree.treeTypeId = treeTypeId
            } else {
                this.createArea.treeTypeId = treeTypeId

            }
        },
        selectTreeTypeIdArea(treeTypeId) {
            this.createArea.treeTypeId = treeTypeId
        },
        selectedInventory(inventoryId) {
            this.createTree.inventoryId = inventoryId
        },
        deleteCordinate(index) {
            this.clonedCoordinates = this.clonedCoordinates.filter(
                (address, i) => i !== index
            );
        },
        deleteTechnicalSpecsContainer(index) {
            this.technicalSepcs = this.technicalSepcs.filter(
                (address, i) => i !== index
            );
        },
        isValidKordinateInput1() {
            this.clonedCoordinates.forEach((f) => {
                f.inputs.isValidInput1 =
                    f.inputs.input1 != null && f.inputs.input1 != "";
            });
            return this.clonedCoordinates.every(
                (item) => item.inputs.isValidInput1
            );
        },
        isValidKordinateInput2() {
            this.clonedCoordinates.forEach((f) => {
                f.inputs.isValidInput2 =
                    f.inputs.input2 != null && f.inputs.input2 != "";
            });
            return this.clonedCoordinates.every(
                (item) => item.inputs.isValidInput2
            );
        },
        validateKordinatenInput1(index) {
            if (
                this.clonedCoordinates[index].inputs.input1 != null &&
                this.clonedCoordinates[index].inputs.input1 != ""
            )
                this.clonedCoordinates[index].inputs.isValidInput1 = true;
            else this.clonedCoordinates[index].inputs.isValidInput1 = false;
        },
        validateKordinatenInput2(index) {
            if (
                this.clonedCoordinates[index].inputs.input2 != null &&
                this.clonedCoordinates[index].inputs.input2 != ""
            )
                this.clonedCoordinates[index].inputs.isValidInput2 = true;
            else this.clonedCoordinates[index].inputs.isValidInput2 = false;
        },
        handleEventLatlngs(lnglat) {
        
            console.log("erdh",lnglat);
            this.cordinates = lnglat;
            if (this.cordinates.length >= 0) {
                for (let i = 0; i < this.cordinates.length; i++) {
                    this.createTree.treeLatitude = lnglat[0]
                    this.createTree.treeLongitude = lnglat[1]
                }
            } else {
                 this.createTree.treeLatitude = null
                    this.createTree.treeLongitude = null
            }
        },
        cloneForm(index) {
            this.clonedCoordinates.splice(index + 1, 0, {
                inputs: {
                    input1: null,
                    isValidInput1: true,
                    input2: null,
                    isValidInput2: true,
                },
                classes: [{
                    class: "populated-coordinates"
                }],
            });
        },
        addKoordinates() {
            let uniqueArray = [];

            this.clonedCoordinates.forEach((element, index, array) => {
                const isDuplicated = uniqueArray.some((item) => {
                    return (
                        item.latitude ===  this.createTree.treeLatitude &&
                        item.longitude ===  this.createTree.treeLongitude
                    );
                });

                if (!isDuplicated) {
                    uniqueArray.push({
                        latitude: element.inputs.input1,
                        longitude: element.inputs.input2,
                    });
                    element.isDuplicatedWith = null;
                } else {
                    element.isDuplicatedWith = array.findIndex(
                        (f) =>
                        f.inputs.input1 === element.inputs.input1 &&
                        f.inputs.input2 === element.inputs.input2
                    );
                }
            });

            this.createArea.areaRegions = uniqueArray;
        },
        addTechnicalSpecs() {
            let uniqueArray = [];

            this.technicalSepcs.forEach((element, index, array) => {
                const isDuplicated = uniqueArray.some((item) => {
                    return (
                        item.numberOfTrunks === element.inputs.numberOfTrunks,
                        item.entryDate === element.inputs.entryDate,
                        item.perimeterTrunk === element.inputs.perimeterTrunk,
                        item.treeHeight === element.inputs.treeHeight,
                        item.crownDiameter === element.inputs.crownDiameter,
                        item.trunkSlope === element.inputs.trunkSlope,
                        item.trunkSlopeDirectionType === element.inputs.trunkSlopeDirectionType,
                        item.rootSpaceTypeId === element.inputs.rootSpaceTypeId,
                        item.surface === element.inputs.surface,
                        item.wide === element.inputs.wide,
                        item.borderTypeId === element.inputs.borderTypeId,
                        item.coverageTypeId === element.inputs.coverageTypeId,
                        item.vegetationTypeId === element.inputs.vegetationTypeId,
                        item.info === element.inputs.info
                    );
                });
                if (!isDuplicated) {
                    uniqueArray.push({
                        trunksNumber: parseInt(element.inputs.numberOfTrunks),
                        acquisitionDate: element.inputs.entryDate,
                        trunkCircumference: parseInt(element.inputs.perimeterTrunk),
                        treeHeight: parseInt(element.inputs.treeHeight),
                        crownDiameter: parseInt(element.inputs.crownDiameter),
                        trunkSlope: parseInt(element.inputs.trunkSlope),
                        trunkSlopeDirectionType: element.inputs.trunkSlopeDirectionType,
                        rootSpaceTypeId: parseInt(element.inputs.rootSpaceTypeId),
                        area: parseInt(element.inputs.surface),
                        wide: parseInt(element.inputs.wide),
                        borderTypeId: parseInt(element.inputs.borderTypeId),
                        coverageTypeId: parseInt(element.inputs.coverageTypeId),
                        vegetationTypeId: parseInt(element.inputs.vegetationTypeId),
                        info: element.inputs.info
                    });
                    element.isDuplicatedWith = null;
                } else {
                    element.isDuplicatedWith = array.findIndex(
                        (f) =>
                        f.trunksNumber === element.inputs.numberOfTrunks &&
                        f.acquisitionDate === element.inputs.entryDate &&
                        f.trunkCircumference === element.inputs.perimeterTrunk &&
                        f.treeHeight === element.inputs.treeHeight &&
                        f.crownDiameter === element.inputs.crownDiameter &&
                        f.trunkSlope === element.inputs.trunkSlope &&
                        f.trunkSlopeDirectionType === element.inputs.trunkSlopeDirectionType &&
                        f.rootSpaceTypeId === element.inputs.rootSpaceTypeId &&
                        f.area === element.inputs.surface &&
                        f.wide === element.inputs.wide &&
                        f.borderTypeId === element.inputs.borderTypeId &&
                        f.coverageTypeId === element.inputs.coverageTypeId &&
                        f.vegetationTypeId === element.inputs.vegetationTypeId &&
                        f.info === element.inputs.info
                    );
                }
            });
            console.log(this.inline);
            if (this.inline == "baum") {
                this.createTree.technicalDatas = uniqueArray;
            } else {
                this.createArea.technicalDatas = uniqueArray;
            }
        },
        cloneTechnicalSpecs(index) {
            this.technicalSepcs.splice(index + 1, 0, {
                inputs: {
                    numberOfTrunks: null,
                    entryDate: null,
                    perimeterTrunk: null,
                    treeHeight: null,
                    crownDiameter: null,
                    trunkSlope: null,
                    trunkSlopeDirectionType: null,
                    rootSpace: null,
                    surface: null,
                    wide: null,
                    border: null,
                    cover: null,
                    fouling: null,
                    info: null,
                },
                classes: [{
                    class: "populated"
                }],
                isDuplicatedWith: null,
            });

            // this.objects.forEach((object) => {
            //   if (object.index > index) {
            //     object.index += 1;
            //   }
            // });
            console.log(this.technicalSepcs);
        },
        updateTree() {
            const treeCoordinate = this.$route.params.coord
            this.addKoordinates();
            this.addTechnicalSpecs()
            const valid = this.$refs.baumForm.validate();
            // console.log("objekti",this.createTree);
            if (valid) {
                this.isLoading = true;
                axios
                    .put("https://tilia.rrota.org/api/Tree/Update", this.createTree)
                    .then((response) => {
                        // Handle the response from the server
                        // console.log(response.data);
                        if (response && response.status == 200) {
                              this.addTreeId(response.data.data);
                            this.addIsTree(true);
                            this.allowNavigate = true;
                            this.createInventarDialog = true;
                            this.isLoading = false;
                            setTimeout(() => {
                                this.$router.push({
                                    name: "BaumProfil",
                                    params: {
                                        isTree: true,
                                        treeId: response.data.data,
                                        areaId: 0,
                                        coord: treeCoordinate
                                    }
                                });

                            }, 2000);
                        }
                    })
                    .catch((error) => {
                        this.isLoading = false;
                        console.log(error);
                    });

            }

        },
        deleteTree() {
            this.isLoading = true;
            axios
                .delete(`https://tilia.rrota.org/api/Tree/DeleteTree/${this.createTree.id}`)
                .then((response) => {
                    // Handle the response from the server
                    // console.log(response.data);
                    if (response && response.status == 200) {
                        this.isLoading = false;
                        this.allowNavigate = true;
                        setTimeout(() => {
                            this.deleteDialog = false;
                            this.goBack()
                        }, 2000);
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    console.log(error);
                });
        },
        openDeleteDialog() {
            this.deleteDialog = true
        },
        createAreaOnTheMap() {
            alert();
            this.addKoordinates()
            this.addTechnicalSpecs()
            const valid = this.$refs.bereichForm.validate();
            if (valid) {
            this.isLoading = true;
                axios
                    .put("https://tilia.rrota.org/api/Tree/Update", this.createArea)
                    .then((response) => {
                        // Handle the response from the server
                        // console.log(response.data);
                        if (response && response.status == 200) {
                            this.allowNavigate = true;
                            this.createInventarDialog = true;
                            this.isLoading = false;
                            setTimeout(() => {
                                this.$router.push({
                                    name: "BaumProfil",
                                    params: {
                                        isTree: true,
                                        treeId: response.data.data,
                                        areaId: 0
                                    }
                                });
                            }, 2000);
                        }
                    })
                    .catch((error) => {
                        this.isLoading = false;
                        console.log(error);
                    });

            } else {
                this.isLoading = false;
                alert("form incorect")
            }

        },

        resetBereichtForm() {
            this.$refs.bereichForm.reset();
        },
        resetBaumForm() {
            this.$refs.baumForm.reset();
        },
        goBack() {
            this.$router.back();
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
        getAllTreeType() {
            axios
                .get(`https://tilia.rrota.org/api/TreeType/GetAll`)
                .then((response) => {
                    // Handle the response from the server
                    this.treeType = response.data
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        getAllMeaningType() {
            axios
                .get(`https://tilia.rrota.org/api/Tree/GetAllMeaningType`)
                .then((response) => {
                    // Handle the response from the server
                    this.meaningTypes = response.data
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getCoverageType() {
            axios
                .get(`https://tilia.rrota.org/api/CoverageType/GetAll`)
                .then((response) => {
                    // Handle the response from the server
                    this.coverageTypes = response.data
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getVegetationType() {
            axios
                .get(`https://tilia.rrota.org/api/VegetationType/GetAll`)
                .then((response) => {
                    // Handle the response from the server
                    this.vegetationTypes = response.data
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getAllBorderType() {
            axios
                .get(`https://tilia.rrota.org/api/Tree/GetAllBorderType`)
                .then((response) => {
                    // Handle the response from the server
                    this.borderTypes = response.data
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getAllRootSpaceType() {
            axios
                .get(`https://tilia.rrota.org/api/Tree/GetAllBorderType`)
                .then((response) => {
                    // Handle the response from the server
                    // console.log("response", response);
                    this.rootSpaceTypes = response.data
                    console.log("treeType", this.rootSpaceTypes);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getUpdateTree() {
            const treeId = this.$route.params.treeId;
            axios
                .get(`https://tilia.rrota.org/api/Tree/GetTree/${this.inventarId}/${treeId}`)
                .then((response) => {
                    const data = response.data;
                    this.isTree = data.isTree
                    data.technicalDatas.forEach((technicalData, index) => {
                        // const slopeDirectionType = technicalData.trunkSlopeDirectionType;
                        // console.log("slopeDirectionType", slopeDirectionType);

                        this.technicalSepcs[index] = {
                            inputs: {
                                numberOfTrunks: technicalData.trunksNumber,
                                entryDate: technicalData.acquisitionDate,
                                perimeterTrunk: technicalData.trunkCircumference,
                                treeHeight: technicalData.treeHeight,
                                crownDiameter: technicalData.crownDiameter,
                                trunkSlope: technicalData.trunkSlope,
                                trunkSlopeDirectionType: technicalData.trunkSlopeDirectionType,
                                rootSpaceTypeId: technicalData.rootSpaceTypeId,
                                surface: technicalData.area,
                                wide: technicalData.wide,
                                borderTypeId: technicalData.borderTypeId,
                                coverageTypeId: technicalData.coverageTypeId,
                                vegetationTypeId: technicalData.vegetationTypeId,
                                info: technicalData.info,
                                id: technicalData.id
                            },
                            classes: [{
                                class: "populated"
                            }],
                            isDuplicatedWith: null,
                        }

                        let slopeTypes;
                        let data = technicalData.trunkSlopeDirectionType
                        switch (data) {
                            case 1:
                                slopeTypes = "S";
                                break;
                            case 2:
                                slopeTypes = "SW";
                                break;
                            case 3:
                                slopeTypes = "W";
                                break;
                            case 4:
                                slopeTypes = "NW"
                                break;
                            case 5:
                                slopeTypes = "N"
                                break;
                            case 6:
                                slopeTypes = "NO"
                                break;
                            case 7:
                                slopeTypes = "O"
                                break;
                            case 8:
                                slopeTypes = "SO"
                                break;
                            default:
                                this.selectedSlopeTypes.push(null);
                                break;
                        }
                        this.rootSpaceTypeId[index] = technicalData.rootSpaceTypeId
                        this.selectedEntryDate[index] = technicalData.acquisitionDate
                        this.borderTypeId[index] = technicalData.borderTypeId
                        this.coverageTypeId[index] = technicalData.coverageTypeId
                        this.vegetationTypeId[index] = technicalData.vegetationTypeId
                        this.selectedSlopeTypes[index] = slopeTypes
                    });
                    const placeTypeId = data.placeTypeId;
                    // this.$set(this.createTree, "name", data.name)
                    this.selectedTreeTypeId = data.treeTypeId
                    this.selectedMeaningTypeId = data.meaningTypeId
                    this.createTree.name = data.name
                    this.createTree.id = data.id
                    this.createTree.inventoryId = data.inventoryId
                    this.createTree.treeLatitude = data.treeLatitude
                    this.createTree.treeLongitude = data.treeLongitude
                    this.createTree.dropDate = null
                    this.createTree.germinationDate = data.germinationDate
                    this.createTree.plantingDate = data.plantingDate
                    this.createTree.treeTypeId = data.treeTypeId
                    this.createTree.meaningTypeId = data.meaningTypeId
                    
                    switch (placeTypeId) {
                        case 1:
                            this.selectedOption = this.optionsPlaceType.markant; // Select 'Markant'
                            break;
                        case 2:
                            this.selectedOption = this.optionsPlaceType.strassenbaum; // Select 'Privat'
                            break;
                        case 3:
                            this.selectedOption = this.optionsPlaceType.privat; // Select 'Strassenbaum'
                            break;
                        case 4:
                            this.selectedOption = this.optionsPlaceType.geschutzt; // Select 'Geschutzt'
                            break;
                        default:
                            // Handle unexpected placeTypeId value
                            break;
                    }

                    this.selectedDateKemjahr = data.germinationDate
                    this.selectedDatePflanzdate = data.plantingDate
                    this.selectedFullDate = null



                })
                .catch((error) => {
                    // Handle Errors here.
                    // var errorCode = error.code;
                    // var errorMessage = error.message;
                    console.log(error);

                    // ...
                });
        },

    },
    created() {
        this.getUpdateTree();
        this.fetchMapRegionTrees();
        this.getAllTreeType();
        this.getAllMeaningType();
        this.getCoverageType();
        this.getVegetationType();
        this.getAllBorderType();
        this.getAllRootSpaceType();
    },
    mounted() {
        this.userCanDelete = this.$route.params.canDelete;
        console.log("selectedFullDate",this.selectedFullDate);
        this.createTree.inventoryId = this.inventarId
        this.createArea.inventoryId = this.inventarId
        this.treeCoordinate = this.$route.params.coord
    }
};
</script>

<style lang="scss">
.error-message{
    color: red;
    margin:0 auto;
}
.v-dialog {
    width: 668px;
    height: 115px;
    background: #1db954;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 20px;
    color: #151914 !important;
}
.delete-popup,
.cancel-popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba($color: #000000, $alpha: 0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;

  .popup-holder {
    display: flex;
    flex-direction: column;
    background-color: #1c1e1c;
    width: 662px;
    height: auto;
    max-height: 78vh;
    max-height: 80%;
    border-radius: 10px;
    padding: 30px;
    position: relative;

    .close-popup {
      position: absolute;
      right: 30px;
      top: 25px;
      cursor: pointer;
    }

    .title {
      text-align: center;
    }

    .description-holder {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      height: 200px;

      .popup-icon {
        margin-bottom: 20px;
        font-size: 50px;
      }

      .description {
        font-size: 18px;
        line-height: 25px;
        margin-bottom: 0;
        text-align: center;
      }
    }

    .work-types,
    .baums {
      height: 100%;
      max-height: 304px;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 3px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        background: transparent;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: #1db954;
      }

      /* Handle on hover */
      &::-webkit-scrollbar-thumb:hover {
        background: darken($color: #1db954, $amount: 5);
      }

      .custom-radio {
        padding: 20px 0;
        border-bottom: 1px solid #494949;
      }
    }

    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;

      .submit-btn {
        width: 285px;
        color: #000;
        font-size: 16px;
        line-height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        text-transform: none;
        background-color: #1db954;
      }

      .delete-btn {
        width: 285px;
        color: #fff;
        font-size: 16px;
        line-height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        text-transform: none;
        background-color: #c82210;
      }

      .cancel-btn {
        width: 285px;
        color: #fff;
        font-size: 16px;
        line-height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        text-transform: none;
        background-color: transparent;
        border: 1px solid #fff;
      }
    }
  }
}

// .cancel-popup{
//     .cancel-btn{
//         width: 160px !important;
//     }
    
//     .save-btn{
//         width: 160px !important;
//     }
// }

.delete-dialog {
    width: 668px;
    height: 115px;
    background: #1db954;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 20px;
    color: #151914 !important;

    .link-control {
        display: flex;
        justify-content: space-between;

        .cancel-btn {
            border: 1px solid #E5E5E5;
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            color: #FFFFFF;
        }

        .save-btn {
            background-color: #1DB954 !important;
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            color: #151914 !important;
        }

    }
}

.wrapper {
    display: flex;
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    margin-bottom: 50px;

    .left-side-edit-tree {
        width: 50vw;
        border-right: 20px solid #757575;
        box-sizing: border-box;
        overflow: scroll;
        padding-bottom: 150px;

        .link-control {
            display: flex;
            justify-content: space-between;

            .abbrechen {
                display: flex;
                align-items: flex-end;
                margin-right: 30px;
                margin-bottom: 20px;
                float: right;
                color: #c82210;
                text-decoration: underline;

                img {
                    margin-right: 4px;
                    margin-bottom: 3px;
                }
            }
        }

        &::-webkit-scrollbar {
            width: 3px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #1db954;
            border-radius: 3px;
        }

        &::-webkit-scrollbar-track {
            background-color: #494949;
        }
    }

    .v-input--radio-group__input {
        display: flex;
        flex-direction: row !important;
    }

    .v-input--radio-group--column .v-radio:not(:last-child):not(:only-child) {
        margin-bottom: 0;
    }

    .custom-radio-btn-first {
        .v-input--radio-group__input {
            .v-radio:last-child {
                margin-left: 20px;
            }
        }
    }

    .custom-radio-btn {

        .v-input--radio-group__input {
            justify-content: space-between;

            .v-radio label {
                font-style: normal;
                font-weight: 400;
                font-size: 15px;
                line-height: 24px;
                color: #FFFFFF;
                margin-right: 4px;
            }
        }
    }

    .location-point {
        display: flex;
        align-items: center;

        .locate {
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            color: #ffffff;
            margin-bottom: 0;
        }

        .img {
            width: 17px;
            height: 17px;
            margin-left: 15px;
        }

        .link {
            margin-left: 15px;
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            text-decoration-line: underline;
            color: #ffffff;
        }
    }

    v-text-field {
        border: 1px solid #494949;
        border-radius: 5px;
    }

    .v-text-field--outlined .v-label--active {
        transform: none;
    }

    .v-input .v-input--is-focused {
        border: solid;
    }

    .technical-date {
        font-style: normal !important;
        font-weight: 500 !important;
        font-size: 25px !important;
        line-height: 38px !important;
        color: #FFFFFF !important;
    }

    .add-new-user {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 20px;

        img {
            width: 12px;
            height: 12px;
            margin-right: 8px;
        }

        .form-control-add-new {
            width: 50%;

            img {
                margin-right: 8px;
            }

            a {
                text-decoration: underline;
            }
        }
    }

    .number {
        display: flex;
        width: 35px;
        height: 35px;
        border: 1px solid #1DB954;
        border-radius: 50%;
        /* text-align: center; */
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        background: #1DB954;
        color: black;
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 27px;
    }

    .v-text-field__prefix {
        background-color: #1DB954 !important;
        border-radius: 4px 0px 0px 4px !important;
        padding: 26px !important;
        margin-left: -11px !important;
        color: black !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    .custom-prefix-two-letters {
        .v-icon.v-icon {
            background: #1DB954 !important;
            background-color: #1DB954 !important;
            border-radius: 0px 4px 4px 0px !important;
            padding: 10px !important;
            margin-left: 8px !important;
            margin-top: -2px;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 54px !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 14px !important;
            line-height: 21px !important;
            color: #151914 !important;
        }
    }

    .custom-prefix-one-letter {
        .v-icon.v-icon {
            background: #1DB954 !important;
            background-color: #1DB954 !important;
            border-radius: 0px 4px 4px 0px !important;
            padding: 12px !important;
            margin-left: 10px !important;
            margin-top: -2px;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 54px !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 14px !important;
            line-height: 21px !important;
            color: #151914 !important;
        }
    }

    .v-text-field--outlined .v-text-field__prefix {
        max-height: 54px !important;
        max-width: 52px !important;
    }

    .v-text-field input {
        padding: 8px 0px 8px 4px !important;
    }

    .cancel-btn {
        border: 1px solid #E5E5E5;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #FFFFFF;
    }

    .save-btn {
        background-color: #1DB954 !important;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #151914 !important;
    }

    .bereich-form {
        .h2 {
            font-style: normal;
            font-weight: 500;
            font-size: 25px;
            line-height: 38px;
            color: #FFFFFF;
        }
    }

    .baum-form {
        .h2 {
            font-style: normal;
            font-weight: 500;
            font-size: 25px;
            line-height: 38px;
            color: #FFFFFF;
        }
    }

    .koordinaten {
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 27px;
        color: #FFFFFF;
    }
}
.cancel-popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba($color: #000000, $alpha: 0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;

  .popup-holder {
    display: flex;
    flex-direction: column;
    background-color: #1c1e1c;
    width: 662px;
    height: auto;
    max-height: 78vh;
    max-height: 80%;
    border-radius: 10px;
    padding: 30px;
    position: relative;

    .close-popup {
      position: absolute;
      right: 30px;
      top: 25px;
      cursor: pointer;
    }

    .title {
      text-align: center;
    }

    .description-holder {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      height: 200px;

      .popup-icon {
        margin-bottom: 20px;
        font-size: 50px;
      }

      .description {
        font-size: 18px;
        line-height: 25px;
        margin-bottom: 0;
        text-align: center;
      }
    }

    .work-types,
    .baums {
      height: 100%;
      max-height: 304px;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 3px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        background: transparent;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: #1db954;
      }

      /* Handle on hover */
      &::-webkit-scrollbar-thumb:hover {
        background: darken($color: #1db954, $amount: 5);
      }

      .custom-radio {
        padding: 20px 0;
        border-bottom: 1px solid #494949;
      }
    }

    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;

      .submit-btn {
        width: 285px;
        color: #000;
        font-size: 16px;
        line-height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        text-transform: none;
        background-color: #1db954;
      }

      .delete-btn {
        width: 285px;
        color: #fff;
        font-size: 16px;
        line-height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        text-transform: none;
        background-color: #c82210;
      }

      .cancel-btn {
        width: 285px;
        color: #fff;
        font-size: 16px;
        line-height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        text-transform: none;
        background-color: transparent;
        border: 1px solid #fff;
      }
    }
  }
}
</style>
