<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="tableData"
      :show-select="showSelect"
      :singleSelect="singleSelect"
      item-key="id"
      :item-class="lockedRowClass"
      v-model="mySelectedItems"
      :expanded="locked"
      :search="testVal"
    >
      <template #item.buttons="{item}">
        <div class="buttons-holder">
          <!-- <v-icon
            v-for="action in actions"
            :key="action.id"
            :disabled="isButtonDisabled(action, item)"
            @click="$emit(action.action, item.id, item.name, item.date)"
            class="green--text custom-action-icon"
            >{{ action.icons }}</v-icon
          > -->
          <img  v-for="action in actions" 
            v-show="!isButtonDisabled(action, item)"
            :key="action.id"
            :class="isButtonDisabled(action, item) ? 'disabled' : ''"
            @click="$emit(action.action, item.id, item.name, item.date)"
            class="green--text custom-action-icon" v-bind:src="action.icons" />
        </div>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="text-center">
          <v-icon>mdi-lock-outline</v-icon> Das Inventar wird von
          <span class="locked-by">{{ item.lockedBy }}</span> blockiert. Sie
          können nur lesen
        </td>
      </template>

      <template v-slot:item.totalTrees="{ item }">
        <div v-if="item.totalTrees" class="d-flex">
          <img class="custom-map-area-icon" src="../../assets/images/icons/baumliste.svg" /> 
          <span>{{ item.totalTrees }}</span>
        </div>
      </template>

      <template #header.data-table-select="{ }"> </template>

      <template #item.data-table-select="{ item, isExpanded }">
        <div>
          <v-checkbox
            color="#1DB954"
            v-model="mySelectedItems"
            :off-icon="offIcon"
            :on-icon="onIcon"
            :value="item.id"
            @click="$emit('selectedRow', item.id)"
          ></v-checkbox>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: [
    "headers",
    "tableData",
    "actions",
    "showSelect",
    "singleSelect",
    "selectedItemsProp",
    "locked",
    "disabled"
  ],
  data() {
    return {
      selectedItems: [],
      localSearch: null,
      itemRowBackground: ""
    };
  },
  watch: {
    selectedItemsProp() {
      this.preSelectValues();
    },
    tableData() {
      this.preSelectValues();
    }
  },
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
    this.preSelectValues();
    this.localSearch = this.getSearchquery;
    console.log(this.localSearch);
  },
  methods: {
    onSelectAllInputHandler(value) {
      if (value) {
        this.allChecked = this.selectedItems.map(m => m.id);
      } else {
        this.allChecked = [];
      }
    },
     handleSearch(query) {
      this.getSearchquery = query;
    },

    preSelectValues() {
      if (this.selectedItemsProp && this.tableData) {
        let result = this.tableData.find(s => {
          return s.id === this.selectedItemsProp;
        });

        if(result)
          this.selectedItems = [result.id];

      }
    },

    isButtonDisabled(action, item) {
      if(item.canView === false && (action.action === "view" || action.action === "map")) {
        return true;
      } else if (item.canEdit === false && action.action === "edit") {
        return true;
      } else {
        return false;
      }
    },
    
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
  cursor: pointer;
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

.custom-calendar-icon {
  margin-right: 5px;
}

.buttons-holder {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.locked-row {
  td {
    border-top: 1px solid;
    box-shadow: none !important;
    border-bottom: 0 !important;
    border-color: red !important;

    &:first-child {
      border-left: 1px solid;
    }

    &:last-child {
      border-right: 1px solid;
    }
  }
  // pointer-events: none !important;

  &:hover {
    background: transparent !important;
  }
}

.v-data-table__expanded__content {
  box-shadow: none !important;

  td {
    border-color: red !important;
    border-bottom: 1px solid;
    border-left: 1px solid;
    border-right: 1px solid;
  }
}

.locked-text {
  position: absolute;
  top: 0;
  left: 0;
  background-color: red;
  color: white;
  padding: 4px;
}

.locked-by {
  font-weight: 600;
}
.custom-map-area-icon {
  margin-right: 8px;
  width: 20px;
  height: 20px;
}

</style>
