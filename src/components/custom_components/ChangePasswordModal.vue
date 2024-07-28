<template>
  <div>
  <v-dialog v-model="isModalOpen" class="user-modal" max-width="700px">
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-icon size="28" class="close-popup" @click="$emit('closeModal')">mdi mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
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
      </v-card-text>
    </v-card>
  </v-dialog>
   <!-- Succesfully Dialog -->
   <template>
    <div >
      <v-dialog  v-model="createInventarDialog" class="success-dialog">
        <img
          src="../../assets/images/black-check.png"
          alt="check"
          style="width: 41px; height: 29px"
        />

        <v-card-text>
          "the password"
        </v-card-text>
      </v-dialog>
    </div>
    </template>
    </div>
</template>
  
<script>
import { mapActions } from "vuex";
import axios from "axios";

export default {
  props: {
    isModalOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      id: 0,
      currentPassword: "",
      password: "",
      confirmPassword: "",
      createInventarDialog: false,
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
            this.createInventarDialog = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
      }
      
    },
  }
};
</script>

<style scoped>

.page-wrap {
  /*background-color: #242939 !important;*/
  display: flex;
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

