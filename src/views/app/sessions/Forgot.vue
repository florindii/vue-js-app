<template>
    <div class="page-wrap">
        <div class="session-form-hold">
            <v-snackbar v-model="snackbar" top color="danger">
                <div> Diese E-Mail existiert nicht!
                </div>
                <template v-slot:action="{ attrs }">
                    <v-btn color="" text v-bind="attrs" @click="snackbar = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
            </v-snackbar>
            <div class="wrapper">
                <div v-if="!emailInfoForChangePass" class="forgot-password">
                    <p class="forgot-title">
                        Ihr Passwort vergessen?
                    </p>
                    <p class="forgot-description">Bitte geben sie Ihre email adresse oder Ihren benutzernamen ein. Sie
                        erhalten einen link zum Erstellen eines neuen passworts per email.</p>
                    <input type="text" class="form-control" v-model="email">
                    <button class="forgot-btn" @click.prevent="sendEmail">Submit</button>
                </div>
                <div v-else class="forgot-password">
                    <img src="../../../assets/images/check-sign.png" alt="check-sign">
                    <h1>Die email wurde gesendet</h1>
                    <p class="forgot-title">
                        Bitte überprüfen Sie Ihre E-Mail, dort finden Sie einen Link, um Ihr Passwort zu ändern.
                    </p>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: 'Forgot',
    metaInfo: {
        // title will be injected into parent titleTemplate
        title: 'Forgot'
    },
    data() {
        return {
            email: '',
            snackbar: false, 
            isLoading: false,
        }
    },
    computed: {
        ...mapGetters(["emailInfoForChangePass", "error"]),

    },
    watch: {
        error(val) {
            if (val != null) {
                this.snackbar = true;
            }
        },
    },
    methods: {
        ...mapActions(["forgotPassword"]),

        sendEmail() {
            if (this.email) {
                this.forgotPassword({ email: this.email })
            }
        }
    },
    mounted() {
        console.log(this.emailInfoForChangePass);
    }

    // watch:{
    //     emailInfoForChangePass(val) {

    //     }
    // }
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

    .wrapper {
        width: 771px;
        background: #1c1e1c;
        padding-top: 75px;
        padding-bottom: 110px;

        .forgot-password {
            width: 440px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;

            .form-control {
                margin: 20px;
                width: 285px;
                border: 1px solid #494949;
                border-radius: 5px;
                background: #1C1E1C;
                padding: 10px;
                color: white;
            }

            h1 {
                margin-top: 30px;
                font-style: normal;
                font-weight: 400;
                font-size: 25px;
                line-height: 38px;
                color: #fff;
            }

            .forgot-title {
                margin-top: 20px;
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 24px;
                text-align: center;
            }

            .forgot-description {
                text-align: center;
                font-size: 16px;
                line-height: 24px;
                font-style: normal;
                font-weight: 400;
            }

            .forgot-btn {
                width: 285px;
                height: 50px;
                background: #1DB954;
                border-radius: 5px;
                font-style: normal;
                font-weight: 500;
                font-size: 18px;
                line-height: 27px;

                letter-spacing: 0.1px;

                /* UI/Background */

                color: #151914;
            }
        }
    }
}
</style>
