<template>
  <div>
    <CustomLoader v-show="loading" />

    <div class="wrapper">
      <v-snackbar v-model="snackbar" top color="danger">
        <div>{{ snackbarMessage }}</div>
        <template v-slot:action="{ attrs }">
          <v-btn color="" text v-bind="attrs" @click.prevent="snackbar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <div class="edit-inventar">
        <div class="link-control">
          <a href="#" class="abbrechen" @click.prevent="openDeleteDialog">
            <img src="../../../../assets/images/delete-icon.png" alt="" /><span
              >Löschen</span
            ></a
          >
          <a class="abbrechen" @click="cancelDialog = true">Abbrechen</a>
        </div>
        <h1>Inventar Info</h1>
        <v-form ref="editForm">
          <v-row class="pl-0 pr-0">
            <v-col cols="6">
              <label for="Name">Inventar Name*:</label>
              <v-text-field
                type="text"
                v-model="inventarObj.name"
                :rules="nameRules"
                outlined
                clearable
                hide-details
                required
              >
              </v-text-field>
            </v-col>

            <v-col cols="6">
              <label for="ProjektNr">ProjektNr*:</label>
              <v-text-field
                type="text"
                v-model="inventarObj.projectNumber"
                :rules="nameRules"
                outlined
                clearable
                hide-details
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="users-wrapper">
            <div class="cloned">
              <div class="two-parts">
                <label for="Verantwortlicher">Verantwortlicher*:</label>

                <div
                  class="btn-wrapper"
                  v-if="inventarObj.responsible.length == 0"
                  :class="{
                    'is-invalid':
                      showInvalidResponsible && !isValidUserResponsible
                  }"
                >
                  <button
                    class="btn"
                    @click.prevent="showDropdownUser"
                  ></button>
                  <span>Auswählen</span>
                </div>

                <div
                  v-for="(usr, index) in inventarObj.responsible"
                  :key="index"
                  class="user-login"
                >
                  <div class="user-info">
                    <div class="user-initials">
                      <span>
                        {{ usr.firstName[0].toUpperCase()
                        }}{{ usr.lastName[0].toUpperCase() }}
                      </span>
                    </div>

                    <!-- <img src="../../../assets/images/avatars/001-man.svg" alt="avatar"> -->
                    <div class="user-info-email-name">
                      <h3>{{ usr.fullName }}</h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="close-btn"
                    @click.prevent="deleteUserResponsible(usr)"
                  ></button>
                </div>

                <div
                  class="add-new-user"
                  v-if="inventarObj.responsible.length > 0"
                >
                  <img
                    src="../../../../assets/images/plus_Black.png"
                    alt="plus"
                  />
                  <a href="#" @click.prevent="showDropdownUser"
                    >Neu hinzufügen
                  </a>
                </div>
              </div>
            </div>
            <div class="cloned">
              <div class="two-parts">
                <label for="Bearbeitung">Bearbeitung*:</label>
                <div
                  class="btn-wrapper"
                  v-if="inventarObj.editor.length == 0"
                  :class="{
                    'is-invalid': showInvalidEditor && !isValidUserEditor
                  }"
                >
                  <button
                    class="btn"
                    @click.prevent="showDropdownEditor"
                  ></button>
                  <span>Auswählen</span>
                </div>

                <div
                  v-for="(usr, index) in inventarObj.editor"
                  :key="index"
                  class="user-login"
                >
                  <div class="user-info">
                    <div class="user-initials">
                      <span>
                        {{ usr.firstName[0].toUpperCase()
                        }}{{ usr.lastName[0].toUpperCase() }}
                      </span>
                    </div>

                    <!-- <img src="../../../assets/images/avatars/001-man.svg" alt="avatar"> -->
                    <div class="user-info-email-name">
                      <h3>{{ usr.fullName }}</h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="close-btn"
                    @click.prevent="deleteUserEditor(usr)"
                  ></button>
                </div>
                <div class="add-new-user" v-if="inventarObj.editor.length > 0">
                  <img
                    src="../../../../assets/images/plus_Black.png"
                    alt="plus"
                  />
                  <a href="#" @click.prevent="showDropdownEditor"
                    >Neu hinzufügen
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="users-wrapper">
            <div class="cloned">
              <div class="one-part">
                <label for="Bearbeitung">Read Only:</label>
                <div
                  class="inventar-access-btn"
                  v-if="usersReadOnly.length == 0"
                >
                  <button
                    type="button"
                    class="btn"
                    @click.prevent="openReadOnlyModal = !openReadOnlyModal"
                  ></button>
                  <span>Auswählen</span>
                </div>

                <div
                  v-for="(usr, index) in usersReadOnly"
                  :key="index"
                  class="user-login"
                >
                  <div class="user-info">
                    <div class="user-initials">
                      <span>
                        {{ usr.firstName[0].toUpperCase()
                        }}{{ usr.lastName[0].toUpperCase() }}
                      </span>
                    </div>

                    <!-- <img src="../../../assets/images/avatars/001-man.svg" alt="avatar"> -->
                    <div class="user-info-email-name">
                      <h3>{{ usr.firstName }} {{ usr.lastName }}</h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="close-btn"
                    @click.prevent="deleteReadOnlyAccesser(usr, index)"
                  ></button>
                </div>
                <div class="add-new-user" v-if="usersReadOnly.length > 0">
                  <img
                    src="../../../../assets/images/plus_Black.png"
                    alt="plus"
                  />
                  <a
                    href="#"
                    @click.prevent="openReadOnlyModal = !openReadOnlyModal"
                    >Neu hinzufügen
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="read-user">
            <label for="Bearbeitung">Read/Write :</label>

            <div class="read-write-wrapper">
              <div
                class="read-write-btn-input"
                v-if="usersReadAndWrite.length == 0"
              >
                <div class="btn-holder">
                  <button
                    type="button"
                    class="btn"
                    @click.prevent="openReadWriteModal = !openReadWriteModal"
                  ></button>
                  <span>Auswählen</span>
                </div>
              </div>
              <div
                v-for="(usr, index) in usersReadAndWrite"
                :key="index"
                class="user-login"
              >
                <div class="user-info">
                  <div class="user-initials">
                    <span>
                      {{ usr.firstName[0].toUpperCase()
                      }}{{ usr.lastName[0].toUpperCase() }}
                    </span>
                  </div>

                  <!-- <img src="../../../assets/images/avatars/001-man.svg" alt="avatar"> -->
                  <div class="user-info-email-name">
                    <h3>{{ usr.firstName }} {{ usr.lastName }}</h3>
                  </div>
                </div>

                <button
                  type="button"
                  class="close-btn"
                  @click.prevent="deleteReadAndWriteAccesser(usr, index)"
                ></button>
              </div>
            </div>

            <div class="add-new-user" v-if="usersReadAndWrite.length > 0">
              <img src="../../../../assets/images/plus_Black.png" alt="plus" />
              <a
                href="#"
                @click.prevent="openReadWriteModal = !openReadWriteModal"
                >Neu hinzufügen
              </a>
            </div>
          </div>

          <h1>Adressen verwalten</h1>

          <div class="left-select">
            <div class="form-control-group mb">
              <div class="form-control">
                <label class="mb" for="Name"
                  >Inventarbesitzer hinzufügen:</label
                >
                <select
                  :class="{ open: !isOpenAddInventorySelect }"
                  v-model="selectedInventarUser"
                  @change="addInventarUser(selectedInventarUser)"
                >
                  <option selected disabled>Select a inventar user</option>
                  <option v-for="(user, index) in inventarUsers" :key="index">
                    {{ user.fullName }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <h6 class="mt">Inventareigentümer erstellen:</h6>
          <div class="horizontal-line"></div>
          <div class="form-control-group mt">
            <v-row>
              <v-col cols="6">
                <label for="Name">KundenLogin*:</label>
                <v-text-field
                  type="text"
                  :rules="nameRules"
                  v-model="inventarObj.inventoryOwner.username"
                  v-bind:disabled="inventoryOwnerUserSelected"
                  outlined
                  clearable
                  hide-details
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <label for="Total Bäume">Passwort*:</label>
                <v-text-field
                  type="password"
                  v-model="inventarObj.inventoryOwner.password"
                  min="7"
                  :rules="nameRules"
                  v-bind:disabled="inventoryOwnerUserSelected"
                  outlined
                  clearable
                  hide-details
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <label for="Total Bäume">KundenNr*:</label>
                <v-text-field
                  type="text"
                  :rules="nameRules"
                  v-model="inventarObj.inventoryOwner.userNumber"
                  outlined
                  clearable
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <label for="Name">Anrede*:</label>
                <v-text-field
                  type="text"
                  :rules="nameRules"
                  v-model="inventarObj.inventoryOwner.salutation"
                  outlined
                  clearable
                  hide-details
                  required
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <label for="ProjektNr">Vorname*:</label>
                <v-text-field
                  type="text"
                  :rules="nameRules"
                  v-model="inventarObj.inventoryOwner.lastName"
                  outlined
                  clearable
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <label for="Total Bäume">Name*:</label>
                <v-text-field
                  type="text"
                  :rules="nameRules"
                  v-model="inventarObj.inventoryOwner.firstName"
                  outlined
                  clearable
                  hide-details
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <label for="Total Bäume">Email*:</label>
                <v-text-field
                  type="text"
                  :rules="nameRules"
                  v-model="inventarObj.inventoryOwner.email"
                  v-bind:disabled="inventoryOwnerUserSelected"
                  outlined
                  clearable
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <label for="ProjektNr">Telefon*:</label>
                <v-text-field
                  type="text"
                  :rules="nameRules"
                  v-model="inventarObj.inventoryOwner.phoneNumber"
                  outlined
                  clearable
                  hide-details
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <label for="Total Bäume">Architekt*:</label>
                <v-text-field
                  type="text"
                  :rules="nameRules"
                  v-model="inventarObj.inventoryOwner.architect"
                  outlined
                  clearable
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <label for="Total Bäume">Gärtner vor Ort*:</label>
                <v-text-field
                  type="text"
                  :rules="nameRules"
                  v-model="inventarObj.inventoryOwner.gardener"
                  outlined
                  clearable
                  hide-details
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <label for="Total Bäume">Holzabfuhr*:</label>
                <v-text-field
                  type="text"
                  :rules="nameRules"
                  v-model="inventarObj.inventoryOwner.woodRemoval"
                  outlined
                  clearable
                  hide-details
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <v-row>
            <v-col cols="12">
              <label for="ProjektNr">Info:</label>
              <v-textarea
                v-model="inventarObj.info"
                type="text"
                :rules="nameRules"
                outlined
                clearable
                hide-details
                required
                variant="solo"
              ></v-textarea>
            </v-col>
          </v-row>

          <div class="addresse-wrapper">
            <!-- <div
                  class="form-control-group"
                  v-for="(address, index) in inventarObj.inventoryOwnerAddress"
                  :key="index"
                >
                  <div class="index-wrapper">
                    <div class="number-holder">
                      <span class="number"> {{ index + 1 }} </span>
                    </div>
                    <button
                      type="button"
                      class="close-btn-file"
                      @click.prevent="deleteAddress(address, index)"
                    ></button>
                  </div>
                  <div class="form-control-group" style="margin-top: 20px">
                    <div class="form-control">
                      <label for="Name">Inventar Name:</label>
                      <input type="text" :value="address.address" disabled />
                    </div>
                    <div class="form-control">
                      <label for="Name">Inventar Name:</label>
                      <input type="text" :value="address.location" disabled />
                    </div>
                    <div class="form-control">
                      <label for="Name">Inventar Name:</label>
                      <input type="text" :value="address.phoneNumber" disabled />
                    </div>
                    <div class="form-control">
                      <label for="Name">Inventar Name:</label>
                      <input type="text" :value="address.zipCode" disabled />
                    </div>
                  </div>
                </div>
              </div> -->

            <div
              class="form-control-group"
              v-for="(item, index) in clonedAddresse"
              :key="index"
              v-bind="item.classes"
            >
              <div class="index-wrapper">
                <div class="number-holder">
                  <span class="number"> {{ index + 1 }} </span>
                  <span>Adresse</span>
                </div>
                <button
                  v-if="clonedAddresse.length > 1"
                  type="button"
                  class="close-btn-file"
                  @click.prevent="deleteAddress(index)"
                ></button>
              </div>
              <v-row>
                <v-col cols="6">
                  <label for="adresse">Adresse*:</label>
                  <v-text-field
                    type="text"
                    v-model="item.inputs.address"
                    outlined
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label for="PLZ">PLZ*:</label>
                  <v-text-field
                    type="number"
                    v-model.number="item.inputs.zipCode"
                    outlined
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <label for="adresse">Ort*:</label>
                  <v-text-field
                    type="text"
                    v-model="item.inputs.location"
                    outlined
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label for="PLZ">Telefon*:</label>
                  <v-text-field
                    type="text"
                    v-model="item.inputs.phoneNumber"
                    outlined
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="add-new-user" v-if="addressObjectIsNotEmpty">
                <img
                  src="../../../../assets/images/plus_Black.png"
                  alt="plus"
                />
                <a href="#" @click.prevent="cloneFormAdresse(index)"
                  >Neue Adresse hinzufügen
                </a>
              </div>
            </div>
          </div>

          <h4 class="mt">Dokumente:</h4>

          <!-- Offer Upload -->

          <div class="form-control-group mt">
            <label for="ProjektNr" class="document-label">Offerte:</label>
            <div
              class="files"
              v-if="inventarObj.inventoryOfferDocuments.length"
            >
              <div
                class="file"
                v-for="(file, index) in documentFilesOffer"
                :key="index"
              >
                <a
                  :href="file.path"
                  target="blank"
                  v-if="file.path"
                  style="text-decoration:underline;width:100%;"
                >
                  <span>
                    {{ file.fileName }}
                  </span>
                </a>
                <span v-else>
                  {{ file.fileName }}
                </span>
                <button
                  type="button"
                  class="close-btn-file"
                  @click.prevent="deleteOfferDocumentFile(file, index)"
                ></button>
              </div>
            </div>
            <div
              class="form-control"
              :class="{ hide: hiddenDocumentInputOffer }"
              style="width: 100%"
            >
              <label for="ProjektNr" style="height: 24px"></label>
              <div class="coverage-div"></div>
              <input
                ref="documentFilesOffer"
                rows="5"
                type="file"
                id="fileInput-Offer"
                placeholder="Dokument hochladen"
                title="Dokument hochladen"
                @change="handleFileUploadOffer"
              />
            </div>
          </div>
          <div class="horizontal-line mt"></div>
          <div
            class="add-new-user"
            @click.prevent="openDocumentFilesOffer"
            v-if="hiddenDocumentInputOffer"
          >
            <img src="../../../../assets/images/plus_Black.png" alt="plus" />
            <a href="#">Neues Dokument hochladen </a>
          </div>

          <!-- Order uploader -->

          <div class="form-control-group mt">
            <label for="ProjektNr" class="document-label"
              >Auftragsbestätigung:</label
            >
            <div
              class="files"
              v-if="inventarObj.inventoryOrderDocuments.length"
            >
              <div
                class="file"
                v-for="(file, index) in documentFilesOrder"
                :key="index"
              >
                <a
                  :href="file.path"
                  target="blank"
                  v-if="file.path"
                  style="text-decoration:underline;width:100%;"
                >
                  <span>
                    {{ file.fileName }}
                  </span>
                </a>
                <span v-else>
                  {{ file.fileName }}
                </span>
                <button
                  type="button"
                  class="close-btn-file"
                  @click.prevent="deleteOrderDocumentFile(file, index)"
                ></button>
              </div>
            </div>

            <div
              class="form-control"
              :class="{ hide: hiddenDocumentInputOrder }"
              style="width: 100%"
            >
              <label for="ProjektNr" style="height: 24px"></label>
              <div class="coverage-div"></div>
              <input
                ref="documentFilesOrder"
                rows="5"
                type="file"
                id="fileInput-Order"
                placeholder="Dokument hochladen"
                title="Dokument hochladen"
                @change="handleFileUploadOrder"
              />
            </div>
          </div>
          <div class="horizontal-line mt"></div>

          <div
            class="add-new-user"
            @click.prevent="openDocumentFilesOrder"
            v-if="hiddenDocumentInputOrder"
          >
            <img src="../../../../assets/images/plus_Black.png" alt="plus" />
            <a href="#">Neues Dokument hochladen </a>
          </div>

          <!-- Invoice uploader -->

          <div class="form-control-group mt">
            <label for="ProjektNr" class="document-label">Rechnungen:</label>
            <div
              class="files"
              v-if="inventarObj.inventoryInvoiceDocuments.length"
            >
              <div
                class="file"
                v-for="(file, index) in documentFilesInvoice"
                :key="index"
              >
                <a
                  :href="file.path"
                  target="blank"
                  v-if="file.path"
                  style="text-decoration:underline;width:100%;"
                >
                  <span>
                    {{ file.fileName }}
                  </span>
                </a>
                <span v-else>
                  {{ file.fileName }}
                </span>
                <button
                  type="button"
                  class="close-btn-file"
                  @click.prevent="deleteInvoiceDocumentFile(file, index)"
                ></button>
              </div>
            </div>

            <div
              class="form-control"
              :class="{ hide: hiddenDocumentInputInvoice }"
              style="width: 100%"
            >
              <label for="ProjektNr" style="height: 24px"></label>
              <div class="coverage-div"></div>
              <input
                ref="documentFilesInvoice"
                rows="5"
                type="file"
                id="fileInput-Invoice"
                placeholder="Dokument hochladen"
                title="Dokument hochladen"
                @change="handleFileUploadInvoice"
              />
            </div>
          </div>
          <div class="horizontal-line mt"></div>

          <div
            class="add-new-user"
            @click.prevent="openDocumentFilesInvoice"
            v-if="hiddenDocumentInputInvoice"
          >
            <img src="../../../../assets/images/plus_Black.png" alt="plus" />
            <a href="#">Neues Dokument hochladen </a>
          </div>

          <h4 class="mt">Koordinaten</h4>

          <div class="cloned">
            <div
              class="form-control-group mt"
              v-for="(clonedDiv, index) in clonedDivsZeroPoints"
              :key="'item-' + index"
              v-bind="clonedDiv.classes"
            >
              <div class="number-holder">
                <span class="number">{{ index + 1 }}</span>
                <span class="text">Koordinaten:</span>
              </div>
              <div class="horizontal-line mb"></div>
              <v-row>
                <v-col cols="6">
                  <label for="Name">L*</label>
                  <!-- <input type="number" v-model="clonedDiv.input1" :class="{ 'is-invalid': showInvalidKoordinatenInput1 && !isValidKordinateInput1 }"/> -->
                  <v-text-field
                    type="text"
                    :rules="nameRules"
                    v-model.number="clonedDiv.inputs.input1"
                    outlined
                    clearable
                    hide-details
                    required
                    @input="validateKordinatenInput1(index)"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label for="ProjektNr">B*</label>
                  <v-text-field
                    type="text"
                    :rules="nameRules"
                    v-model.number="clonedDiv.inputs.input2"
                    outlined
                    clearable
                    hide-details
                    required
                    @input="validateKordinatenInput2(index)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="horizontal-line mt"></div>
              <div class="add-new-user mb">
                <div class="form-control-add-new">
                  <img
                    src="../../../../assets/images/plus_Black.png"
                    alt="plus"
                    style="width: 15px; height: 15px"
                  />
                  <a @click.prevent="cloneForm(index)"
                    >Neuen punkt hinzufügen</a
                  >
                </div>
                <button ref="submitCordinates" class="hidden-button">
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div class="form-control-group mt">
            <div class="form-control">
              <input type="button" value="Abbrechen" id="abbrechen-btn" @click="cancelDialog = true" />
            </div>
            <div class="form-control">
              <input
                type="button"
                value="Erstellen"
                id="erstellen-btn"
                @click.prevent="editInventar"
              />
            </div>
          </div>
        </v-form>
      </div>
      <div class="map" id="map">
        <Map ref="childComponent" v-on:latlngs-updated="handleEventLatlngs" />
      </div>

      <!-- User popup -->

      <div class="user-modal" v-if="openUserModal">
        <h2 class="title">Inventar neues Mitglied</h2>
        <img
          class="close_icon"
          src="../../../../assets/images/close_white.png"
          alt=""
          @click.prevent="closeModal"
        />
        <div class="user-wrapper mt">
          <div v-for="(usr, index) in AllUsers" :key="index" class="user-login">
            <div class="user-info">
              <div class="user-initials">
                <span>
                  {{ usr.firstName[0].toUpperCase()
                  }}{{ usr.lastName[0].toUpperCase() }}
                </span>
              </div>

              <!-- <img src="../../../assets/images/avatars/001-man.svg" alt="avatar"> -->
              <div class="user-info-email-name">
                <h3>{{ usr.fullName }}</h3>
              </div>
            </div>
            <div class="btn-wrapper">
              <button
                type="button"
                class="btn"
                @click.prevent="addUser(usr)"
                v-if="responsibleModal"
              ></button>
              <button
                type="button"
                class="btn"
                @click.prevent="addEditor(usr)"
                v-else-if="editorModal"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- User readOnly popup -->

      <div class="user-modal" v-if="openReadOnlyModal">
        <v-snackbar v-model="snackbarModal" top color="danger">
          <div>{{ snackbarMessageModal }}</div>
          <template v-slot:action="{ attrs }">
            <v-btn
              color=""
              text
              v-bind="attrs"
              @click.prevent="snackbarModal = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
        <h2 class="title">Inventar neues Mitglied</h2>
        <img
          class="close_icon"
          src="../../../../assets/images/close_white.png"
          alt=""
          @click.prevent="openReadOnlyModal = !openReadOnlyModal"
        />
        <div class="user-wrapper mt">
          <div v-for="(usr, index) in users" :key="index" class="user-login">
            <div class="user-info">
              <div class="user-initials">
                <span>
                  {{ usr.firstName[0].toUpperCase()
                  }}{{ usr.lastName[0].toUpperCase() }}
                </span>
              </div>

              <!-- <img src="../../../assets/images/avatars/001-man.svg" alt="avatar"> -->
              <div class="user-info-email-name">
                <h3>{{ usr.fullName }}</h3>
              </div>
            </div>
            <div class="select-btn-wrapper">
              <div class="read-only">
                <select
                  @click.prevent="toggleReadOnlySelect"
                  :class="{ open: !isOpenReadOnlySelect }"
                  :value="selectedExpirationsReadOnly[index]"
                  @change="onExpiryChangedRead($event.target.value, index)"
                >
                  <option value="" disabled>Expiration</option>
                  <option value="1">1 day</option>
                  <option value="7">1 week</option>
                  <option value="30">1 month</option>
                  <option value="365">1 year</option>
                </select>
              </div>
              <button
                type="button"
                class="btn"
                @click.prevent="addUserReadOnlyExpiration(usr, index)"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- User read/write Popup -->

      <div class="user-modal" v-if="openReadWriteModal">
        <v-snackbar v-model="snackbarModal" top color="danger">
          <div>{{ snackbarMessageModal }}</div>
          <template v-slot:action="{ attrs }">
            <v-btn
              color=""
              text
              v-bind="attrs"
              @click.prevent="snackbarModal = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
        <h2 class="title">Inventar neues Mitglied</h2>
        <img
          class="close_icon"
          src="../../../../assets/images/close_white.png"
          alt=""
          @click.prevent="closeModal"
        />
        <div class="user-wrapper mt">
          <div v-for="(usr, index) in users" :key="index" class="user-login">
            <div class="user-info">
              <div class="user-initials">
                <span>
                  {{ usr.firstName[0].toUpperCase()
                  }}{{ usr.lastName[0].toUpperCase() }}
                </span>
              </div>

              <!-- <img src="../../../assets/images/avatars/001-man.svg" alt="avatar"> -->
              <div class="user-info-email-name">
                <h3>{{ usr.fullName }}</h3>
              </div>
            </div>
            <div class="select-btn-wrapper">
              <div class="read-only">
                <v-select
                  v-model="selectedAreaReadWrite[index]"
                  :items="areaOptions"
                  multiple
                  label="Select areas"
                  :class="{ open: usr.isOpenReadAndWriteAreaSelect }"
                  @blur="toggleReadAndWriteAreaSelect(usr)"
                  @input="onAreaChanged($event, index)"
                ></v-select>
              </div>
              <div class="read-only">
                <select
                  @click.prevent="toggleReadAndWriteSelect(usr)"
                  :class="{ open: usr.isOpenReadAndWriteSelect }"
                  :value="selectedExpirationsReadWrite[index]"
                  @change="onExpiryChangedWrite($event.target.value, index)"
                >
                  <option value="" disabled>Expiration</option>
                  <option value="1">1 day</option>
                  <option value="7">1 week</option>
                  <option value="30">1 month</option>
                  <option value="365">1 year</option>
                </select>
              </div>
              <button
                type="button"
                class="btn"
                @click.prevent="addUserReadWriteExpiration(usr, index)"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Succesfully Dialog -->
      <template>
        <div class="text-center">
          <v-dialog v-model="createInventarDialog" width="auto">
            <img
              src="../../../../assets/images/black-check.png"
              alt="check"
              style="width: 41px; height: 29px"
            />

            <v-card-text>
              {{ beforeRedirectMessage }}
            </v-card-text>
          </v-dialog>
        </div>
      </template>
     
      <div class="delete-popup" v-show="deleteDialog" ref="deletePopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="deleteDialog = false"
          >mdi mdi-close</v-icon
        >

        <p class="title">Inventar Löschen</p>

        <div class="description-holder">
          <v-icon color="#C82210" class="popup-icon"
            >mdi mdi-trash-can-outline</v-icon
          >

          <p class="description">
            Wollen Sie diesen Inventar wirklich löschen? Dieser Vorgang kann
            nicht rückgängig gemacht werden.
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
            @click="deleteInventar"
          >
            Löschen
          </v-btn>
        </div>
      </div>
    </div>
      <div class="cancel-popup" v-if="cancelDialog" ref="cancelPopup">
      <div class="popup-holder">
        <v-icon size="36" class="close-popup" @click="cancelDialog = false"
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
            @click="cancelDialog = false"
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
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import router from "@/router";
import axios from "axios";
import Vue from "vue/dist/vue.esm.js";
import Map from "../map/map.vue";
import CustomLoader from "../../../../components/custom_components/CustomLoader.vue";
export default {
  beforeRouteLeave(to, from, next) {
    if (this.nextRoute || this.allowNavigate) {
      next();
    } else {
      this.nextRoute = to;
      this.cancelDialog = true;
    }
  },
  name: "edit-inventar",
  components: {
    Map,
    CustomLoader
  },
  data() {
    return {
      cancelDialog: false,
      isLoading: false,
      allowNavigate: false,
      nextRoute: null,
      inventarObj: {
        id: "",
        name: "",
        projectNumber: "",
        responsible: [],
        editor: [],
        info: "",
        inventoryOwner: {
          id: 0,
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          phoneNumber: "",
          info: "string",
          password: "",
          confirmPassword: "",
          userNumber: 0,
          salutation: "",
          architect: "",
          gardener: "",
          woodRemoval: ""
        },
        inventoryOwnerAddress: [],
        inventoryRegion: [],
        inventoryAccess: [],
        inventoryOfferDocuments: [],
        inventoryOrderDocuments: [],
        inventoryInvoiceDocuments: []
      },
      nameRules: [v => !!v || "Name is required"],
      inventoryOwnerUserSelected: false,
      hiddenDocumentInputOffer: false,
      hiddenDocumentInputOrder: false,
      hiddenDocumentInputInvoice: false,
      documentFilesOffer: [],
      documentFilesOrder: [],
      documentFilesInvoice: [],
      usersReadOnly: [],
      usersReadAndWrite: [],
      selectedExpirationsReadOnly: [],
      selectedExpirationsReadWrite: [],
      selectedAreaReadWrite: [],
      areaOptions: [
        { value: 1, text: "Tree" },
        { value: 2, text: "Tasks" },
        { value: 3, text: "Tree Examination" }
      ],
      selectedOption: null,
      clonedDivsResponsible: [{ methods: {} }],
      clonedDivsEditor: [{ methods: {} }],
      snackbar: false,
      snackbarMessage: "",
      dropdownVisibleForEditor: false,
      responsibleModal: false,
      editorModal: false,
      openUserModal: false,
      openReadOnlyModal: false,
      openReadWriteModal: false,
      openAddresseModal: false,
      AllUsers:[],
      users: [],
      createInventarDialog: false,
      beforeRedirectMessage: "",
      inventarUsers: [],
      clonedAddresse: [
        {
          inputs: {
            id: 0,
            address: "",
            zipCode: 0,
            location: "",
            phoneNumber: "",
            isValidAddress: true,
            isValidzipCode: true,
            isValidlocation: true,
            isValidphoneNumber: true
          },
          classes: [{ class: "form-control-group mt" }],
          isDuplicatedWith: null
        }
      ],
      clonedDivsZeroPoints: [],
      objects: [],
      centerCordinates: [],
      mapRegions: [],
      selectedInventarUser: "Select a inventar user",
      isOpenAddInventorySelect: false,
      isOpenResponsibleSelect: false,
      isOpenEditingSelect: false,
      isOpenReadOnlySelect: false,
      isOpenReadAndWriteSelect: false,
      isOpenReadAndWriteAreaSelect: false,
      clonedDivsBearbeitung: [{ class: "one-part" }],
      clonedDivsVerantwortlicher: [{ class: "two-parts green" }],
      clonedDivsReadOnly: [{ class: "two-parts red" }],
      clonedDivsReadWrite: [{ class: "one-part" }],
      clonedDivsOfferte: [{ class: "form-control-group mt" }],
      clonedDivsOrder: [{ class: "form-control-group mt" }],
      clonedDivsBills: [{ class: "form-control-group mt" }],
      clonedDivsPointOne: [{ class: "form-control-group mt" }],
      // myRules: [
      //   v => !!v || 'Field is required',
      //   v => (v && v.length <= 10) || 'Field must be less than 10 characters',
      // ],
      // clonedDivsZeroPoints: [
      //   { class: "form-control-group mt" },
      //   { class: "form-control-group mt" },
      //   { class: "form-control-group mt" },
      // ],
      snackbarModal: false,
      snackbarMessageModal: "",
      cordinates: [],
      showInvalidName: false,
      showInvalidProjectNr: false,
      showInvalidTotalBaume: false,
      showInvalidResponsible: false,
      showInvalidEditor: false,
      showInvalidKundenLogin: false,
      showInvalidPasswort: false,
      showInvalidKundenNr: false,
      showInvalidAnrede: false,
      showInvalidVorname: false,
      showInvalidNameOwner: false,
      showInvalidEmail: false,
      showInvalidTelefon: false,
      showInvalidArchitekt: false,
      showInvalidGärtner: false,
      showInvalidHolzabfuhr: false,
      showInvalidAdresse: false,
      showInvalidPLZ: false,
      showInvalidOrt: false,
      showInvalidTelefonAddresse: false,
      showInvalidKoordinatenInput1: false,
      showInvalidKoordinatenInput2: false,
      selectedValue: false,
      base64ImageEdit: "",
      loading: true,
      deleteDialog: false
    };
  },
  computed: {
    objectsSortedByIndex() {
      return this.objects.sort((a, b) => {
        const indexDiff = a.index - b.index;
        return indexDiff !== 0
          ? indexDiff
          : this.clonedDivsZeroPoints.indexOf(a) -
              this.clonedDivsZeroPoints.indexOf(b);
      });
    },
    addressObjectIsNotEmpty() {
      return (
        this.clonedAddresse[0].inputs.address != "" &&
        this.clonedAddresse[0].inputs.zipCode != "" &&
        this.clonedAddresse[0].inputs.location != "" &&
        this.clonedAddresse[0].inputs.phoneNumber != ""
      );
    },
    passwordDisplay() {
      return this.inventarObj.inventoryOwner.password.substring(0, 8);
    },
    isValidName() {
      return this.inventarObj.name.length != "";
    },
    isValidProjectNumber() {
      return this.inventarObj.projectNumber.length != "";
    },
    isValidUserResponsible() {
      return this.inventarObj.responsible.length > 0;
    },
    isValidUserEditor() {
      return this.inventarObj.editor.length > 0;
    },
    isValidKundenLogin() {
      return this.inventarObj.inventoryOwner.username.length > 0;
    },
    isValidPassword() {
      return this.inventarObj.inventoryOwner.password.length > 0;
    },
    isValidPhoneNumber() {
      return this.inventarObj.inventoryOwner.phoneNumber.length > 0;
    },
    isValidFirstName() {
      return this.inventarObj.inventoryOwner.firstName.length > 0;
    },
    isValidLastName() {
      return this.inventarObj.inventoryOwner.lastName.length > 0;
    },
    isValidEmail() {
      return this.inventarObj.inventoryOwner.email.length > 0;
    },

    isValidUserNumber() {
      return (
        this.inventarObj.inventoryOwner.userNumber !== null &&
        !isNaN(this.inventarObj.inventoryOwner.userNumber)
      );
    },
    isValidSalutation() {
      return this.inventarObj.inventoryOwner.salutation.length > 0;
    },
    isValidArchitect() {
      return this.inventarObj.inventoryOwner.architect.length > 0;
    },
    isValidGardener() {
      return this.inventarObj.inventoryOwner.gardener.length > 0;
    },
    isValidWoodRemoval() {
      return this.inventarObj.inventoryOwner.woodRemoval.length > 0;
    },
    isValidAdress() {
      return this.inventarObj.inventoryOwnerAddress.addresse.length > 0;
    },
    isValidPLZ() {
      return (
        this.inventarObj.inventoryOwnerAddress.plz !== null &&
        !isNaN(this.inventarObj.inventoryOwnerAddress.plz)
      );
    },
    isValidOrt() {
      return this.inventarObj.inventoryOwnerAddress.ort.length > 0;
    },
    isValidTelefon() {
      return this.inventarObj.inventoryOwnerAddress.telefon.length > 0;
    },

    isComputedValidForm() {
      return (
        this.isValidName &&
        this.isValidProjectNumber &&
        this.isValidUserResponsible &&
        this.isValidUserEditor &&
        this.isValidKundenLogin &&
        this.isValidPassword &&
        this.isValidPhoneNumber &&
        this.isValidFirstName &&
        this.isValidLastName &&
        this.isValidEmail &&
        this.isValidUserNumber &&
        this.isValidSalutation &&
        this.isValidArchitect &&
        this.isValidGardener &&
        this.isValidWoodRemoval
      );
    }
  },
  methods: {
    isValidKordinateInput1() {
      this.clonedDivsZeroPoints.forEach(f => {
        f.inputs.isValidInput1 =
          f.inputs.input1 != null && f.inputs.input1 != "";
      });
      return this.clonedDivsZeroPoints.every(item => item.inputs.isValidInput1);
    },
    isValidKordinateInput2() {
      this.clonedDivsZeroPoints.forEach(f => {
        f.inputs.isValidInput2 =
          f.inputs.input2 != null && f.inputs.input2 != "";
      });
      return this.clonedDivsZeroPoints.every(item => item.inputs.isValidInput2);
    },
    isValidAddresses() {
      this.clonedAddresse.forEach(c => {
        c.inputs.isValidAddress =
          c.inputs.address != "" && c.inputs.address != null;
      });
      return this.clonedAddresse.every(item => item.inputs.isValidAddress);
    },
    isValidZipCode() {
      this.clonedAddresse.forEach(c => {
        c.inputs.isValidzipCode =
          c.inputs.zipCode != 0 && c.inputs.zipCode != null;
      });
      return this.clonedAddresse.every(item => item.inputs.isValidzipCode);
    },
    isValidLocation() {
      this.clonedAddresse.forEach(c => {
        c.inputs.isValidlocation =
          c.inputs.location != null && c.inputs.location != "";
      });
      return this.clonedAddresse.every(item => item.inputs.isValidlocation);
    },
    isValidPhoneNumberAddress() {
      this.clonedAddresse.forEach(c => {
        c.inputs.isValidphoneNumber =
          c.inputs.phoneNumber != "" && c.inputs.phoneNumber != null;
      });
      return this.clonedAddresse.every(item => item.inputs.isValidphoneNumber);
    },

    isValidForm() {
      const isValidKoordinates1 = this.isValidKordinateInput1();
      const isValidKoordinates2 = this.isValidKordinateInput2();
      // const isValidAddresses = this.isValidAddresses();
      // const isValidZipCode = this.isValidZipCode();
      // const isValidLocation = this.isValidLocation();
      // const isValidPhoneNumberAddress = this.isValidPhoneNumberAddress();
      return (
        isValidKoordinates1 &&
        isValidKoordinates2 
        // isValidAddresses &&
        // isValidZipCode &&
        // isValidLocation &&
        // isValidPhoneNumberAddress
      );
    },
    validateName() {
      this.showInvalidName = true;
    },

    validateProjectNumber() {
      this.showInvalidProjectNr = true;
    },

    validateTotalTrees() {
      this.showInvalidTotalBaume = true;
    },
    validateOwnerUsername() {
      this.showInvalidKundenLogin = true;
    },
    validateOwnerPassword() {
      this.showInvalidPasswort = true;
    },
    validateOwnerUserNumber() {
      this.showInvalidKundenNr = true;
    },
    validateOwnerSalutation() {
      this.showInvalidAnrede = true;
    },
    validateOwnerLastName() {
      this.showInvalidVorname = true;
    },
    validateOwnerFirstName() {
      this.showInvalidNameOwner = true;
    },
    validateOwnerEmail() {
      this.showInvalidEmail = true;
    },
    validateOwnerTelefon() {
      this.showInvalidTelefon = true;
    },
    validateOwnerArchitect() {
      this.showInvalidArchitekt = true;
    },
    validateOwnerGardener() {
      this.showInvalidGärtner = true;
    },
    validateOwnerWoodRemoval() {
      this.showInvalidHolzabfuhr = true;
    },

    validateOrt(index) {
      if (
        this.clonedAddresse[index].inputs.location != null &&
        this.clonedAddresse[index].inputs.location != ""
      ) {
        this.clonedAddresse[index].inputs.isValidlocation = true;
      } else {
        this.clonedAddresse[index].inputs.isValidlocation = false;
      }
    },
    validateTelefon(index) {
      if (
        this.clonedAddresse[index].inputs.phoneNumber != null &&
        this.clonedAddresse[index].inputs.phoneNumber != ""
      ) {
        this.clonedAddresse[index].inputs.isValidphoneNumber = true;
      } else {
        this.clonedAddresse[index].inputs.isValidphoneNumber = false;
      }
    },
    validatePlz(index) {
      if (
        this.clonedAddresse[index].inputs.zipCode != null &&
        this.clonedAddresse[index].inputs.zipCode != ""
      ) {
        this.clonedAddresse[index].inputs.isValidzipCode = true;
      } else {
        this.clonedAddresse[index].inputs.isValidzipCode = false;
      }
    },
    validateAdresse(index) {
      if (
        this.clonedAddresse[index].inputs.address != null &&
        this.clonedAddresse[index].inputs.address != ""
      ) {
        this.clonedAddresse[index].inputs.isValidAddress = true;
      } else {
        this.clonedAddresse[index].inputs.isValidAddress = false;
      }
    },
    validateKordinatenInput1(index) {
      if (
        this.clonedDivsZeroPoints[index].inputs.input1 != null &&
        this.clonedDivsZeroPoints[index].inputs.input1 != ""
      )
        this.clonedDivsZeroPoints[index].inputs.isValidInput1 = true;
      else this.clonedDivsZeroPoints[index].inputs.isValidInput1 = false;
    },
    validateKordinatenInput2(index) {
      if (
        this.clonedDivsZeroPoints[index].inputs.input2 != null &&
        this.clonedDivsZeroPoints[index].inputs.input2 != ""
      )
        this.clonedDivsZeroPoints[index].inputs.isValidInput2 = true;
      else this.clonedDivsZeroPoints[index].inputs.isValidInput2 = false;
    },
    deleteInventar() {
      const id = this.$route.params.id;
      this.loading = true;
      axios
        .delete(`https://tilia.rrota.org/api/Inventory/Delete/${id}`)
        .then(response => {
          if (response.status == 200) {
            this.allowNavigate = true;
            this.loading = false;
            this.createInventarDialog = true;
            this.beforeRedirectMessage = `${this.inventarObj.name} was deleted succesfuly.`;
            setTimeout(() => {
              this.deleteDialog = false;
              this.$router.push({ name: "Inventar" });
            }, 2000);
          }
        })
        .catch(error => {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          this.loading = false;
          console.log(error);
          this.snackbar = true;
          this.snackbarMessage = "Something went wrong!";

          // ...
        });
    },
    openDeleteDialog() {
      this.deleteDialog = true;
    },
    goBack() {
      this.$router.back();
    },
    redirectToList() {
      if (this.nextRoute) {
        this.$router.push(this.nextRoute);
      } else {
        this.allowNavigate = true;
        this.$router.push({
          name: "Inventar"
        });
      }
    },

    handleEventLatlngs(lnglat) {
      this.cordinates = lnglat;
      if (this.cordinates.length >= 1) {
        const newArr = [];
        for (let i = 0; i < this.cordinates.length; i++) {
          newArr.push({
            inputs: {
              input1: this.cordinates[i][0],
              isValidInput1: true,
              input2: this.cordinates[i][1],
              isValidInput2: true
            },
            classes: [{ class: "form-control-group mt" }],
            isDuplicatedWith: null
          });
        }
        this.clonedDivsZeroPoints = newArr;
      } else {
        this.clonedDivsZeroPoints = [
          {
            inputs: {
              input1: null,
              isValidInput1: true,
              input2: null,
              isValidInput2: true
            },
            classes: [{ class: "form-control-group mt" }],
            isDuplicatedWith: null
          }
        ];
      }
    },
    generateRandomNumber() {
      return Math.floor(Math.random() * 1000000);
    },
    cloneForm(index) {
      this.clonedDivsZeroPoints.splice(index + 1, 0, {
        inputs: {
          input1: null,
          isValidInput1: true,
          input2: null,
          isValidInput2: true
        },
        classes: [{ class: "form-control-group mt" }]
      });
      // this.objects.forEach((object) => {
      //   if (object.index > index) {
      //     object.index += 1;
      //   }
      // });
    },

    cloneFormAdresse(index) {
      this.clonedAddresse.splice(index + 1, 0, {
        inputs: {
          id: 0,
          address: "",
          zipCode: 0,
          location: "",
          phoneNumber: ""
        },
        classes: [{ class: "form-control-group mt" }],
        isDuplicatedWith: null
      });
    },
    addAdresses() {
      let uniqueArray = [];

      this.clonedAddresse.forEach((element, index, array) => {
        const isDuplicated = uniqueArray.some(item => {
          return (
            item.id === parseInt(element.inputs.id) &&
            item.address === parseInt(element.inputs.address) &&
            item.zipCode === parseInt(element.inputs.zipCode) &&
            item.location === parseInt(element.inputs.location) &&
            item.phoneNumber === parseInt(element.inputs.phoneNumber)
          );
        });
        if (!isDuplicated) {
          uniqueArray.push({
            id: element.inputs.id,
            address: element.inputs.address,
            zipCode: parseInt(element.inputs.zipCode),
            location: element.inputs.location,
            phoneNumber: element.inputs.phoneNumber
          });
          element.isDuplicatedWith = null;
        } else {
          element.isDuplicatedWith = array.findIndex(
            f =>
              f.inputs.id === element.inputs.id &&
              f.inputs.address === element.inputs.address &&
              f.inputs.zipCode === element.inputs.zipCode &&
              f.inputs.location === element.inputs.location &&
              f.inputs.phoneNumber === element.inputs.phoneNumber
          );
        }
      });
      this.inventarObj.inventoryOwnerAddress = uniqueArray;
    },
    addKoordinates() {
      let uniqueArray = [];

      this.clonedDivsZeroPoints.forEach((element, index, array) => {
        const isDuplicated = uniqueArray.some(item => {
          return (
            item.latitude === element.inputs.input1 &&
            item.longitude === element.inputs.input2
          );
        });

        if (!isDuplicated) {
          uniqueArray.push({
            latitude: element.inputs.input1,
            longitude: element.inputs.input2
          });
          element.isDuplicatedWith = null;
        } else {
          element.isDuplicatedWith = array.findIndex(
            f =>
              f.inputs.input1 === element.inputs.input1 &&
              f.inputs.input2 === element.inputs.input2
          );
        }
      });

      this.inventarObj.inventoryRegion = uniqueArray;
    },

    deleteUserResponsible(user) {
      const deleteUser = this.inventarObj.responsible.filter(el => el !== user);
      this.inventarObj.responsible = deleteUser;
    },
    deleteUserEditor(user) {
      const deleteUser = this.inventarObj.editor.filter(el => el !== user);
      this.inventarObj.editor = deleteUser;
    },
    addUser(user) {
      this.inventarObj.responsible.push(user);
      this.openUserModal = false;
      this.responsibleModal = false;
    },
    addEditor(user) {
      this.inventarObj.editor.push(user);
      this.openUserModal = false;
      this.editorModal = false;
    },
    addUserReadOnlyExpiration(user, index) {
      const expiry = this.selectedExpirationsReadOnly[index];
      if (!expiry) {
        this.snackbarModal = true;
        this.snackbarMessageModal = "Please Select an expiration";
        // If no expiry is selected, add a red border to the select element
        return;
      }
      const data = {
        userId: user.id,
        readOnly: true,
        readOnlyExpireDays: parseInt(this.selectedExpirationsReadOnly[index]),
        readAndWrite: false,
        readAndWriteExpireDays: 0,
        area: [],
      };

      this.inventarObj.inventoryAccess.push(data);

      if (user) {
        const userSelected = this.users.find(usr => usr.id == user.id);

        this.usersReadOnly.push(userSelected);
        this.openReadOnlyModal = false;
      }
    },

    addUserReadWriteExpiration(user, index) {
      const expiry = this.selectedExpirationsReadWrite[index];
      if (!expiry) {
        this.snackbarModal = true;
        this.snackbarMessageModal = "Please Select an expiration";
        // If no expiry is selected, add a red border to the select element
        return;
      }

      const data = {
        userId: user.id,
        readOnly: false,
        readOnlyExpireDays: 0,
        readAndWrite: true,
        readAndWriteExpireDays: parseInt(
          this.selectedExpirationsReadWrite[index]
        ),
        area: this.selectedAreaReadWrite[index].flat(1)
      };

      this.inventarObj.inventoryAccess.push(data);
      this.usersReadAndWrite.push(user);
      this.openReadWriteModal = false;
      this.readWriteArea = "";
    },

    addInventarUser(user) {
      if (user) {
        this.inventoryOwnerUserSelected = true;

        const userSelected = this.inventarUsers.find(el => el.fullName == user);
        this.inventarObj.inventoryOwner.id = userSelected.id;
        this.inventarObj.inventoryOwner.firstName = userSelected.firstName;
        this.inventarObj.inventoryOwner.lastName = userSelected.lastName;
        this.inventarObj.inventoryOwner.email = userSelected.email;
        this.inventarObj.inventoryOwner.username = userSelected.username;
        this.inventarObj.inventoryOwner.phoneNumber = userSelected.phoneNumber;
        this.inventarObj.inventoryOwner.password = userSelected.password;
        this.inventarObj.inventoryOwner.confirmPassword = "";
        this.inventarObj.inventoryOwner.info = "";
        this.inventarObj.inventoryOwner.userNumber = userSelected.userNumber;
        this.inventarObj.inventoryOwner.salutation = userSelected.salutation;
        this.inventarObj.inventoryOwner.architect = userSelected.architect;
        this.inventarObj.inventoryOwner.gardener = userSelected.gardener;
        this.inventarObj.inventoryOwner.woodRemoval = userSelected.woodRemoval;
      }
    },
    addAdress() {
      const newAddrese = {
        id: 0,
        address: this.addresse,
        zipCode: parseInt(this.plz),
        location: this.ort,
        phoneNumber: this.telefon
      };

      this.inventarObj.inventoryOwnerAddress.push(newAddrese);

      this.addresse = "";
      this.plz = 0;
      this.ort = "";
      this.telefon = "";
      this.openAddresseModal = false;
    },
    handleFileUploadOffer(event) {
      this.documentFilesOffer.push({ fileName: event.target.files[0].name });
      this.hiddenDocumentInputOffer = true;
      const fileExtension = event.target.files[0].name.split(".").pop();

      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");
        const newEvent = {
          nameBase64: base64String,
          fileName: event.target.files[0].name,
          fileExtension: fileExtension
        };
        this.inventarObj.inventoryOfferDocuments.push(newEvent);
      };
    },
    handleFileUploadOrder(event) {
      this.documentFilesOrder.push({ fileName: event.target.files[0].name });
      this.hiddenDocumentInputOrder = true;
      const fileExtension = event.target.files[0].name.split(".").pop();

      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");
        const newEvent = {
          nameBase64: base64String,
          fileName: event.target.files[0].name,
          fileExtension: fileExtension
        };
        this.inventarObj.inventoryOrderDocuments.push(newEvent);
      };
    },
    handleFileUploadInvoice(event) {
      this.documentFilesInvoice.push({ fileName: event.target.files[0].name });
      this.hiddenDocumentInputInvoice = true;
      const fileExtension = event.target.files[0].name.split(".").pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");
        const newEvent = {
          nameBase64: base64String,
          fileName: event.target.files[0].name,
          fileExtension: fileExtension
        };
        this.inventarObj.inventoryInvoiceDocuments.push(newEvent);
      };
    },
    openDocumentFilesOffer() {
      this.$refs.documentFilesOffer.click();
    },

    openDocumentFilesOrder() {
      this.$refs.documentFilesOrder.click();
    },
    openDocumentFilesInvoice() {
      this.$refs.documentFilesInvoice.click();
    },
    deleteReadOnlyAccesser(user, index) {
      const deleteAcceser = this.inventarObj.inventoryAccess.filter(
        el => el.id !== user.id
      );
      this.inventarObj.inventoryAccess = deleteAcceser;

      const deleteUser = this.usersReadOnly.filter(el => el !== user);
      this.usersReadOnly = deleteUser;
    },
    deleteReadAndWriteAccesser(user, index) {
      const deleteAcceser = this.inventarObj.inventoryAccess.filter(
        el => el.id !== user.id
      );
      this.inventarObj.inventoryAccess = deleteAcceser;

      const deleteUser = this.usersReadAndWrite.filter(el => el !== user);
      this.usersReadAndWrite = deleteUser;
    },
    deleteOfferDocumentFile(file, index) {
      const deleteFileInDocumentFiles = this.documentFilesOffer.filter(
        el => el !== file
      );
      this.documentFilesOffer = deleteFileInDocumentFiles;
      const deleteFile = this.inventarObj.inventoryOfferDocuments.filter(
        (item, i) => i !== index
      );
      this.inventarObj.inventoryOfferDocuments = deleteFile;
      if (this.inventarObj.inventoryOfferDocuments.length == 0) {
        this.hiddenDocumentInputOffer = false;
      }
    },
    deleteOrderDocumentFile(file, index) {
      const deleteFileInDocumentFiles = this.documentFilesOrder.filter(
        el => el !== file
      );
      this.documentFilesOrder = deleteFileInDocumentFiles;
      const deleteFile = this.inventarObj.inventoryOrderDocuments.filter(
        (item, i) => i !== index
      );
      this.inventarObj.inventoryOrderDocuments = deleteFile;
      if (this.inventarObj.inventoryOrderDocuments.length == 0) {
        this.hiddenDocumentInputOrder = false;
      }
    },

    deleteInvoiceDocumentFile(file, index) {
      const deleteFileInDocumentFiles = this.documentFilesInvoice.filter(
        el => el !== file
      );
      this.documentFilesInvoice = deleteFileInDocumentFiles;
      const deleteFile = this.inventarObj.inventoryInvoiceDocuments.filter(
        (item, i) => i !== index
      );
      this.inventarObj.inventoryInvoiceDocuments = deleteFile;
      if (this.inventarObj.inventoryInvoiceDocuments.length == 0) {
        this.hiddenDocumentInputInvoice = false;
      }
    },
    deleteAddress(index) {
      this.clonedAddresse = this.clonedAddresse.filter(
        (address, i) => i !== index
      );
    },

    editInventar() {
      (this.showInvalidName = true),
        (this.showInvalidProjectNr = true),
        (this.showInvalidTotalBaume = true),
        (this.showInvalidResponsible = true),
        (this.showInvalidEditor = true),
        (this.showInvalidKundenLogin = true),
        (this.showInvalidPasswort = true),
        (this.showInvalidKundenNr = true),
        (this.showInvalidAnrede = true),
        (this.showInvalidVorname = true),
        (this.showInvalidNameOwner = true),
        (this.showInvalidEmail = true),
        (this.showInvalidTelefon = true),
        (this.showInvalidArchitekt = true),
        (this.showInvalidGärtner = true),
        (this.showInvalidHolzabfuhr = true);
      const valid = this.$refs.editForm.validate();

      if (valid && this.isValidForm()) {
        this.loading = true;
        this.addAdresses();
        this.addKoordinates();

        let getDuplicates = this.clonedDivsZeroPoints.reduce(
          (acc, item, index, array) => {
            if (item.isDuplicatedWith != undefined) {
              return (
                acc +
                `Koordinate ${index +
                  1} is duplicated with Koordinate ${item.isDuplicatedWith +
                  1} \n`
              );
            }
            return acc;
          },
          ""
        );
        if (getDuplicates != "" && getDuplicates != null) {
          this.snackbar = true;
          this.snackbarMessage = getDuplicates;
        } else {
          axios
            .put(
              "https://tilia.rrota.org/api/Inventory/Update",
              this.inventarObj
            )
            .then(response => {
              if (response && response.status == 200) {
                this.allowNavigate = true;
                this.loading = false;
                this.createInventarDialog = true;
                this.beforeRedirectMessage = `${this.inventarObj.name} was updated succesfuly.`;
                const id = this.$route.params.id;
                setTimeout(() => {
                  this.$router.push({
                    name: "InventarInfo",
                    query: { id: id },
                    params: { title: this.inventarObj.name }
                  });
                }, 2000);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      } else {
        this.snackbar = true;
        this.snackbarMessage = "Please complete all inputs that are required!";
      }
    },
    getAllUsers() {
      return new Promise((resolve, reject) => {
    axios
      .get("https://tilia.rrota.org/api/User/GetAll")
      .then(response => {
        console.log("AllUsers", response.data);
        this.AllUsers = response.data;
        resolve(); // Resolve the promise when data is assigned
      })
      .catch(error => {
        console.log(error);
        reject(error); // Reject the promise if there's an error
      });
    });
    },
   getFieldWorkers() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://tilia.rrota.org/api/Inventory/FieldWorkers")
      .then((response) => {
        this.users = response.data;
        console.log("hyni te userat ", response.data);
        resolve();
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
},

    getInventoryUsers() {
      this.loading = true;
      axios
        .get("https://tilia.rrota.org/api/Inventory/InventoryOwners")
        .then(response => {
          if (response.status == 200) {
            this.inventarUsers = response.data;
            this.loading = false;
          }
        })
        .catch(error => {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          console.log(error);

          // ...
        });
    },
    getMapDataRegions() {
      axios
        .get("https://tilia.rrota.org/api/Inventory/MapRegion")
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
   async getEditData() {
      
      // get the ID parameter from the route
      const id = this.$route.params.id;
      const year = this.$route.params.year;
      try {
        await this.getAllUsers(); // Wait for all users to be fetched before proceeding
        await this.getFieldWorkers();

        // Rest of the code...
      } catch (error) {
        console.log(error);
        this.snackbar = true;
        if (error.message == "Request failed with status code 404") {
          this.snackbarMessage =
            "data not fetched successfully, You may have a network problem!";
        } else {
          this.snackbarMessage = "Something went wrong, Please try again!";
        }
      }
      // make a request to fetch the data for the specified ID
     await axios
        .get(`https://tilia.rrota.org/api/Inventory/Get/${id}/${year}`)
        .then(response => {
          if (response.status == 200) {
            this.loading = true;
            const id = this.$route.params.id;

            const data = response.data;

            const coordinates = data.inventoryRegion.map(
              ({ latitude, longitude }) => [latitude, longitude]
            );

            this.$emit("send-cordinates", coordinates);

            this.centerCordinates = coordinates;
            // update the inventarObj object with the returned data

            const responsibleUserIds = data.responsible.map(usr => usr.id);
            const editorUserIds = data.editor.map(usr => usr.id);


            const filteredUsersResponsible = this.AllUsers.filter(user =>
              responsibleUserIds.includes(user.id)
            );
            const editorFilteredUsers = this.AllUsers.filter(user =>
              editorUserIds.includes(user.id)
            );

            
              const useratReandWrite = data.inventoryAccess.filter(
              el => el.readAndWrite == true
            );
             const currentDate = new Date();

              useratReandWrite.forEach(item => {
                const expireDate = new Date(item.readAndWriteExpireDays);
                const timeDiff = expireDate.getTime() - currentDate.getTime();
                const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                item.readAndWriteExpireDays = daysLeft;
                item.readOnlyExpireDays = 0
              });

              this.usersReadAndWrite = useratReandWrite


            const useratRead = data.inventoryAccess.filter(
              el => el.readOnly == true
            );                

              useratRead.forEach(item => {
                const expireDate = new Date(item.readOnlyExpireDays);
                const timeDiff = expireDate.getTime() - currentDate.getTime();
                const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                item.readOnlyExpireDays = daysLeft;
                item.readAndWriteExpireDays = 0

              });

              this.usersReadOnly = useratRead;

              const combinedArrayInventoryAccesUsers = [...this.usersReadAndWrite, ...this.usersReadOnly];

            console.log('useratReandWrite',useratReandWrite);
            console.log('useratRead',useratRead);
            

            this.inventarObj.id = id;
            this.$set(this.inventarObj, "name", data.name);
            this.$set(this.inventarObj, "projectNumber", data.projectNumber);
            this.$set(this.inventarObj, "info", data.info);
            this.$set(
              this.inventarObj,
              "responsible",
              filteredUsersResponsible
            );
            this.$set(this.inventarObj, "editor", editorFilteredUsers);
            this.$set(this.inventarObj, "inventoryOwner", data.inventoryOwner);
            this.$set(this.inventarObj, "inventoryAccess", combinedArrayInventoryAccesUsers);


            if (
              data.inventoryOwner.password &&
              data.inventoryOwner.username &&
              data.inventoryOwner.email
            ) {
              this.inventoryOwnerUserSelected = true;
            }

            data.inventoryOfferDocuments.map(item => {
              const img = `${item.document}`;
              fetch(img)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                  const base64 = btoa(
                    String.fromCharCode(...new Uint8Array(buffer))
                  );
                  const newEvent = {
                    id: item.id,
                    nameBase64: base64,
                    fileName: item.fileName,
                    fileExtension: item.fileName.split(".").pop()
                  };

                  this.inventarObj.inventoryOfferDocuments.push(newEvent);
                })
                .then(data => {
                  if (this.inventarObj.inventoryOfferDocuments.length > 0) {
                    this.hiddenDocumentInputOffer = true;
                  }
                })
                .catch(error => {
                  console.error(error);
                });

              const newEventToshow = {
                fileName: item.fileName,
                path: item.document
              };

              this.documentFilesOffer.push(newEventToshow);
            });

            data.inventoryOrderDocuments.map(item => {
              const img = `${item.document}`;
              fetch(img)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                  const base64 = btoa(
                    String.fromCharCode(...new Uint8Array(buffer))
                  );
                  const newEvent = {
                    id: item.id,
                    nameBase64: base64,
                    fileName: item.fileName,
                    fileExtension: item.fileName.split(".").pop()
                  };

                  this.inventarObj.inventoryOrderDocuments.push(newEvent);
                })
                .then(data => {
                  if (this.inventarObj.inventoryOrderDocuments.length > 0) {
                    this.hiddenDocumentInputOrder = true;
                  }
                })
                .catch(error => {
                  console.error(error);
                });

              const newEventToshow = {
                fileName: item.fileName,
                path: item.document
              };

              this.documentFilesOrder.push(newEventToshow);
            });

            data.inventoryInvoiceDocuments.map(item => {
              const img = `${item.document}`;
              fetch(img)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                  const base64 = btoa(
                    String.fromCharCode(...new Uint8Array(buffer))
                  );
                  const newEvent = {
                    id: item.id,
                    nameBase64: base64,
                    fileName: item.fileName,
                    fileExtension: item.fileName.split(".").pop()
                  };

                  this.inventarObj.inventoryInvoiceDocuments.push(newEvent);
                })
                .then(data => {
                  if (this.inventarObj.inventoryInvoiceDocuments.length > 0) {
                    this.hiddenDocumentInputInvoice = true;
                  }
                })
                .catch(error => {
                  console.error(error);
                });

              const newEventToshow = {
                fileName: item.fileName,
                path: item.document
              };

              this.documentFilesInvoice.push(newEventToshow);
            });

            if(data.inventoryOwnerAddress.length){
              this.clonedAddresse = data.inventoryOwnerAddress.map(item => ({
              inputs: {
                id: 0,
                address: item.address,
                zipCode: item.zipCode,
                location: item.location,
                phoneNumber: item.phoneNumber,
                isValidAddress: true,
                isValidzipCode: true,
                isValidlocation: true,
                isValidphoneNumber: true
              },
              classes: [{ class: "form-control-group mt" }],
              isDuplicatedWith: null
            }));
            }

            this.clonedDivsZeroPoints = data.inventoryRegion.map(item => ({
              inputs: {
                input1: item.latitude,
                isValidInput1: true,
                input2: item.longitude,
                isValidInput2: true
              },
              classes: [{ class: "form-control-group mt" }],
              isDuplicatedWith: null
            }));
          }

          this.loading = false;
          console.log("clonedAddress",this.clonedAddresse);
        })
        .catch(error => {
          console.log(error);
          this.snackbar = true;
          if (error.message == "Request failed with status code 404") {
            this.snackbarMessage =
              "data not fetched succesfully, You may have a network problem!";
          } else {
            this.snackbarMessage = "Something went wrong, Please try again!";
          }
        });
    },
    showDropdownUser() {
      this.showInvalidResponsible = true;
      this.openUserModal = !this.openUserModal;
      this.responsibleModal = !this.responsibleModal;
    },
    showDropdownEditor() {
      this.showInvalidEditor = true;
      this.openUserModal = !this.openUserModal;
      this.editorModal = !this.editorModal;
    },
    closeModal() {
      this.openUserModal = false;
      this.editorModal = false;
      this.responsibleModal = false;
      this.openReadOnlyModal = false;
      this.openReadWriteModal = false;
      this.openAddresseModal = false;
    },
    ...mapActions(["mapRegion"]),
    toggleAddinventorySelect() {
      this.isOpenAddInventorySelect = !this.isOpenAddInventorySelect;
    },
    toggleReadOnlySelect() {
      this.isOpenReadOnlySelect = !this.isOpenReadOnlySelect;
    },
    setInitialUserStates() {
      this.users.forEach(usr => {
        usr.isOpenReadAndWriteSelect = false; // Set isOpenReadAndWriteSelect to false for each user
      });
    },
    toggleReadAndWriteAreaSelect(usr) {
      this.users.forEach(u => {
        if (u === usr) {
          u.isOpenReadAndWriteAreaSelect = !u.isOpenReadAndWriteAreaSelect;
        } else {
          u.isOpenReadAndWriteAreaSelect = false;
        }
      });
    },
    toggleReadAndWriteSelect(usr) {
      this.users.forEach(u => {
        if (u === usr) {
          u.isOpenReadAndWriteSelect = !u.isOpenReadAndWriteSelect;
        } else {
          u.isOpenReadAndWriteSelect = false;
        }
      });
    },
    onAreaChanged(value, index) {
      this.$set(this.selectedAreaReadWrite, index, value);
    },
    onExpiryChangedWrite(value, index) {
      this.$set(this.selectedExpirationsReadWrite, index, value);
    },
    onExpiryChangedRead(value, index) {
      this.selectedValue = true;
      this.$set(this.selectedExpirationsReadOnly, index, value);
    }
  },

  created() {
    this.selectedExpirationsReadOnly = Array(this.users.length).fill(1);
    this.selectedExpirationsReadWrite = Array(this.users.length).fill(1);
    // this.getAllUsers();
    this.getMapDataRegions();
    this.getInventoryUsers();

  },

  mounted() {
    setTimeout(() => {
      this.getEditData();
    },100)
  }
};
</script>

<style lang="scss">
.v-text-field--outlined .v-text-field__prefix {
  max-height: 54px !important;
  max-width: 52px !important;
}

.v-text-field input {
  padding: 8px 0px 8px 4px !important;
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

.v-dialog {
  width: 668px;
  height: 115px;
  background: #1db954;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 20px;
}
.v-card__text {
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 29px;
  letter-spacing: 0.1px;

  /* UI/Background */

  color: #151914;
}
.is-invalid {
  border-color: red !important;
}
.open {
  background-color: #1c1e1c !important;
}
.mb {
  margin-bottom: 30px;
}

.mt {
  margin-top: 30px;
}

.hide {
  display: none !important;
}
.close-btn-file {
  width: 26px;
  height: 26px;
  background-image: url("../../../../assets/images/close_white.png");
  background-repeat: no-repeat;
  background-position: center;
}
.document-label {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}
.form-control-group {
  width: 100%;
  margin: 0 auto;
  margin-top: 50px;
  display: flex;
  flex-wrap: wrap;
}
.hidden-button {
  display: none;
}
.index-wrapper {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  span {
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: #ffffff;
  }
}
.form-control {
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff !important;
  width: 50%;
  padding-right: 10px;
  position: relative;
  input {
    width: 100%;
    height: 42px;
    background: #1c1e1c;
    border: 1px solid #757575;
    color: #fff;
    border-radius: 5px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.read-only {
  select {
    width: 106px;
    height: 32px;
    color: #fff;
    background-color: #1c1e1c;

    border: 1px solid #494949;
    margin-right: 10px;
    padding: 2px 10px;
    background-image: url("../../../../assets/images/arrow-down.png");
    background-repeat: no-repeat;
    background-position: right 10px center;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    &.open {
      color: #fff;
      background-color: #1c1e1c;
    }
  }
}

.files {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .file {
    width: 47%;
    padding: 5px;
    height: 52px;
    margin: 5px;
    border: 1px solid rgb(73, 73, 73);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  margin-bottom: 50px;

  .edit-inventar {
    width: 50%;
    border-right: 20px solid #757575;
    box-sizing: border-box;
    overflow: scroll;
    padding-bottom: 30px;

    .link-control {
      display: flex;
      justify-content: space-between;
    }

    &::-webkit-scrollbar {
      width: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #1db954;
      border-radius: 3px;
    }

    .horizontal-line {
      background: #494949;
      height: 1px;
      margin-top: 20px;
      width: 95%;
    }

    .abbrechen {
      margin-right: 30px;
      margin-bottom: 20px;
      float: right;
      color: #c82210;
      text-decoration: underline;
    }

    h1 {
      font-style: normal;
      font-weight: 500;
      font-size: 25px;
      line-height: 38px;
      color: #ffffff;
      margin-bottom: 30px;
      margin-top: 30px;
    }

    form {
      width: 100%;
      padding-bottom: 150px;
      padding-left: 2px;
      overflow-x: hidden;
      .number-holder {
        display: flex;
        align-items: center;

        .number {
          display: flex;
          width: 35px;
          height: 35px;
          border: 1px solid green;
          border-radius: 50%;
          /* text-align: center; */
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          background: #1db954;
          color: black;
          font-style: normal;
          font-weight: 400;
          font-size: 18px;
          line-height: 27px;
        }

        .text {
          font-style: normal;
          font-weight: 500;
          font-size: 18px;
          line-height: 27px;
          color: #ffffff;
        }
      }

      .form-control-group {
        width: 100%;
        margin: 0 auto;
        margin-top: 50px;
        display: flex;
        flex-wrap: wrap;

        .form-control {
          display: flex;
          flex-direction: column;
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          color: #ffffff !important;
          width: 50%;
          padding-right: 10px;
          position: relative;
          .hide {
            display: none !important;
          }
          .coverage-div {
            width: 95%;
            position: absolute;
            top: 26px;
            height: 23px;
            transform: translate(1.5%, 0);
            background: #1c1e1c;
            z-index: 1;
          }

          #abbrechen-btn {
            color: #fff;
            border: 1px solid #fff;
            border-radius: 5px;
            font-style: normal;
            font-weight: 500;
            font-size: 18px;
            line-height: 27px;
            letter-spacing: 0.1px;
          }

          #erstellen-btn {
            background: #1db954;
            font-style: normal;
            font-weight: 500;
            font-size: 18px;
            line-height: 27px;
            letter-spacing: 0.1px;
            color: #151914;
            border: 1px solid #1db954;
            border-radius: 5px;
          }

          input {
            width: 100%;
            height: 42px;
            background: #1c1e1c;
            border: 1px solid #757575;
            color: #fff;
            border-radius: 5px;
            margin-right: 10px;
            margin-bottom: 10px;
          }

          input[type="file"] {
            width: 100%;
            height: 120px;
            background: #1c1e1c;
            border: 1px solid #757575;
            border-radius: 5px;
            margin-right: 10px;
            margin-bottom: 10px;
            position: relative;

            &::-webkit-file-upload-button {
              visibility: hidden;
            }

            &::file-selector-button {
              visibility: hidden;
            }

            &::before {
              content: "";
              display: inline-block;
              background-image: url("../../../../assets/images/choose-file.png");
              cursor: pointer;
              color: #fff;
              width: 42px;
              height: 35px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -100%);
            }

            &::after {
              content: "Dokument hochladen";
              display: inline-block;
              padding: 5px 8px;
              cursor: pointer;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, 40%);
              font-style: normal;
              font-weight: 400;
              font-size: 14px;
              line-height: 21px;
              color: #757575;
            }
          }

          textarea {
            width: 100%;
            height: auto;
            background: #1c1e1c;
            color: #fff;
            border: 1px solid #757575;
            border-radius: 5px;
            margin-right: 10px;
            margin-bottom: 10px;
          }
          .hide {
            display: none !important;
          }
        }
      }

      .left-select {
        select {
          height: 42px;
          width: 250px;
          color: #fff;
          border: 1px solid #494949;
          padding: 2px 10px;
          background-image: url("../../../../assets/images/arrow-down.png");
          background-repeat: no-repeat;
          background-position: right 10px center;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        select.open {
          background-color: #1c1e1c;
        }
      }

      .users-wrapper {
        width: 100%;
        display: flex;
        margin-top: 30px;
        .cloned {
          width: 100%;
          display: flex;
          flex-direction: column;

          .user-login {
            width: 95%;
            height: 70px;
            border-bottom: 1px solid #494949;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .btn-wrapper {
              width: 95%;
              height: 70px;
              /* padding-bottom: 15px; */
              border-bottom: 1px solid #494949;
              display: flex;
              align-items: center;
              cursor: pointer;
            }
            .user-info {
              display: flex;
              align-items: center;

              .user-initials {
                width: 32px;
                height: 32px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                border: 1px solid #494949;

                span {
                  font-style: normal;
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 24px;
                  letter-spacing: -0.006em;
                  color: #1db954;
                }
              }

              img {
                width: 40px;
                height: 40px;
              }

              .user-info-email-name {
                margin-left: 10px;

                h3 {
                  font-style: normal;
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 24px;
                  color: #fff;
                  margin-bottom: 0;
                }

                span {
                  font-style: normal;
                  font-weight: 400;
                  font-size: 14px;
                  line-height: 24px;
                  color: #fff;
                }
              }
            }

            .close-btn {
              background-image: url("../../../../assets/images/close_red.png");
              width: 26px;
              height: 26px;
              background-repeat: no-repeat;
            }
            img {
              width: 16px;
              height: 16px;
              margin-right: 15px;
              cursor: pointer;
            }
          }

          .one-part {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-right: 10px;
            padding-bottom: 10px;

            .form-control {
              width: 90%;
              height: 42px;
              background: #1c1e1c;
              border: 1px solid #757575;
              border-radius: 5px;
              margin-right: 10px;
              margin-bottom: 10px;

              #area {
                width: 100%;
                height: 41px;
              }
            }

            .horizontal-line {
              background: #494949;
              height: 1px;
              width: 95%;
              margin-top: 18px;
            }

            label {
              margin-bottom: 19px;
              font-style: normal;
              font-weight: 500;
              font-size: 16px;
              line-height: 24px;
              color: #ffffff;
            }

            .user-login {
              width: 50%;
            }

            .inventar-access-btn {
              width: 50%;
              height: 70px;
              /* padding-bottom: 15px; */
              border-bottom: 1px solid #494949;
              display: flex;
              align-items: center;
              cursor: pointer;

              .btn {
                background-image: url("../../../../assets/images/plus_white.png");
                background-position: center;
                font-size: 12px;
                font-weight: bold;
                display: inline-block;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px dashed #fff;
              }

              span {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
                color: #ffffff;
                margin-left: 10px;
              }
            }
            .btn-wrapper {
              width: 95%;
              height: 70px;
              /* padding-bottom: 15px; */
              border-bottom: 1px solid #494949;
              display: flex;
              align-items: center;
              cursor: pointer;

              .btn {
                background-image: url("../../../../assets/images/plus_white.png");
                background-position: center;
                font-size: 12px;
                font-weight: bold;
                display: inline-block;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px dashed #fff;
              }

              span {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
                color: #ffffff;
                margin-left: 10px;
              }
            }
          }
          .two-parts {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-right: 10px;
            padding-bottom: 10px;

            .form-control {
              width: 90%;
              height: 42px;
              background: #1c1e1c;
              border: 1px solid #757575;
              border-radius: 5px;
              margin-right: 10px;
              color: #fff;
              margin-bottom: 10px;
            }

            .horizontal-line {
              background: #494949;
              height: 1px;
              width: 95%;
              margin-top: 18px;
            }

            label {
              margin-bottom: 19px;
              font-style: normal;
              font-weight: 500;
              font-size: 16px;
              line-height: 24px;
              color: #ffffff;
            }

            .btn-wrapper {
              width: 95%;
              height: 70px;
              /* padding-bottom: 15px; */
              border-bottom: 1px solid #494949;
              display: flex;
              align-items: center;
              cursor: pointer;

              .btn {
                background-image: url("../../../../assets/images/plus_white.png");
                background-position: center;
                font-size: 12px;
                font-weight: bold;
                display: inline-block;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px dashed #fff;
              }

              span {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
                color: #ffffff;
                margin-left: 10px;
              }
            }
          }
        }
      }

      .read-user {
        width: 100%;
        display: flex;
        margin-top: 30px;
        flex-direction: column;
        label {
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          color: #ffffff;
        }
        .read-write-wrapper {
          width: 100%;
          display: flex;
          align-items: flex-end;
          margin-top: 30px;

          .user-login {
            width: 50%;
            height: 70px;
            border-bottom: 1px solid #494949;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-right: 10px;
            .btn-wrapper {
              width: 95%;
              height: 70px;
              /* padding-bottom: 15px; */
              border-bottom: 1px solid #494949;
              display: flex;
              align-items: center;
              cursor: pointer;
            }
            .user-info {
              display: flex;
              align-items: center;

              .user-initials {
                width: 32px;
                height: 32px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                border: 1px solid #494949;

                span {
                  font-style: normal;
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 24px;
                  letter-spacing: -0.006em;
                  color: #1db954;
                }
              }

              img {
                width: 40px;
                height: 40px;
              }

              .user-info-email-name {
                margin-left: 10px;

                h3 {
                  font-style: normal;
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 24px;
                  color: #fff;
                  margin-bottom: 0;
                }

                span {
                  font-style: normal;
                  font-weight: 400;
                  font-size: 14px;
                  line-height: 24px;
                  color: #fff;
                }
              }
            }

            .close-btn {
              background-image: url("../../../../assets/images/close_red.png");
              width: 26px;
              height: 26px;
              background-repeat: no-repeat;
            }
            img {
              width: 16px;
              height: 16px;
              margin-right: 15px;
              cursor: pointer;
            }
          }
          .read-write-btn-input {
            width: 50%;
            margin-right: 10px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding-bottom: 15px;
            border-bottom: 1px solid #494949;
            label {
              margin-bottom: 10px;
            }
            .btn-holder {
              display: flex;
              align-items: center;
              .btn {
                background-image: url("../../../../assets/images/plus_white.png");
                background-position: center;
                font-size: 12px;
                font-weight: bold;
                display: inline-block;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px dashed #fff;
              }

              span {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
                color: #ffffff;
                margin-left: 10px;
              }
            }
          }

          .form-control {
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            margin-right: 10px;
            input {
              width: 100%;
              height: 42px;
              background: #1c1e1c;
              border: 1px solid #757575;
              color: #fff;
              border-radius: 5px;
              margin-right: 10px;
              margin-top: 20px;
            }
          }
        }
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
    }
  }

  #map {
    width: 50%;
    height: calc(100vh - 75px);
    z-index: 0;
  }

  // Modal popups

  .user-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 667px;
    background: #1c1e1c;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    z-index: 8000;
    .title {
      margin-top: 22px;
      text-align: center;
      /* font-family: 'Poppins'; */
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 30px;
      color: #ffffff;
    }
    .close_icon {
      position: absolute;
      right: 30px;
      top: 28px;
      cursor: pointer;
    }

    .user-wrapper {
      height: 525px;
      overflow-y: auto;
      padding: 10px;

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

      .user-login {
        width: 100%;
        height: 70px;
        background: #1c1e1c;
        border-bottom: 1px solid #494949;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        margin: 0 auto;
        cursor: pointer;

        .btn {
          background-image: url("../../../../assets/images/plus_white.png");
          background-position: center;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px dashed #fff;
        }

        span {
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 21px;
          color: #ffffff;
        }

        .user-info {
          display: flex;
          align-items: center;
          padding: 10px;

          .user-initials {
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border: 1px solid #494949;

            span {
              font-style: normal;
              font-weight: 500;
              font-size: 18px;
              line-height: 24px;
              letter-spacing: -0.006em;
              color: #1db954;
            }
          }

          img {
            width: 40px;
            height: 40px;
          }

          .user-info-email-name {
            margin-left: 30px;

            h3 {
              font-style: normal;
              font-weight: 500;
              font-size: 16px;
              line-height: 24px;
              color: #fff;
            }

            span {
              font-style: normal;
              font-weight: 400;
              font-size: 14px;
              line-height: 24px;
              color: #fff;
            }
          }
        }

        img {
          width: 16px;
          height: 16px;
          margin-right: 15px;
          cursor: pointer;
        }
      }

      .select-btn-wrapper {
        display: flex;
        align-items: center;
        #area {
          width: 100%;
          height: 33px;
          background: #1c1e1c;
          border: 1px solid #757575;
          color: #fff;
          border-radius: 5px;
          margin-right: 10px;
          margin-bottom: 10px;
        }

        .btn {
          background-image: url("../../../../assets/images/plus_white.png");
          background-position: center;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px dashed #fff;
        }
      }
    }

    .form-control-group {
      width: 475px;
      margin: 0 auto;
      margin-top: 50px;
      display: flex;
      flex-wrap: wrap;

      .form-control {
        display: flex;
        flex-direction: column;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #ffffff !important;
        width: 50%;
        padding-right: 10px;
        position: relative;

        .coverage-div {
          width: 95%;
          position: absolute;
          top: 26px;
          height: 23px;
          transform: translate(1.5%, 0);
          background: #1c1e1c;
          z-index: 1;
        }

        #abbrechen-btn {
          color: #fff;
          border: 1px solid #fff;
          border-radius: 5px;
          font-style: normal;
          font-weight: 500;
          font-size: 18px;
          line-height: 27px;
          letter-spacing: 0.1px;
        }

        #erstellen-btn {
          background: #1db954;
          font-style: normal;
          font-weight: 500;
          font-size: 18px;
          line-height: 27px;
          letter-spacing: 0.1px;
          color: #151914;
          border: 1px solid #1db954;
          border-radius: 5px;
        }

        input {
          width: 100%;
          height: 42px;
          background: #1c1e1c;
          border: 1px solid #757575;
          color: #fff;
          border-radius: 5px;
          margin-right: 10px;
          margin-bottom: 10px;
        }

        input[type="file"] {
          width: 100%;
          height: 120px;
          background: #1c1e1c;
          border: 1px solid #757575;
          border-radius: 5px;
          margin-right: 10px;
          margin-bottom: 10px;
          position: relative;

          &::-webkit-file-upload-button {
            visibility: hidden;
          }

          &::file-selector-button {
            visibility: hidden;
          }

          &::before {
            content: "";
            display: inline-block;
            background-image: url("../../../../assets/images/choose-file.png");
            cursor: pointer;
            color: #fff;
            width: 42px;
            height: 35px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -100%);
          }

          &::after {
            content: "Dokument hochladen";
            display: inline-block;
            padding: 5px 8px;
            cursor: pointer;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, 40%);
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 21px;
            color: #757575;
          }
        }

        textarea {
          width: 100%;
          height: auto;
          background: #1c1e1c;
          border: 1px solid #757575;
          border-radius: 5px;
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .addrese-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    padding: 10px;
    background: #1c1e1c;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    z-index: 8000;
    .close_icon {
      position: absolute;
      right: 30px;
      top: 28px;
      cursor: pointer;
    }
    #erstellen-btn {
      background: #1db954;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 27px;
      letter-spacing: 0.1px;
      color: #151914;
      border: 1px solid #1db954;
      border-radius: 5px;
    }
  }
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
.cancel-btn {
  border: 1px solid #e5e5e5;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}

.save-btn {
  background-color: #1db954 !important;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #151914 !important;
}

@media screen and (max-width: 820px) {
  .wrapper {
    .edit-inventar {
      width: 50%;

      .user-wrapper {
        width: 100%;
      }
    }

    .map {
      width: 50%;
    }
  }
}
</style>
