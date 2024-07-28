<template>
  <v-navigation-drawer
    v-model="getThemeMode.verticalSidebarDrawer"
    :color="
      $vuetify.theme.dark ? 'dark' : getThemeMode.verticalSidebarDrawerColor
    "
    :mini-variant="getThemeMode.verticalSidebarMini"
    :src="bg"
    :dark="getThemeMode.verticalSidebarDrawerColor != 'white' ? true : false"
    app
    :disable-resize-watcher="false"
    :mobile-breakpoint="960"
    height="100%"
    class="shadow-sm rounded-tr-lg rounded-br-lg"
    :floating="true"
    :right="$vuetify.rtl"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img :style="{ opacity: opacity }" v-bind="props" class="test" />
    </template>
    <vue-perfect-scrollbar
      :settings="{ suppressScrollX: true, wheelPropagation: false }"
      class="h-100 rtl-ps-none ps scroll"
      style="height: 100%"
    >
      <v-list dense nav>
        <v-list-item class="px-0" id="change-side-btn">
          <v-scroll-x-transition>
            <v-btn icon @click.stop="toggleSidebar">
               <img src="../../assets/images/svg/closed_menu.svg" alt="closed_menu">
            </v-btn>
          </v-scroll-x-transition>

          <v-list-item-title class="text-18 text-uppercase text-default"
            >Tilia Baumpflege AG</v-list-item-title
          >

        </v-list-item>
        
      </v-list>

      <v-list class="components">
        <template v-for="(item, i) in computedItems">
          <div
            :key="item.subheader"
            v-if="item.subheader"
            :class="miniVariant && 'px-1'"
          >
            <v-subheader>
              {{ item.subheader }}
            </v-subheader>

            <v-divider></v-divider>
          </div>

          <base-item-group
            v-if="item.children"
            :key="`group-${i}`"
            :item="item"
          >
            <!--  -->
          </base-item-group>

          <base-item
            v-else-if="!item.subheader && !item.children"
            :key="`item-${i}`"
            :item="item"
          />
        </template>
        
      </v-list>
        <v-list-item class="logout-list-item" two-line :class="miniVariant && 'px-1'">
          <v-list-item-avatar
            class="ml-n1"
            min-width="70px"
            height="70px"
            width="70px"
          >
          
             <div class="user-info" @click="openModal">
                  <div class="user-initials">
                    <span>
                      {{userInfo }}
                    </span>
                  </div>
                  <!-- <img src="../../../assets/images/avatars/001-man.svg" alt="avatar"> -->
                 
                </div>

          </v-list-item-avatar>
       <v-btn icon @click="openModal">
        <v-icon>mdi-logout</v-icon>
        </v-btn>
           <v-list-item-content>
            <v-list-item-title class="text-16 mb-1 font-weight-regular"
              ></v-list-item-title>
            <v-list-item-subtitle class="mt-n1">
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
       
    </vue-perfect-scrollbar>
       <sidebar-modal
        :isModalOpen="isModalOpen"
        :userInfo = "userInfo"
        :userFullname = "userFullname"
        @closeModal="isModalOpen=false"
      ></sidebar-modal>
      
  </v-navigation-drawer>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import SidebarModal from "../../components/custom_components/SidebarModal"
import { items } from "../../data/navigation";
export default {
  // components: {
  //   VuePerfectScrollbar,
  // },
  components: {
   SidebarModal

  },
  data() {
    return {
      drawer: true,
      switch1: "on",
      color: "dark",
      colors: ["primary", "blue", "success", "red", "teal"],
      right: false,
      permanent: true,
      miniVariant: false,
      expandOnHover: false,
      background: false,
      items: items,
      opacity: 0.1,
      isModalOpen:false,
      selectedOption:null,
      firstName:null,
      lastName:null,
      inventarName: null
    
    };
  },
  watch:{
    inventarTitle:{
      handler(){
        const additionalItem = 
        {
          title: this.inventarTitle,
          icon: require("../../assets/images/icons/map.png"),
          activeIcon: require("../../assets/images/icons/map.png"),
          to: "/app/pages/tree-list-map",
          activeWhen: "TreeList",
          hasBorder: true,
        };
         const getToken = JSON.parse(localStorage.getItem("token"));
         const users = JSON.parse(localStorage.getItem("userInfo"));
         if(users.length) {
          const userAdmin = users.find(user => user.token === getToken && user.type === 1);
              var mapIndex = items.findIndex(x=>x.to === "/app/pages/tree-list-map");
           if (userAdmin) {
              if(this.inventarTitle !== null && items.find(x=>x.to == "/app/pages/tree-list-map")) {
                this.items[mapIndex] = additionalItem;
              } 
              else if(this.inventarTitle === null){
              if (mapIndex !== -1) {
              items.splice(mapIndex, 1);
              }
              }
              else {
                items.push(additionalItem);
              }
            }
            else{
              if (mapIndex !== -1) {
              items.splice(mapIndex, 1);
              }
            }
       }
      }
    }
  },
  computed: {
    ...mapGetters(["getThemeMode", "inventarId","getUserFirstName","getUserLastName","loggedInUser", "inventarTitle"]),
    userInfo(){
      if(this.firstName && this.lastName){
        return this.firstName[0].toUpperCase() + this.lastName[0].toUpperCase()
      }
    },
    userFullname(){
      if(this.firstName && this.lastName){
        const capitalizedFirstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
          const capitalizedLastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
          return capitalizedFirstName + ' ' + capitalizedLastName;
      }
    },
    bg() {
      return this.background
        ? "https://images.pexels.com/photos/1687678/pexels-photo-1687678.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
        : undefined;
    },
    getMiniVariant() {
      return this.miniVariant;
    },
    computedItems() {
      return this.items.map(this.mapItem);
    }
  },
  mounted(){
    // debugger;
    const additionalItem = 
        {
        title: "Verwaltung",
        icon: require("../../assets/images/icons/verwaltung.svg"),
        activeIcon: require("../../assets/images/icons/verwaltung-active.svg"),
        to: "/app/pages/management",
        activeWhen: "Verwaltung"
        };
    const getToken = JSON.parse(localStorage.getItem("token"));
    const users = JSON.parse(localStorage.getItem("userInfo"));
      if(users.length) {
            const user = users.find(user => user.token == getToken)
            if(user){
              this.firstName = user.user.firstName
              this.lastName = user.user.lastName
            }
            var managementIndex = items.findIndex(x=>x.title === "Verwaltung");
            const userAdmin = users.find(user => user.token === getToken && user.type === 1);
            if (userAdmin) { 
              
              if(items.find(x=>x.title == "Verwaltung")){
                this.items[managementIndex] = additionalItem;
              }
               else if (managementIndex !== -1) {
              items.splice(managementIndex, 1);
              }
              
              else {
                items.push(additionalItem);
              }
            }
            else{
              if (managementIndex !== -1) {
              items.splice(managementIndex, 1);
              }
            }
      }

  },
  methods: {
    ...mapActions(["changeVerticalSidebarDrawer", "changeVerticalSidebarMini", "updateInventarId"]),
    toggleSidebar() {
      this.changeVerticalSidebarMini();
      // this.expandOnHover = !this.expandOnHover;
      // this.$emit("update:mini-variant");
      // console.log("check");
    },
    mapItem(item) {
      let noInventarNoEntry = false
      if(item.meta?.requiredInventar){
        noInventarNoEntry = this.inventarId == null 
      }


      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: item.title,
        disabled: noInventarNoEntry
      };
    },
    logoutUser() {
      this.updateInventarId(null);
      this.$router.push('/app/sessions/sign-in-two');
    },
   openModal() {
       this.isModalOpen=true;
   },
    // handleModalConfirm(option){
    //    if(option === "changePassword") {
    //   console.log("change password option selected");

    //    } else if(option === "logout") {
    //       console.log("log out selected");
    //    }
    //    this.isModalOpen=false;
      

    //      },
       

  },

}
</script>

<style lang="scss">
.components {
  margin-top:27px;

}
.logout-list-item {
  flex: initial !important;
  margin-top: auto !important;
  padding-left: 0 !important;
}
.ps-container {
  position: inherit !important;
  display: flex;
  flex-direction: column;
}
  #change-side-btn{
    display: flex !important;
    flex-direction: row-reverse !important;
  }
.app-admin-wrap-layout-1.sidebar-mini {
  .v-toolbar {
    left: 56px !important;
    transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);
  }
  .v-main {
    padding: 75px 0px 12px 56px !important;
    transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);
    padding-bottom: 0px !important;
  }
  &.sidebar-close {
    .v-toolbar {
      left: 0px !important;
      transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);
    }
    .v-main {
      padding: 75px 0px 12px 0px !important;
      transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);
      padding-bottom: 0px !important;
    }
  }
}
   .pa-1 {
    margin-top:150% !important;


   }
   .ml-n1 {
    margin-left:14% !important; 


   }
    .user-info {
         cursor: pointer;
          display: flex;
          align-items: center;
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
              color: #1db954;
            }
          }
    }
</style>
