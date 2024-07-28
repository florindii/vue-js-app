<template>
  <div class="page-wrap">
    <!-- error password snackbar  -->
    <v-snackbar v-model="snackbar" top color="danger">
      <div> This error is because you doesn't fill the form correct or you have used an email that is used for a user!
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn color="" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <div class="wrapper">
      <div class="title">
        TILIA BAUMPFLEGE AG
      </div>

      <h1 class="welcome-title">
        Willkommen
      </h1>

      <template v-if="user && !showLoginForm"
      >
        <div class="user-wrapper" :style="userWrapperStyle">
          <div v-for="(usr,index ) in user" 
                :key="index"
                class="user-login" 
                @click="loginWithSavedUser(usr.user)">
            <div class="user-info">
              <div class="user-initials">
                <span>
                  {{
                    usr.user.firstName[0].toUpperCase() }}{{ usr.user.lastName[0].toUpperCase() }}
                </span>
              </div>

              <!-- <img src="../../../assets/images/avatars/001-man.svg" alt="avatar"> -->
              <div class="user-info-email-name">
                <h3> {{ usr.user.fullName }} </h3>
                <span> {{ usr.user.email }} </span>
              </div>
            </div>
            <img src="../../../assets/images/arrow-right.png" alt="arrow">
          </div>
        </div>
        <div class="horizontal-break"></div>
        <div class="weiteres" @click="goToSignUp">
          <img src="../../../assets/images/weiteres-icon.png" alt="weiteres">
          <img class="half-img" src="../../../assets/images/weiteres-half-icon.png" alt="weiteres">
          <span>Weiteres Konto hinzufügen</span>
        </div>
      </template>
      <template v-else-if="!user || showLoginForm">
        <v-form class="form">
          <input class="form-control email" type="email" v-model="email" variant="outlined" label-class="my-label-class"
            :rules="emailRules" required>

          <div class="password-field">
            <label for="password" class="password-label">Passwort</label>
            <input class="form-control" type="password" name="input-10-2" :rules="nameRules" v-model="ePassword">

            <label class="forgot-link">
              <a href="Forgot">
                Passwort vergessen</a>
            </label>
          </div>

          <v-checkbox class="checkbox1" v-model="checkbox" label="Eingeloggt bleiben"></v-checkbox>

          <button class="login-btn" @click.prevent="formSubmit">
            Einloggen
          </button>
        </v-form>
      </template>
    </div>

  </div>
</template>
<script>
import firebase from "firebase/app";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "login",
  metaInfo: {
    // title will be injected into parent titleTemplate
    title: "SignIn Two",
  },
  data() {
    return {
      show: false,
      password: "Password",
      checkbox: null,
      showLoginForm: false,
      checkbox2: false,
      email: '',
      initialsOfUser: "",
      user: null,
      ePassword: '',
      loading: false,
      snackbar: false,
      emailExistOnlocalStorage: false,
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      nameRules: [
        (v) => !!v || "Password is required"
      ],
    };
  },
  computed: {
    ...mapGetters(["loggedInUser", "error"]),
    userWrapperStyle() {
      return {
        height: this.user.length > 1 ? '170px' : '100px'
      };
    }
  },
  methods: {
    ...mapActions(["login", "loginWithAvatar"]),
    // login: function() {
    //   firebase.auth().signInWithEmailAndPassword(this.email, this.ePassword)
    //     .then(
    //       user => {
    //         // console.log(user);
    //         this.loading = true;
    //         this.$router.push('/');

    //       },
    //       err => {

    //         // alert(err);

    //       }
    //     )
    // },

    formSubmit() {
      if (this.email && this.ePassword) {
        this.login({ email: this.email, password: this.ePassword, checkbox: this.checkbox });
      } else {
        this.snackbar = true;
      }
    },
    loginWithSavedUser(usr) {
      this.loginWithAvatar({ email: usr.email, password: usr.password });
    },
    goToSignUp() {
      this.showLoginForm = true;
      this.email = "";
      this.ePassword = "";
    },
    isLoggedInUserLocaclStorage() {
      let user = JSON.parse(localStorage.getItem("userInfo"))
      console.log(user);
      if (user) {
        this.user = user;
      }
    }

  },
  mounted() {
    this.isLoggedInUserLocaclStorage();
  },
  watch: {
    loggedInUser(val) {
      console.log(val);
      if (val) {
        setTimeout(() => {
          this.$router.push("/")
        }, 500);
      }
      else if (val && val.uid.user.password && val.uid.user.password.length > 0) {
        // this.makeToast("success", "Successfully Logged In");
        this.loading = true;
        this.email = val.uid.user.username;
        setTimeout(() => {
          this.$router.push("/")
        }, 500);
      }
    },
    error(val) {
      if (val == null) {
        this.snackbar = true;
      }
    },
  },
};
</script>
<style lang="scss">
.page-wrap {
  /*background-color: #242939 !important;*/
  display: flex;
  align-items: center;
  padding: 40px 1rem;
  height: 100%;
  min-height: 100vh;

  .wrapper {
    margin: 0 auto;
    width: 915px;
    height: 705px;
    background: #1C1E1C;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .title {
      width: 292px;
      height: 96px;
      display: flex;
      background: #1DB954;
      align-items: center;
      justify-content: center;
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      line-height: 36px;
      color: #151914;
      position: absolute;
      top: 116px;
      transform: translate(0, -50%);
    }

    .welcome-title {
      font-style: normal;
      font-weight: 500;
      font-size: 48px;
      line-height: 72px;
      color: #FFFFFF;
    }

    .information {
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      color: #FFFFFF;
      margin-bottom: 40px;
    }

    .user-wrapper {
      height: 170px;
      overflow-y: auto;
      padding: 10px;

      &::-webkit-scrollbar {
        width: 3px;

      }

      &::-webkit-scrollbar-thumb {
        background-color: #1DB954;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background-color: #494949;
      }

      .user-login {
        width: 443px;
        height: 70px;
        background: #1C1E1C;
        border: 1px solid #494949;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 10px;
        margin-bottom: 10px;
        cursor: pointer;

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
              color: #1DB954;
            }
          }

          img {
            width: 40px;
            height: 40px;
          }

          .user-info-email-name {
            margin-left: 15px;

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
    }

    .horizontal-break {

      margin: 0 auto;
      margin-top: 10px;
      margin-bottom: 15px;
      width: 443px;
      border: 1px solid #494949;
    }

    .weiteres {
      margin: 0 auto;
      width: 443px;
      display: flex;
      align-items: center;

      span {
        cursor: pointer;
        margin-left: 12px;
        font-size: 14px;
      }

      .half-img {
        transform: translate(-30%, 0);
      }

    }

    .form {
      display: flex;
      flex-direction: column;



      .form-control {
        width: 285px;
        border: 1px solid #494949;
        border-radius: 5px;
        background: #1C1E1C;
        padding: 10px;
        color: white;
      }

      .form-control.email {
        margin-bottom: 27px;
      }

      .password-label {
        margin-bottom: 5px;
      }

      .password-field {
        display: flex;
        flex-direction: column;

        .forgot-link {
          text-align: right;
          margin-top: 10px;

          a {
            color: #fff;
            text-decoration: underline;
          }
        }
      }

      .login-btn {
        width: 250px;
        height: 52px;
        background: #1DB954;
        border-radius: 5px;
        margin: 0 auto;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #151914;
        margin-top: 43px;
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .page-wrap {
    width: 100%;
    height: auto;
    left: 0;
    top: 0;
    transform: none;
    background-color: black;
  }
}


@media screen and (max-width: 768px) {
  .session-form-hold {
    width: 90%;
    max-width: none;
    font-size: 14px;
    padding: 10px;
  }
}

@media screen and (max-width: 480px) {
  .session-form-hold {
    width: 100%;
    font-size: 12px;
    padding: 5px;
  }
}</style>
