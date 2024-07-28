<template>
  <v-container class="name-number" fluid align="center">
     <button class= "delete-user-modal" @click="openDeleteModal()">Löschen
             <v-icon left>mdi-delete-outline</v-icon>
     </button> 
    <v-row justify="center">
      <v-col cols="2" >
        <v-text-field v-model="user.firstName" label="Vollständiger name*" outlined :rules="nameRules"/>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="user.initials" label="Initialen*" outlined :rules="initialsRules"/>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="user.phoneNumber" label="Rufnummer*" outlined :rules="phoneRules"/>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="2">
        <v-text-field v-model="user.email" label="Email*" type="email" outlined :rules="emailRules" />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="user.confirmEmail" label="Bestätigen sie die email*" type="email" outlined :rules="confirmEmailRules"/>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="2">
        <v-text-field v-model="user.userName" label="Benutzer name*" outlined :rules="userNameRules" />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="user.password" label="Passwort*" type="password" outlined  />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="user.confirmPassword" label="Bestätigen sie das passwort*" type="password" outlined :rules="confirmPasswordRules"/>
      </v-col>
    </v-row>
    <div class="roles">Rollen:</div>
    <v-row justify="center" class="my-n8">
      <v-col cols="2">
        <v-checkbox v-model="user.isAdmin" label="Admin"/>
      </v-col>
      <v-col cols="4">
        <v-checkbox v-model="user.isManager" label="Manager"/>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="2">
        <v-checkbox v-model="user.isFieldWorker" label="Feldarbeiter"/>
      </v-col>
      <v-col cols="4">
        <v-checkbox v-model="user.isInventoryOwner" label="Inventarbesitzer"/>
      </v-col>
    </v-row>
    <v-row>
 <v-row justify="center">
      <v-col cols="2"></v-col>
      <v-col cols="6">
<v-text-field v-model="user.description" label="Beschreibung" outlined :rows="5" :height="100"  />
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
      
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn color="gray" @click="resetForm">Abbrechen</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="updateUser" text-color="black">Aktualisieren</v-btn>
      </v-col>
    </v-row>
    <v-alert type="success" dismissible elevation="20" v-show="showAlert" :color="alertColor" class="alert">
          {{ alertText }}
        </v-alert>
      <delete-user
        :visible="showDeleteModal"
        :user="user"
        :item-list="itemList"
        @close="showDeleteModal=false"
      
      ></delete-user>
  </v-container>
</template>
<script>
import axios from "axios";
import DeleteUser from "./DeleteUser.vue"
const UserType = {
  AdminUserType: 1,
  ManagerUserType: 2,
  FieldWorkerUserType: 3,
  InventoryOwnerUserType: 4
};
export default {
  
  props:{
    user: {
      type:Object,
      default: () => ({
      id:null,
      userType: "",
      userName: "",
      firstName: "",
      initials: "",
      phoneNumber: "",
      email: "",
      password: "",
      description: "",
      confirmEmail: "",
      confirmPassword: "",
    
})

    },
    itemList:Array

  },
 components: {
  DeleteUser

 },
created() {
  const userId = +this.$route.params.id;
  console.log("User ID:", userId);

  axios
    .get("https://tilia.rrota.org/api/User/GetAll")
    .then(response => {
      const userList = response.data;
      const user = userList.find(u => u.id === userId);

      if (user) {
        this.user.id = user.id;
        this.user.userType = user.userType || "";
        this.user.userName = user.username || "";
        this.user.firstName = user.firstName || "";
        this.user.initials = user.lastName || "";
        this.user.phoneNumber = user.phoneNumber || "";
        this.user.email = user.email || "";
        this.user.password = user.password || "";
        this.user.description = user.description || "";
        this.user.confirmEmail = user.email || "";
        this.user.confirmPassword = user.password || "";
        
        if(user) {
          this.user.option1 = user.userType === UserType.AdminUserType;
          this.user.option2 = user.userType === UserType.ManagerUserType;
          this.user.option3 = user.userType === UserType.FieldWorkerUserType;
          this.user.option4 = user.UserType === UserType.InventoryOwnerUserType;
        }
        console.log("Selected User", this.user);

      } else {
        // Handle the case when user is not found, e.g., display an error message
        console.log("User not found");
      }
    })
    .catch(error => {
      console.log(error);
    });
},




data() {
  return {
    showDeleteModal:false,
    userType:"",
    userList:{},
    isLoading: false,
    showAlert: false,
    alertText: "",
    alertColor:"",
    nameRules: [
      v => !!v || 'Name is required',
      v => /^[a-zA-Z ]+$/.test(v) || 'Name must contain only letters and spaces',
    ],
    initialsRules: [
      v => !!v || 'Initials are required',
      v => /^[a-zA-Z ]+$/.test(v) || 'Initials must contain only letters and spaces',
    ],
    phoneRules: [
      v => !!v || 'Phone number is required',
      v => /^((\+)?(\d{2}[-]))?(\d{10}){1}?$/gm.test(v) || 'Invalid phone number',
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || 'E-mail must be valid',
    ],
    confirmEmailRules: [
      v => !!v || 'Confirm e-mail is required',
      v => v === this.user.email || 'E-mails do not match',
    ],
    userNameRules: [
      v => !!v || 'Username is required',
      v => /^[a-zA-Z0-9]+$/.test(v) || 'Username must contain only letters and numbers',
    ],
    confirmPasswordRules: [
      v => !!v || 'Confirm password is required',
      v => v === this.user.password || 'Passwords do not match',
    ],

  };
},
 
  
  methods: {
    openDeleteModal () {
      console.log("openDeleteModal called")
      this.showDeleteModal=true;
    },
     closeDeleteModal (){
        this.showDeleteModal=false;
        this.$router.push({ name: "/app/pages/management/Benutzerliste" })

    },
    updateUser() {
    console.log(this.user)
    this.user.userType = this.getUserType();
    const payload = {
    id:this.user.id,
    userTypeId: this.user.userType,
    firstName: this.user.firstName,
    lastName: this.user.initials,
    phoneNumber: this.user.phoneNumber,
    email: this.user.email,
    username: this.user.userName,
    password: this.user.password,
    confirmPassword: this.user.confirmPassword,
    isActive: true,
    isConfirmed: true,
    description: this.user.description,
      };
      axios
        .put("https://tilia.rrota.org/api/User/UpdateUserViaAdmin", payload)
        .then(response => {
          this.isLoading = false;
          const index = this.itemList ? this.itemList.findIndex(item => item.id === response.data.id):-1;
          if (index >= 0) {
            this.$set(this.itemList, index, response.data);
          }
          if (response.status === 200) {
            console.log("USER UPDATED: ", response);
            this.showAlert = true;
            this.alertColor="success"
            this.alertText = "Der Benutzer wurde erfolgreich aktualisiert";
            setTimeout(() => {
            this.$router.push({ name: "Benutzerliste" }); // navigate to userList page
                    }, 1500);
            }
      })
      .catch(error => {
        console.log(error);
        this.isLoading = false;
         this.showAlert = true;
            this.alertColor = "error"; 
            this.alertText = "Fehler beim speichern der Benutzer";
      });
    },
    getUserType() {
      let userType = "";
      if (this.user.isAdmin) {
        userType = UserType.AdminUserType;
      } else if (this.user.isManager) {
        userType = UserType.ManagerUserType;
      } else if (this.user.FieldWorker) {
        userType = UserType.FieldWorkerUserType;
      } else if (this.user.InventoryOwner) {
        userType = UserType.InventoryOwnerUserType;
      }
      return "";
    },
   resetForm() {
 this.$router.push({ name: "Benutzerliste" }); // navigate to userList page
}


  },
};
</script>
<style>
  .roles{
    margin:0 auto;
    margin-bottom:2%;
    width:50%;
    padding:9.2px;
    font-size:16px;
    float:center;
    }
.alert{
 position: fixed;
  width: 100%;
  max-width: 784px;
  left: 56%;
  top: 45%;
  transform: translate(-50%, -50%);
  padding: 40px 100px;
}
.delete-user-modal {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
