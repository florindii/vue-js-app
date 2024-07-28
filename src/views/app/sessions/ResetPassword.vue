<template>
    <div class="page-wrap">
        <v-snackbar v-model="snackbar" top color="danger">
      <div> 
        {{ snackbarMessageModal }}
        
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn color="" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
        <div class="session-form-hold">
            <div class="wrapper">
                
                <form>
                    <h1>Passwort ändern</h1>
                    <div class="form-control">
                    <label for="Tatsächliches Kennwort*">Email*</label>
                    <input type="email" v-model="email">
                    </div>
                    <div class="form-control">
                    <label for="Neues Passwort*">Neues Passwort*</label>
                    <input type="password" v-model="password">
                    </div>
                    <div class="form-control">
                    <label for="Neues Passwort bestätigen*">Neues Passwort bestätigen*</label>
                    <input type="password" v-model="confirmPassword">
                    </div>

                    <button @click.prevent="onResetPassword" class="btn">Speichern</button>


                </form>
                
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: 'ResetPassword',
    metaInfo: {
        // title will be injected into parent titleTemplate
        title: 'reset-password'
    },
    data() {
        return {
            email: "",
            password:"",
            confirmPassword:"",
            correctPassword:false,
            snackbar: false,
            snackbarMessageModal: "",
            token:""
        }
    },
     computed: {
    ...mapGetters(["resetPasswordInfo", "error"]),
    
  },
    methods:{
    ...mapActions(["resetPassword"]),

    onResetPassword() {
        if(this.email && this.password == this.confirmPassword) {
            this.resetPassword({email: this.email, password: this.password, confirmPassword: this.confirmPassword, token: this.token})
        } else {
            this.snackbar = true;
            this.snackbarMessageModal = "Passwort und Passwort bestätigen sind nicht identisch!";
        }
    }
    },

    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        this.token = token;
        console.log(token);
        console.log(this.resetPasswordInfo);
    },

    watch:{
        error(val) {
            if (val != null) {
                this.snackbar = true;
                this.snackbarMessageModal = "Hoppla! etwas ist schief gelaufen";
            }
        },
        resetPasswordInfo(val) {
            if(val) {
                localStorage.removeItem("userInfo");
               localStorage.removeItem("token");
                setTimeout(() => {
          this.$router.push({
             name: "login"
                });
        }, 500);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
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
    background-color: #151914;
    .wrapper{
        width: 771px;
    padding-top: 75px;
    padding-bottom: 110px;
        form {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            h1{
                margin-bottom: 40px;
                font-style: normal;
                font-weight: 500;
                font-size: 20px;
                line-height: 30px;
                color: #fff;
            }
            .form-control{
                margin-bottom: 40px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;

                    label{
                        font-style: normal;
                        font-weight: 400;
                        font-size: 16px;
                        line-height: 19px;
                        color: #fff;
                        margin-bottom: 10px;
                    }
                    input{
                        width: 285px;
                        height: 50px;
                        background: #1C1E1C;
                        border: 1px solid #494949;
                        border-radius: 5px;
                        color: #fff;
                    }
                    
            }
            .btn{
                width: 285px;
                height: 50px;
                background: #1DB954;
                border: 1px solid #1DB954;
                border-radius: 5px;

                font-style: normal;
                font-weight: 500;
                font-size: 18px;
                line-height: 27px;
                letter-spacing: 0.1px;
                color: #151914;
            }
        }
    }
}

</style>
