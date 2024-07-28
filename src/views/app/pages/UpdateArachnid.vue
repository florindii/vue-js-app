 <template>
 <v-dialog v-model="visible" max-height="500" max-width="700">
    <v-card>

      <v-toolbar dense color="gray" dark>
        <v-toolbar-title class="title" style="float:center;">Bearbeiten Spinnentiere</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
     <button class= "delete-modal" @click="openDeleteModal()">Löschen
             <v-icon left>mdi-delete-outline</v-icon>
     </button>

      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-row>
            <v-col cols="5">
              <v-text-field class="textFieldOne" style="margin-top: 50px;" label="Abkürzung" outlined v-model.trim="arachnid.abbreviation" :rules=rules.abbreviation></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field class="textFieldTwo" style="margin-top: 50px;" label="Namme" outlined v-model.trim="arachnid.name" :rules=rules.name ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-btn type="button" class="emptyForm" style="margin-left:115px;" :loading="isLoading" color="gray" @click="closeModal">Abbrechen</v-btn>
            <v-btn type="submit" 
            class="emptyForm"
            style="margin-left:25px; max-width:360px; text-color:black;"
           :loading="isLoading" 
            color="primary"
            :disabled="!validForm"
            >
            Speichern</v-btn>
          </v-row>
        </v-form>
        <v-alert type="success" dismissible elevation="20" v-show="showAlert" :color="alertColor" class="alert">
          {{ alertText }}
        </v-alert>
      </v-card-text>
    </v-card>
      <delete-arachnid
      :visible="showDeleteModal"
      :arachnid="arachnid"
      :item-list="itemList"
      @close="showDeleteModal = false"
    ></delete-arachnid>
  </v-dialog>
</template>

<script>
import axios from "axios";
import DeleteArachnid from './DeleteArachnid.vue'

export default {

  props: {
    arachnid: {
      type: Object,
      default: () => ({id:null, abbreviation:'',name: ''})
    },
    visible: Boolean,
    itemList: Array 
  },
  data() {
    return {
      isLoading: false,
      showDeleteModal:false,
       showAlert:false,
      alertText:"",
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
  components:{
      DeleteArachnid

  },
  computed: {
    validForm() {
      return !!this.arachnid.abbreviation && !!this.arachnid.name ;
    }
  },
  methods: {

    closeModal() {
      this.$emit("close");
    },
    openDeleteModal () {
        console.log("openDeleteModal called")
        this.showDeleteModal=true;
    },
    closeDeleteModal (){
        this.showDeleteModal=false;

    },
   submitForm() {
  this.isLoading = true;
   
  const requestBody = {
    id:this.arachnid.id,
    abbreviation: this.arachnid.abbreviation,
    name:this.arachnid.name
        
  };

  if (this.arachnid.id) {
    axios
      .put("https://tilia.rrota.org/api/Arachnids/Update", requestBody, {
        headers: {
          'Content-Type' : 'application/json' 
        }
      })
     
      .then(response => {
        this.isLoading = false;
        const index = this.itemList ? this.itemList.findIndex(item => item.id === response.data.id) : -1;
        if (index >= 0) {
          this.$set(this.itemList, index, response.data); 
        }
           if (response.status === 200) {
              // console.log("TREE TYPE CREATED: ", response);
              this.showAlert = true;
              this.alertColor="success"
              this.alertText = "Das Spinnentiere wurde erfolgreich aktualisiert";
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }

      })
      .catch(error => {
        console.log(error);
        this.isLoading = false;
        this.alertColor = "error"; 
        this.alertText = "Fehler beim Erstellen der Spinnentiere";
      });
  } 
},

  }
};
</script>
<style>
.delete-modal {
    margin-left:570px;
    text-decoration: underline;
    margin-top:13px;
    font-size:20px;

}
.title {
  margin-left:2%;



}
</style>
