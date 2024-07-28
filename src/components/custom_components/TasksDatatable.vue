<template>
  <div>
    <div class="check-all-holder">
      <v-checkbox v-model="selectedAll" label="alle auswählen" @click="allCheckCLicked"></v-checkbox>
    </div>

    <v-data-table
      :headers="headers"
      :items="tableData"
      :sort-by="['date']"
      :sort-desc="true"
      :show-select="showSelect"
      :singleSelect="singleSelect"
      item-key="id"
      v-model="mySelectedItems"
      :search="performSearch"
    >
      <template #item.buttons="{item}">
        <div class="buttons-holder">
          <!-- <v-icon
            v-for="action in actions"
            :key="action.id"
            :disabled="isButtonDisabled(action, item)"
            @click="$emit(action.action, item)"
            class="green--text custom-action-icon"
            >{{ action.icons }}</v-icon
          > -->
          <img v-for="action in actions"
            v-show="!isButtonDisabled(action, item)"
            :key="action.id"
            :class="isButtonDisabled(action, item) ? 'disabled' : ''"
            @click="$emit(action.action, item)"
            class="green--text custom-action-icon" v-bind:src="action.icons" />
        </div>
      </template>

      <template v-slot:body.prepend="{ headers }">
        <tr v-show="selectedItems.length > 0">
          <td v-for="(header, i) in headers" :key="i">
            <div v-if="i == 0">
              Total:
            </div>
            <div
              v-if="header.value == 'specialHours'"
              class="custom-green-text"
            >
              {{ totalSpecialHours + " h" }}
            </div>

            <div v-if="header.value == 'normalHours'" class="custom-green-text">
              {{ totalNormalHours + " h" }}
            </div>

            <div v-if="header.value == 'material'" class="custom-green-text">
              {{ totalMaterial + " Fr." }}
            </div>

            <div v-else>
              <!-- empty table cells for columns that don't need a sum -->
            </div>
          </td>
        </tr>
      </template>

      <template v-slot:item.date="{ item }">
        <div v-if="item.date">
          <v-icon class="custom-calendar-icon"
            >mdi-calendar-blank-outline</v-icon
          >
          <span>{{ item.date | formatDate }}</span>
        </div>
      </template>

      <template v-slot:item.finishDate="{ item }">
        <div v-if="item.finishDate">
          <v-icon class="custom-calendar-icon"
            >mdi-calendar-blank-outline</v-icon
          >
          <span>{{ item.finishDate | formatDate }}</span>
        </div>
      </template>

      <template v-slot:item.treeName="{ item }">
        <div v-if="item.treeName" class="d-flex">
          <img class="custom-map-area-icon" src="../../assets/images/icons/baumliste.svg" /> 
          <span>{{ item.treeName}}</span>
        </div>
      </template>
      <template v-slot:item.tasksFinishedUsers="{ item }">
        <div v-if="item.tasksFinishedUsers.length > 0">
          <div
            class="acc-name-duration"
            v-for="user in item.tasksFinishedUsers"
          >
            <p class="acc-name">
              <span class="initials">
                {{ getInitials(user.firstName, user.lastName) }}
              </span>
              {{ user.firstName }} {{ user.lastName }}
            </p>
          </div>
        </div>
      </template>

      <template v-slot:item.info="{ item }">
        <span v-if="item.attribute !== null">  <img class="custom-map-area-icon" src="../../assets/images/icons/info.svg" /> </span>
        <span v-else></span>
      </template>

      <template #header.data-table-select="{ }"> </template>

      <template #item.data-table-select="{ item, isSelected }">
        <v-checkbox
          color="#1DB954"
          v-model="mySelectedItems"
          :value="item"
          @click="$emit('selectedRow', mySelectedItems)"
        ></v-checkbox>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { eventBus } from "../../main";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["headers", "tableData", "actions", "showSelect", "singleSelect", "userCanView", "userCanEdit", "userCanDelete"],
  data() {
    return {
      selectedItems: [],
      totalSpecialHours: 0,
      totalNormalHours: 0,
      totalMaterial: 0,
      selectedAll: false,
    };
  },
  computed: {
    ...mapGetters(["getSearchquery"]),
    performSearch() {
      return this.getSearchquery;
    },
    mySelectedItems: {
      get() {
        if (this.singleSelect) {
          return [this.selectedItems[this.selectedItems.length - 1]];
        } else {
          return this.selectedItems;
        }
      },
      set(value) {
        if (typeof value !== "object") this.selectedItems = [value];
        else this.selectedItems = value;
      }
    },
    lockedRowClass() {
      return item => (item.isLocked ? "locked-row" : "");
    },
  },
  watch: {
    selectedItems: {
      handler(newVal, oldVal) {
        if (newVal.length > 0) {
          this.calculateSumOfColumns();
        } else {
          return;
        }
      }
    }
  },
  mounted() {
    eventBus.$on("resetSelectedTasks", () => (this.selectedItems = []));
  },
  destroyed() {
    eventBus.$off("resetSelectedTasks");
  },
  methods: {
    allCheckCLicked() {
      if(this.selectedAll === true) {
        this.selectedItems = this.tableData;
      } else {
        this.selectedItems = [];
      }
    },
    calculateSumOfColumns() {
      /* special hours sum */
      const sumOfSpecialHours = this.selectedItems.reduce(
        (accumulator, currentItem) => {
          return accumulator + currentItem.specialHours;
        },
        0
      );

      /* normal hours sum */
      const sumOfNormalHours = this.selectedItems.reduce(
        (accumulator, currentItem) => {
          return accumulator + currentItem.normalHours;
        },
        0
      );

      /* material sum */
      const sumOfMaterial = this.selectedItems.reduce(
        (accumulator, currentItem) => {
          return accumulator + currentItem.material;
        },
        0
      );

      this.totalSpecialHours = sumOfSpecialHours;
      this.totalNormalHours = sumOfNormalHours;
      this.totalMaterial = sumOfMaterial;
    },

    isButtonDisabled(action, item) {

      /* if user can view from backend and action is view, dont disable button */
      /* if user can edit, and action is edit, and the task is not finished, dont disable button */
      if(this.userCanView === true && action.action === "view") {
        return false;
      } else if (this.userCanEdit === true && action.action === "edit") {
        if(item.isFinished === true) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },

    /* function that provides initials and handles if name or surname has spaces */
    getInitials(name, surname) {
      let nameInitials = "";
      if (name) {
        nameInitials = name
          .split(" ")
          .map(n => n.charAt(0))
          .join("");
      }
      let surnameInitials = "";
      if (surname) {
        surnameInitials = surname
          .split(" ")
          .map(n => n.charAt(0))
          .join("");
      }
      return (nameInitials + surnameInitials).toUpperCase() || "";
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
.check-all-holder {
  padding-left: 16px;
  padding-top: 16px;
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

.custom-green-text {
  color: #1db954;
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

.acc-name-duration {
  margin-top: 10px;

  .acc-name {
    text-transform: capitalize;
    display: flex;
    align-items: center;

    .initials {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #494949;
      padding: 8px;
      border-radius: 100%;
      margin-right: 10px;
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 500;
      color: #1db954;
      width: 36px;
      height: 36px;
    }
  }

  .duration {
    margin-left: 46px;
  }
}
</style>
