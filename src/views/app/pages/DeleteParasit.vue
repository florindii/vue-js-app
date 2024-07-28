<template>
  <v-dialog v-model="visible"  max-width="700" max-height="800">
    <v-card> 
      <v-toolbar>
        <v-toolbar-title class="title">Pilzarten Löschen</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon  @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>  
            <v-icon class="icon">  mdi-delete-outline</v-icon>
        <h5 class="delete-text">Wollen Sie diese parasit wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.</h5>
            
        <v-row>
          <v-btn type="button" class="emptyForm" color="gray" @click="closeModal">Abbrechen</v-btn>
          <v-btn type="submit" class="confirmForm" color="error" :loading="isLoading"  @click="deleteParasit()">Löschen</v-btn>
        </v-row>
        <v-alert type="success" dismissible elevation="20" v-show="showAlert" :color="alertColor" class="alert">
          {{ alertText }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    parasit: {
      type: Object,
    },
    visible: Boolean,
    itemList: Array,
  },
  data() {
    return {
      isLoading: false,
      showAlert: false,
      alertText: "",
      alertColor:"",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    deleteParasit() {
      this.isLoading = true;
      axios
        .delete(`https://tilia.rrota.org/api/Parasit/Delete/${this.parasit.id}`)
        .then((response) => {
          this.isLoading = false;
          const index = this.itemList ? this.itemList.findIndex(item => item.id === this.parasit.id) : -1;
          if (index >= 0) {
            this.itemList.splice(index, 1);
          }
          if (response.status === 200) {
              // console.log("TREE TYPE CREATED: ", response);
              this.showAlert = true;
              this.alertColor="success"
              this.alertText = "Dieser Pilzarten wurde erfolgreich gelöscht";
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } 
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
          this.showAlert = true;
          this.alertColor = "error"; 
          this.alertText = "Fehler beim Erstellen der Parasit";
        });
    },
  },
};
</script>
<style>
.delete-text{
    margin-top:87px;
    display:flex;
    margin-bottom:71px;
    font-size:19px;
}
.icon {
 display:flex;
 align-items:center;
 font-size: 220px;
 margin-top:25px;
 margin-left:285px;
}
.title {
    margin-left:220px;

}
.confirmForm{
 color:black !important;
 display:flex;
 margin-left:42px;
 width:203px;
}
.emptyForm {
 display:flex;
 width: 203px;
 margin-left:94px;

}
</style>
