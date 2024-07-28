<template>
  <div>
    <v-dialog v-model="isModalOpen"  content-class="my-dialog" class="user-modal" max-width="400px"  @click:outside = "$emit('closeModal')" >
  <v-card >
    <v-card-title >
      <v-spacer></v-spacer>
      <v-icon size="28" class="close-popup" @click="$emit('closeModal')">mdi mdi-close</v-icon>
    </v-card-title>
    <v-card-text>
      <div class="user-info">
                  <div class="user-initials">
                    <span>
                      {{userInfo }}
                    </span>
                  </div>
                  <span class="user-fullName">
                    {{userFullname}}

                  </span>
                  
                  <!-- <img src="../../../assets/images/avatars/001-man.svg" alt="avatar"> -->
                 
                </div>
      <!-- Change password option -->
      <div class="option-one" @click="selectOption('changePassword')">
        <v-icon class="mr-3">mdi-lock-outline</v-icon>
        <a  class="color-white" href="/app/sessions/changepassword">
                Passwort vergessen</a>
        <!-- <button class="change-password-btn" @click="openChangePasswordModal">Passwort Ändern</button> -->
      </div>
      <hr>
      <!-- Log Out option -->
      <div class="option-two mt-3" @click="logoutUser">
        <v-icon class="mr-3">mdi-logout</v-icon>
        <button>
          <span class="color-white">Sich Abmelden</span>
        </button>
      </div>
    </v-card-text>
  </v-card>
</v-dialog>
     <change-password-modal
      :is-modal-open="isChangePasswordModalOpen"
      @resetPassword="handlePasswordReset"
      @closeModal="isChangePasswordModalOpen = false"
    ></change-password-modal> 
  </div>
</template>

<script>
import ChangePasswordModal from './ChangePasswordModal.vue';

export default {
  props: {
    isModalOpen: {
      isModalOpen: false
    },
    userInfo: {
      required: true
    },
    userFullname:{
      required: true
    }
  },
  data() {
    return {
      isChangePasswordModalOpen: false,
    };
  },
  methods: {
    selectOption(option) {
      this.$emit('confirmAction', option);
    },
    logoutUser() {
      this.$router.push('/app/sessions/sign-in-two');
    },
    openChangePasswordModal() {
      this.isChangePasswordModalOpen = true;
    },
    handlePasswordReset(data) {
      // Handle the password reset logic using the data received
      console.log('Resetting password', data);

      // Close the modal
      this.isChangePasswordModalOpen = false;
    },
  
  },
   watch: {
    isModalOpen(newVal) {
      this.modalOpen = newVal;
    },
    modalOpen(newVal) {
      if (!newVal) {
        this.isChangePasswordModalOpen = false;
      }
    },
  },
  components: {
    ChangePasswordModal,
  },
};
</script>

<style>
.user-fullName{
  color: #fff !important;
  margin-left: 10px;
}
.close-popup{
  display: flex !important;
  justify-content: flex-end !important;
  margin-right: 10px !important;
  margin-top: 10px !important;
}
.v-dialog {
  overflow-y: unset !important;
}
.my-dialog{
  background: unset;
  padding: 0 !important;
  .v-card__text{
  font-size: unset;
   }
}
.option-one {
  margin-top: 9% !important;
  margin-bottom: 7% !important;
  margin-left:3% !important;
}

.option-two {
  margin-bottom: 7% !important;
  margin-left: 3% !important;
}
.color-white {
  color: #fff !important}
</style>
