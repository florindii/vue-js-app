<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="tableData"
      :show-select="showSelect"
      :singleSelect="singleSelect"
      item-key="id"
      :item-class="lockedRowClass"
      :selectedItemsProp="selectedItemsProp"
      v-model="mySelectedItems"
    >
      <template #item.buttons="{item}">
        <div class="buttons-holder">
          <v-icon
            v-for="action in actions"
            :key="action.id"
            @click="$emit(action.action, item.id, item.name, item.date)"
            class="green--text custom-action-icon"
            >{{ action.icons }}</v-icon
          >
        </div>
      </template>

      <template v-slot:item.date="{ item }">
        <v-icon class="custom-calendar-icon">mdi-calendar-blank-outline</v-icon>
        <span>{{ item.date | formatDate }}</span>
      </template>

      <template v-slot:item.info="{ item }">
        <span v-if="item.attribute !== null">i</span>
        <span v-else></span>
      </template>

      <template #header.data-table-select="{ }"> </template>

      <template #item.data-table-select="{ item }">
        <v-checkbox
          v-if="singleSelect"
          color="#1DB954"
          v-model="mySelectedItems"
          :value="item"
          @click="$emit('selectedRow', item.id)"
        ></v-checkbox>
        <v-checkbox
          v-else
          color="#1DB954"
          v-model="mySelectedItems"
          :value="item"
        ></v-checkbox>
      </template>
    </v-data-table>

    <v-btn @click="test">a</v-btn>
  </div>
</template>

<script>
export default {
  props: [
    "headers",
    "tableData",
    "actions",
    "showSelect",
    "singleSelect",
    "selectedItemsProp"
  ],
  data() {
    return {
      selectedItems: [],
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
    mySelectedItems: {
      get() {
        if (this.singleSelect) {
          return this.selectedItems[this.selectedItems.length - 1];
        }
        return this.selectedItems;
      },
      set(value) {
        if (this.singleSelect) this.selectedItems = [value];
        else this.selectedItems.concat([value]);
      }
    },
    lockedRowClass() {
      return item => (item.isLocked ? "locked-row" : "");
    }
  },
  mounted() {
    this.preSelectValues();
  },
  methods: {
    test() {
      console.log(this.selectedItems);
    },
    onSelectAllInputHandler(value) {
      console.log(this.selectedItems);
      if (value) {
        this.allChecked = this.selectedItems.map(m => m.id);
      } else {
        this.allChecked = [];
      }
    },

    preSelectValues() {
      if (this.selectedItemsProp && this.tableData) {
        let result = this.tableData.find(s => {
          return s.id === this.selectedItemsProp;
        });

        this.selectedItems.push([result]);
      }
    }
  }
};
</script>

<style lang="scss">
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
  // pointer-events: none !important;
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
