<template>
  <v-list-item @click.stop="toggleSidebar"
    :href="href"
    :rel="href && href !== '#' ? 'noopener' : undefined"
    :target="href && href !== '#' ? '_blank' : undefined"
    :to="item.to"
    :height="48"
    :class="[
      'text-18',
      { 'custom-active': item.activeWhen.split(',').includes($route.name) },
      { 'border-class': item.hasBorder }
    ]"
    v-ripple="{class: 'primary--text'}"
    :disabled="item.disabled"
  >
    <v-list-item-icon v-if="text" class="v-list-item__icon--text" v-text="computedText" />

    <v-list-item-icon v-else-if="item.icon" >
      <!-- <v-icon v-text="item.icon" />  -->
      <img   class="v-icon" v-bind:class="{ 'border-img': item.hasBorder }"
        v-bind:src="item.activeWhen.split(',').includes($route.name) ? item.activeIcon  : item.icon" />
    </v-list-item-icon>

    <v-list-item-content c class="pa-0 text-14" v-if="item.title || item.subtitle">
      <v-list-item-title class="ma-0 text-14" v-bind:class="{ 'title-with-icon': item.hasBorder }" v-text="item.title.length > 20 ? item.title.slice(0, 20) + '...' : item.title" />
      <v-list-item-subtitle v-text="item.subtitle" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import Themeable from "vuetify/lib/mixins/themeable";
import { mapActions, mapMutations} from "vuex";

export default {
  name: "Item",

  mixins: [Themeable],

  props: {
    item: {
      type: Object,
      default: () => ({
        href: undefined,
        icon: undefined,
        subtitle: undefined,
        title: undefined,
        to: undefined,
      }),
    },
    text: {
      type: Boolean,
      default: false,
    },
    activeMenu: {
      type: Number,
      default: 0
    }
  },
methods:{
  ...mapActions(["changeVerticalSidebarMini"]),
  toggleSidebar() {
    this.changeVerticalSidebarMini(true);
    },
},
  computed: {
    computedText() {
      if (!this.item || !this.item.title) return "";

      let text = "";

      this.item.title.split(" ").forEach((val) => {
        text += val.substring(0, 1);
      });

      return text;
    },
    href() {
      return this.item.href || (!this.item.to ? "#" : undefined);
    },
    isActive(item) {
      return this.$route.name === 'TaskProfil'
    }
  },
};
</script>

<style scoped lang="scss">
// .title-with-icon::after {
//   content: "\F09E7";
//   margin-left: 10px;
//   font-size: 20px !important;
// }
.border-class{
  border: 1px solid #494949;
  border-radius: 5px;
}
.custom-active {
  position: relative;

  .v-icon {
    color: #1DB954;
  }

  &::after {
    position: absolute;
    width: 3px;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #1DB954;
  }

  &::before {
    opacity: 0.24;
  }
}
.border-img{
  border-radius: 50%;
}
.v-icon{
  width: 20px;
  height: 20px;
}
.v-list-item--disabled {
  .v-icon {
    opacity: 0.5;
  }
}
</style>
