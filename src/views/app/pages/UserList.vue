<template>
  <div>

    <v-col cols="3">
       <v-btn
        block
        height="42px"
        color="#1db954"
        class="download-btn"
        to="/app/pages/management/Benutzerliste/CreateUser"
      >
        <v-icon >mdi mdi-plus-thick</v-icon>
        Neue Benutzer
      </v-btn>
    </v-btn>
    </v-col>
    <v-data-table
      :key="userUpdateKey"
      :headers="headers"
      :search="testVal"
      :items="users"
      :loading="isLoading"
    >
    <template v-slot:item.userTypeId ="{item}">
        {{getRoleString(item.userTypeId)}}

    </template>
    <template v-slot:item.actions="{ item }">
        <v-icon small class="green--text mr-2" @click="editUser(item)">mdi-pencil-outline</v-icon>
      </template>
    </v-data-table>
    <UpdateUser :user="selectedUser" :itemList="userList" v-if="selectedUser.id"></UpdateUser>
  </div>
</template>
<script>
import axios from "axios";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CreateUser,
    UpdateUser
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "firstName" },
        { text: "Initialen", value: "lastName" },
        { text: "Rolle", value: "userTypeId", align :"start" },
        { text: "", value: "actions", sortable: false }
      ],
      itemList: [],
      userUpdateKey: null,
      isLoading: false,
      dialogType: "",
      selectedUser: {},
      localSearch: null
    };
  },
   computed: {
    ...mapGetters([ "getSearchquery","coverages","users"]),

    testVal() {
      return this.getSearchquery;
    }
  },
   mounted() {
    // console.log(this.getCoverageTypeResults);
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
    // this.test();
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["fetchUsers", "createUser", "updateUser"]),
    
     editUser(user) {
    console.log("Selected User", user);
    this.selectedUser = user;
    this.$router.push({
      name: "Bearbeiten benutzer",
      params: { id: user.id },
      props: {
        user: this.selectedUser
      }
    });
  },
  viewUser(user) {
    console.log("Selected User", user);
    this.selectedUser = user;
    this.$router.push({
      name: "Bearbeiten info",
      params: { id: user.id },
      props: {
        user: this.selectedUser
      }
    });
  },
    async addItem(newItem) {
      this.isLoading = true;
      await this.createUser(newItem);
      this.$store.commit("addUser", newItem);
      this.fetchUsers();
    },
    async updateItem(item) {
      console.log("Updating item", item);
      this.isLoading = true;
      await this.updateUser(item);
      console.log("Item updated");
      this.userUpdateKey += 1;
    },
    async fetchData() {
      console.log("fetchData started");
      this.isLoading = true;
      await this.fetchUsers();
      this.isLoading = false;
    },
      getRoleString(userTypeId) {
      const roleMap = {
        1: "Admin",
        2: "Manager",
        3: "Feldarbeiter",
        4:"Inventarbesitzer"
      };

      return roleMap[userTypeId] || "";
    }
  },
 handleSearch(query) {
      this.getSearchquery = query;
    },
};
</script>


<style>
.mr-2 {
  border: 1px solid #494949;
  padding: 3px;
  border-radius: 5px;
  width: 42px;
  height: 42px;
  margin-left:-60px !important;


}
  .download-btn {
    margin-bottom:23px;
  }

</style>