<template>
  <v-container class="name-number" fluid align="center">
    <v-row justify="center" class="first-row">
      <v-col cols="2">
        <p>Vorname: {{ user && user.firstName }}</p>
      </v-col>
      <v-col cols="2">
        <p>Nachname: {{ user && user.lastName }}</p>
      </v-col>
      <v-col cols="2">
        <p>Benutzername: {{ user && user.username }}</p>
      </v-col>
    </v-row>
    <v-row justify="center" class="second-row">
      <v-col cols="2">
        <p>Rufnummer: {{ user && user.phoneNumber }}</p>
      </v-col>
      <v-col cols="2">
        <p>Email: {{ user && user.email }}</p>
      </v-col>
      <v-col cols="2">
        <p>Passwort:Passwort Andern</p>
      </v-col>
    </v-row>
    <v-row justify="center" class="third-row">
      <v-col cols="2">
        <p>Rollen: {{ user && user.roles }}</p>
      </v-col>
      <v-col cols="2">
        <p>Inventar: {{ user && user.inventory }}</p>
      </v-col>
      <v-col cols="2">
        <p>Beschreibung: {{ user && user.description }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      user: null
    };
  },
  created() {
    const userId = +this.$route.params.id;
    console.log("User ID:", userId);

    axios
      .get("https://tilia.rrota.org/api/User/GetAll")
      .then(response => {
        const users = response.data;
        console.log("All Users:", users);

        this.user = users.find(user => user.id === userId);
        console.log("User:", this.user);
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>
<style>
  .first-row {
    margin-top:100px !important;
    margin-bottom:30px !important;
  }
  .second-row {
   margin-top:100px !important;
   margin-bottom:40px !important;
  }
  
</style>