<template>
  <v-dialog v-model="visible" max-height="500" max-width="700">
    <v-card>
      <v-toolbar dense color="gray" dark>
        <v-toolbar-title class="title" style="float:center;">Neue Stoffeinträge</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-row>
            <v-col cols="5">
              <v-text-field class="textFieldOne" style="margin-top: 50px;" label="Abkürzung" outlined v-model="substance.abbreviation" :rules=rules.abbreviation></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field class="textFieldTwo" style="margin-top: 50px;" label="Namme" outlined v-model="substance.name" :rules=rules.name></v-text-field>
            </v-col>
          </v-row>
          <v-row>
          </v-row>
          <v-row>
            <v-btn type="abbrechen" class="emptyForm" style="margin-left:110px;" :loading="isLoading" color="gray" @click="closeModal">Abbrechen</v-btn>
          
        <v-btn type="submit"
         class="emptyForm" 
         style="margin-left:25px; max-width:360px; text-color:black;" 
         :loading="isLoading" 
         color="primary"
         >Erstellen
         </v-btn>
      </v-row>
    </v-form>
    <v-alert type="success" dismissible elevation="20" v-show="showAlert" :color="alertColor" class="alert">
          {{ alertText }}
        </v-alert>
  </v-card-text>
</v-card>

  </v-dialog>
</template>
<script>
import axios from "axios";
import UpdateSubstance from "./UpdateSubstance";

export default {
  props: {
    substance: {
      type: Object,
      default: () => ({ id: null, abbreviation: "", name: "" }),
    },
    visible: Boolean,
    itemList: Array,
  },
  data() {
    return {
      isLoading: false,
      dialog: false,
      showAlert: false,
      alertText: "",
      alertColor:"",
      rules: {
      abbreviation: [
        (v) => !!v || "Abkürzung ist erforderlich",
        (v) => (v && v.split("").length <= 4) || "Die Abkürzung darf höchstens 4 Wörter umfassen",
      ],
      name: [(v) => !!v || "Deutscher Name ist erforderlich"],
    },
    };
  },
  computed: {
    formTitle() {
      return this.substance && this.substance.id ? "Bewuchs bearbeiten" : "Bewuchs Massnahme";
    },
    validForm() {
      return !!this.substance.abbreviation && !!this.substance.name;
    },
  },
  components: {
    UpdateSubstance,
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    showUpdateDialog() {
      this.dialog = true;
    },
    submitForm() {
      this.isLoading = true;

      const requestBody = {
        abbreviation: this.substance.abbreviation,
        name: this.substance.name,
        
      };

      if (!this.substance.id) {
        console.log("REQUEST",requestBody)
        axios
          .post("https://tilia.rrota.org/api/OtherSubstanceInputs/Create", requestBody)
          .then((response) => {
            this.isLoading = false;
            if (Array.isArray(this.itemList)) {
              this.$set(this.itemList, this.itemList.length, response.data);
            } else {
              this.itemList = [response.data];
            }
           if (response.status === 200) {
              // console.log("TREE TYPE CREATED: ", response);
              this.showAlert = true;
              this.alertColor="success"
              this.alertText = "Das neue Stoffeinträge wurde erfolgreich erstellt";
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } 
          })
          .catch((error) => {
            console.log(error);
            this.isLoading = false;
            this.alertColor = "error"; 
            this.alertText = "Fehler beim Erstellen der Stoffeinträge";
          });
      }
    },
  },
};

</script>
<style>
.alert {
  position: fixed;
  width: 100%;
  max-width: 784px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 100px;

}
</style>
