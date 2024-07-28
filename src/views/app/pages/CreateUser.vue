<template>
  <v-container class="name-number" fluid align="center">
    <v-row  justify="center">
      <v-col cols="2" >
        <v-text-field v-model="firstName" label="Vollständiger name*" outlined  :rules="nameRules"/>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="initials" label="Initialen*" outlined :rules="initialsRules"/>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="phoneNumber" label="Rufnummer*" outlined :rules="phoneRules"/>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="2">
        <v-text-field v-model="email" label="Email*" type="email" outlined :rules="emailRules" />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="confirmEmail" label="Bestätigen sie die email*" type="email" outlined :rules="confirmEmailRules"/>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
    <v-row justify="center">
         <v-col cols="2">
        <v-text-field v-model="userName" label="Benutzer name*" outlined :rules="userNameRules" />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="password" label="Passwort*" type="Password" :rules="passwordRules" outlined  />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="confirmPassword" label="Bestätigen sie das passwort*" type="password" outlined :rules="confirmPasswordRules"/>
      </v-col>
    </v-row>
    <div class="roles">Rollen:</div>
<v-row justify="center" class="my-n8">
  <v-col cols="2">
    <v-checkbox v-model="option1" label="Admin"/>
  </v-col>
  <v-col cols="4">
    <v-checkbox v-model="option2" label=" Manager"/>
  </v-col>
</v-row>
<v-row justify="center">
  <v-col cols="2">
    <v-checkbox v-model="option3" label="Feldarbeiter"/>
  </v-col>
  <v-col cols="4">
    <v-checkbox v-model="option4" label="Inventarbesitzer"/>
  </v-col>
</v-row>
<v-row>

  
</v-row>
   <v-row justify="center">
      <v-col cols="2"></v-col>
      <v-col cols="6">
        <v-text-field v-model="description" label="Beschreibung" outlined :rows="5" :height="100" :rules="descriptionRules" />
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
     <v-row justify="center">
      <v-col cols="auto">
        <v-btn color="gray"  @click="resetForm">Abbrechen</v-btn> 
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="createUser" text-color:black>Erstellen</v-btn>
      </v-col>
    </v-row>
    <v-alert type="success" dismissible elevation="20" v-show="showAlert" :color="alertColor" class="alert">
          {{ alertText }}
        </v-alert>
    
  </v-container>
</template>
<script>
import axios from "axios";
import UpdateUser from "../pages/UpdateUser.vue"
const UserType = {
  AdminUserType: 1,
  ManagerUserType: 2,
  FieldWorkerUserType: 3,
  InventoryOwner: 4
};

export default {
  
  data() {
    return {
      showAlert: false,
      alertText: "",
      alertColor:"",
      userType:"",
      userName: "",
      firstName: "",
      initials: "",
      phoneNumber: "",
      email: "",
      password: "",
      description: "",
      option1: false,
      option2: false,
      option3: false,
      option4: false,
      confirmEmail: "",
      confirmPassword: "",
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
        v => v === this.email || 'E-mails do not match',
      ],
      userNameRules: [
        v => !!v || 'Username is required',
        v => /^[a-zA-Z0-9]+$/.test(v) || 'Username must contain only letters and numbers',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirm password is required',
        v => v === this.password || 'Passwords do not match',
      ],
      descriptionRules: [
        v=> !!v   || 'Description is required',
        v => v.length <= 255 || 'Description must be less than 255 characters',
      ],
      
    };
    
  },
     components :{
      UpdateUser

     },
  methods: {
    resetForm (){
      this.$router.push("/app/pages/management/Benutzerliste")
      

    },
  async createUser() {
  let userTypeId = null;
  if (this.option1) {
    userTypeId = 1; 
  } else if (this.option2) {
    userTypeId = 2; 
  } else if (this.option3) {
    userTypeId = 3; 
  } else if (this.option4) {
    userTypeId = 4; 
  }
    
  
  const payload = {
    userTypeId: userTypeId,
    firstName: this.firstName,
    lastName: this.initials,
    phoneNumber: this.phoneNumber,
    email: this.email,
    username: this.userName,
    password: this.password,
    confirmPassword: this.confirmPassword,
    isActive: true,
    isConfirmed: true,
    description: this.description,
  };

  console.log("createUser payload: ", payload);

  try {
  const response = await axios.post("https://tilia.rrota.org/api/User/CreateUserViaAdmin", payload);
  const user = response.data;
  console.log("createUser succeeded with response:", user);
  this.$store.commit("ADD_USER", user);
  this.$store.dispatch("fetchUsers");
  this.resetForm();
  if (response.status === 200) {
      console.log("USER CREATED: ", response);
      this.showAlert = true;
      this.alertColor="success"
      this.alertText = "Das neue Benutzer wurde erfolgreich erstellt";
      setTimeout(() => {
      this.$router.push({ name: "Benutzerliste" }); // navigate to userList page
           }, 1500);
            }

            } 
            catch (error) {
          console.error("createUser method failed with error:", error);
            this.showAlert = true;
            this.alertColor = "error"; 
            this.alertText = "Fehler beim Erstellen der Benutzer";}

}


  }
  }
</script>
<style scoped>
.roles{
    margin:0 auto;
    margin-bottom:2%;
    width:50%;
    padding:9.2px;
    font-size:16px;
    float:center;
  }
 .name-number{
      margin-bottom:2%;
      
    }
 .alert {
  position: fixed;
  width: 100%;
  max-width: 784px;
  left: 56%;
  top: 45%;
  transform: translate(-50%, -50%);
  padding: 40px 100px;
  }

</style>
