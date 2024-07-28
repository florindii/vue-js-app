<template>
  <v-data-table
    :headers="headers"
    :items="userTableData"
    show-select
    single-select
  >
    <template #item.buttons="{item}">
      <div class="buttons-holder">
        <v-icon
          v-for="action in actions"
          :key="action.id"
          @click="$emit(action.action, item.id)"
          class="green--text"
          >{{ action.icons }}</v-icon
        >
      </div>
    </template>

    <template #item.data-table-select="{ item }">
      <v-checkbox color="#1DB954" v-model="lastChecked" :value="item.id"></v-checkbox>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ["headers", "userTableData", "actions"],
  data() {
    return {
        selectedItems: []
    }
  },
  computed: {
    lastChecked: {
      get() {
        return this.selectedItems[this.selectedItems.length - 1];
      },
      set(value) {
        this.selectedItems = [value];
      }
    }
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.v-icon {
  border: 1px solid #494949;
  padding: 3px;
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

.buttons-holder {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
</style>