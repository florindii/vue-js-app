<template>
    <div class="page-wrap">
      <v-snackbar v-model="snackbar" top color="danger">
      <div> Anmeldeinformationen sind nicht richtig geschrieben!
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn color="" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
      <v-snackbar v-model="snackbarSuccess" top color="green">
      <div>   Das Passwort wurde erfolgreich geändert!
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn color="" text v-bind="attrs" @click="snackbarSuccess = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
        <div class="wrapper">
      <div  class="user-modal">
        <div class="modal-content">
         
          <form>
            <h1>Passwort ändern</h1>
            <div class="form-control">
              <label for="currentPassword">Tatsächliches Kennwort*</label>
              <input type="password" v-model="currentPassword">
            </div>
            <div class="form-control">
              <label for="password">Neues Passwort*</label>
              <input type="password" v-model="password">
            </div>
            <div class="form-control">
              <label for="confirmPassword">Neues Passwort bestätigen*</label>
              <input type="password" v-model="confirmPassword">
            </div>
            <button @click.prevent="onChangePassword" class="btn">Speichern</button>
          </form>
        </div>
      </div>
      </div>
    </div>
    
  </template>

  <script>
import { mapActions } from "vuex";
import axios from "axios";
import router from "@/router";
export default {
 
  data() {
    return {
      id: 0,
      currentPassword: "",
      password: "",
      confirmPassword: "",
      snackbar: false,
      snackbarSuccess:false
    };
  },
  methods: {
    ...mapActions(["resetPassword"]),
    onChangePassword() {
      debugger;
      const getToken = JSON.parse(localStorage.getItem("token"));
      const users = JSON.parse(localStorage.getItem("userInfo"));
      if (users.length) {
        const user = users.find(user => user.token == getToken)
        if (user) {
          this.id = user.user.id;
        }
      }
      if (this.currentPassword && this.password === this.confirmPassword) {
        const requestBody = {
          id: this.id,
          currentPassword: this.currentPassword,
          password: this.password,
          confirmPassword: this.confirmPassword,
        };
        axios
        .put("https://tilia.rrota.org/api/User/UpdateProfile", requestBody, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (response.status === 200) {
            this.snackbarSuccess = true;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            setTimeout(() => {
                this.$router.push({
                name: "login"
                });
              }, 2000);
         
          }
        })
        .catch(error => {
          this.snackbar = true;
        });
      }
      else{
        this.snackbar = true;
       
      }
      
    },
  }
};
</script>

<style lang="scss" scoped>
.page-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 1rem;
    height: 100%;
    min-height: 100vh;
}

.session-form-hold {
  width: 100%;
  max-width: 771px;
  margin: 0 auto;
}

.wrapper {
  width: 771px;
  background: #1c1e1c;
  padding-top: 75px;
  padding-bottom: 110px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  margin-bottom: 40px;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  color: #fff;
}

.form-control {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #fff;
  margin-bottom: 10px;
}

input {
  width: 285px;
  height: 50px;
  background: #1c1e1c;
  border: 1px solid #494949;
  border-radius: 5px;
  color: #fff;
}

.btn {
  width: 285px;
  height: 50px;
  background: #1db954;
  border: 1px solid #1db954;
  border-radius: 5px;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.1px;
  color: #151914;
}
</style>
