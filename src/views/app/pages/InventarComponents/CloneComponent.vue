<template>
           <div>
             <div
             v-for="(clonedDiv, index) in clonedDivsResponsible"
             :key="index"
              ref="originalDiv"
              class="Verantwortlicher-Verantwortlicher"
            >
              <label for="Verantwortlicher">Verantwortlicher:</label>
              <div class="form-control-group mb" v-if="dropdownVisible" >
                <div class="form-control" >
                  <select v-model="selectedUser" :class="{ open: !isOpenResponsibleSelect }" style="width:width: 105%;" @change="addUser">
                      <option value="select a user" selected>Select user</option>
                      <option v-for="user in users" :key="user.id" :value="user.id">{{ user.fullName }}</option>
                  </select>
                </div>
              </div>
              <div v-if="inventarObj.responsible">
                <ul>
                  <li v-for="(user, index) in selectedUsers" :key="index" style="color:white;">
                    {{user.fullName}}
                  </li>
                </ul>
              </div>
              <div class="btn-wrapper" v-if="!dropdownVisible">
                <button class="btn" @click="showDropdownUser"></button>
                <span>Auswählen</span>
              </div>
              
               <!-- <ul v-if="dropdownVisible">
                <li v-for="user in users" :key="user.id">{{ user.fullName }}</li>
              </ul> -->
              <div class="horizontal-line"></div>
            <div class="add-new-user">
                <img
                  src="../../../../assets/images/plus_Black.png"
                  alt="plus"
                />
                <a href="#" @click="cloneDivVerantwortlicher(index)"
                  >Neu hinzufügen
                </a>
            </div>
            </div>
           </div>
</template>

<script>
export default {

  data () {
    return {
    clonedDivsResponsible:[]
    }
  }
};
</script>
