<template>
  <v-dialog v-model="visible" max-height="500" max-width="700">
    <v-card>
      <v-toolbar dense color="gray" dark>
        <v-toolbar-title class="title" style="float:center;">Neues Insekt</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-row>
            <v-col cols="5">
            <v-text-field class="textFieldOne" style="margin-top: 50px;" label="Abkürzung" outlined v-model="insect.abbreviation" :rules="rules.abbreviation"></v-text-field>
            </v-col>
            <v-col cols="6">
               <v-text-field class="textFieldTwo" style="margin-top: 50px;" label="Deutsch" outlined v-model="insect.germanName" :rules="rules.germanName" ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
           <v-text-field class="textFieldThree" style="margin-top: 25px;" label="Latin" outlined v-model="insect.latinName"  :rules="rules.latinName"></v-text-field>            </v-col>
            </v-col>
          </v-row>
          <v-row>
            <v-btn type="abbrechen" class="emptyForm" style="margin-left:175px;" :loading="isLoading" color="gray" @click="closeModal">Abbrechen</v-btn>
        
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
import UpdateInsect from "./UpdateInsect";

export default {
  props: {
    insect: {
      type: Object,
      default: () => ({ id: null, abbreviation: "", germanName: "", latinName: "" }),
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
      germanName: [(v) => !!v || "Deutscher Name ist erforderlich"],
    },
    };
  },
  computed: {
    formTitle() {
      return this.insect && this.insect.id ? "insect bearbeiten" : "Neue insect";
    },
    validForm() {
      return !!this.insect.germanName && !!this.insect.latinName && !!this.insect.abbreviation;
    },
  },
  components: {
    UpdateInsect,
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
        abbreviation: this.insect.abbreviation,
        germanName: this.insect.germanName,
        latinName: this.insect.latinName,
      };

      if (!this.insect.id) {
        console.log("REQUEST",requestBody)
        axios
          .post("https://tilia.rrota.org/api/InsectType/Create", requestBody)
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
              this.alertText = "Das neue Insekt wurde erfolgreich erstellt";
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          })
          .catch((error) => {
            console.log(error);
            this.isLoading = false;
            this.showAlert = true;
            this.alertColor = "error"; 
            this.alertText = "Fehler beim Erstellen der Insekt";
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
