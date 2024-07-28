<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="tableData"
      :show-select="showSelect"
      :singleSelect="singleSelect"
      item-key="index"
      :item-class="lockedRowClass"
      v-model="mySelectedItems"
      :search="testVal"
    >
      <template #item.buttons="{item}">
        <div class="buttons-holder">
          <!-- <v-icon
            v-if="item.isTree"
            v-for="action in actions"
            :key="action.id"
            :disabled="isButtonDisabled(action, item)"
            @click="$emit(`${action.action}`, item)"
            class="green--text custom-action-icon"
            >{{ action.icons }}</v-icon
          > -->
           <img v-if="item.isTree" v-for="action in actions"
            v-show="!isButtonDisabled(action, item)"
            :key="action.id"
            :class="isButtonDisabled(action, item)? 'disabled' : ''"
            @click="$emit(`${action.action}`, item)"
            class="green--text custom-action-icon" v-bind:src="action.icons"/> 


            <img v-else
            v-show="action.show"
            :key="action.id"
            @click="$emit(`${action.action}`, item)"
            class="green--text custom-action-icon"
            v-bind:src="action.icons"/> 

          <!-- <v-icon
            v-else
            v-show="action.show"
            :key="action.id"
            @click="$emit(`${action.action}`, item)"
            class="green--text custom-action-icon"
            >{{ actions[0].icons }}</v-icon
          > -->
        </div>
      </template>

      <template v-slot:item.name="{ item }">
        <div v-if="item.name" class="d-flex">
          <!-- <v-icon v-if="item.isTree" class="custom-map-area-icon"
            >mdi mdi-tree-outline</v-icon
          > -->
          <img v-if="item.isTree" class="custom-map-area-icon" src="../../assets/images/icons/baumliste.svg" /> 
          <v-icon v-else class="custom-map-area-icon"
            >mdi mdi-texture-box</v-icon
          >
          <span>{{ item.name }}</span>
        </div>
      </template>

      <template #header.data-table-select="{ }"> </template>

      <template #item.data-table-select="{ item }">
        <v-checkbox
          :id="`${item.id}-${item.areaId}`"
          :multiple="true"
          color="#1DB954"
          v-model="mySelectedItems"
          :off-icon="offIcon"
          :on-icon="onIcon"
          :value="item"
          @click="$emit('selectedRow', mySelectedItems)"
        ></v-checkbox>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../../main";
export default {
  props: ["headers", "tableData", "actions", "showSelect", "singleSelect", "userCanView", "userCanEdit", "userCanDelete"],
  data() {
    return {
      selectedItems: []
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["getSearchquery"]),
     testVal() {
      return this.getSearchquery;
    },
    mySelectedItems: {
      get() {
        if (this.singleSelect)
          return [this.selectedItems[this.selectedItems.length - 1]];
        return this.selectedItems;
      },
      set(value) {
        if (typeof value !== "object") this.selectedItems = [value];
        else this.selectedItems = value;
      }
    },
    offIcon() {
      return this.singleSelect
        ? "mdi-checkbox-blank-circle-outline"
        : "mdi-checkbox-blank-outline";
    },
    onIcon() {
      return this.singleSelect
        ? "mdi-checkbox-blank-circle"
        : "mdi-checkbox-marked";
    },
    lockedRowClass() {
      return item => (item.isLocked ? "locked-row" : "");
    }
  },
  mounted() {

    eventBus.$on("onTableFilter", () => (this.selectedItems = []));
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
  },
  destroyed() {
    eventBus.$off("onTableFilter");
  },
  methods: {
    onSelectAllInputHandler(value) {
      // console.log(this.selectedItems);
      if (value) {
        this.allChecked = this.selectedItems.map(m => m.id);
      } else {
        this.allChecked = [];
      }
    },
       handleSearch(query) {
      this.getSearchquery = query;
    },

    isButtonDisabled(action, item) {
      /* if user can view from backend and action is view, dont disable button */
      /* if user can edit, and action is edit, and the task is not finished, dont disable button */
      if (this.userCanView === true && action.action === "view") {
        return false;
      } else if (this.userCanEdit === true && action.action === "edit") {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang="scss">
.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: default;
}
.custom-action-icon {
  border: 1px solid #494949;
  padding: 8px;
  border-radius: 5px;
  width: 42px;
  height: 42px;

  &::after {
    border-radius: 5px;
    width: 42px;
    height: 42px;
    transform: scale(1);
  }
}

.custom-map-area-icon {
  margin-right: 5px;
  width: 20px;
  height: 20px;
}

.buttons-holder {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.locked-text {
  position: absolute;
  top: 0;
  left: 0;
  background-color: red;
  color: white;
  padding: 4px;
}
</style>
