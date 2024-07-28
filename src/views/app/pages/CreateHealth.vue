<template>
  <v-dialog v-model="visible" max-height="500" max-width="700">
    <v-card>
      <v-toolbar dense color="gray" dark>
        <v-toolbar-title class="title" style="float:center;">Neue Gesundheit</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-row>
            <v-col cols="5">
            <v-text-field class="textFieldOne" style="margin-top: 50px;" label="Abkürzung" outlined v-model="health.name" :rules="rules.name"></v-text-field>
            </v-col>
            <v-col cols="6">
               <v-text-field class="textFieldTwo" style="margin-top: 50px;" label="Beschreibung" outlined v-model="health.description" :rules="rules.description" ></v-text-field>
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
import UpdateHealth from "./UpdateHealth";

export default {
  props: {
    health: {
      type: Object,
      default: () => ({ id: null, name: "", description: "" }),
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
      name: [
        (v) => !!v || "Name ist erforderlich",
        (v) => (v && v.split("").length <= 4) || "Die Name darf höchstens 4 Wörter umfassen",
      ],
       description: [(v) => !!v || "Beschreibung ist erforderlich"],
      }
    };
  },
  computed: {
    formTitle() {
      return this.health && this.health.id ? "Massnahme bearbeiten" : "Neue Massnahme";
    },
    validForm() {
      return !!this.health.name && !!this.health.description;
    },
  },
  components: {
    UpdateHealth,
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
        name: this.health.name,
        description: this.health.description,
        
      };

      if (!this.health.id) {
        console.log("REQUEST",requestBody)
        axios
          .post("https://tilia.rrota.org/api/Health/Create", requestBody)
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
              this.alertText = "Das neue Gesundheit wurde erfolgreich erstellt";
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } 
          })
          .catch((error) => {
            console.log(error);
            this.isLoading = false;
             this.alertColor = "error"; 
            this.alertText = "Fehler beim Erstellen der Gesundheit";
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