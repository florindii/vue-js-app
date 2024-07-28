export default {
    state: {
      treeItem: [],
      areaItem: [],
    },
    mutations: {
      setTreeItem(state, data) {
      state.treeItem = data;
      },
      setAreaItem(state, data) {
        state.areaItem = data;
      }
    },
    actions: {
      addTreeItem({ commit }, data) {
        commit("setTreeItem", data);
      },
      addAreaItem({ commit }, data){
        commit("setAreaItem", data);
      }
    },
    getters: {
      getTreeItem: state => state.treeItem,
      getAreaItem: state => state.areaItem
    }
  };
  