export default {
    state: {
      treeTableData: null
    },
    mutations: {
      setTreeTableData(state, data) {
        console.log("daata treees",data);
        state.treeTableData = data;
      }
    },
    actions: {
      fetchTreeTableData({ commit }, data) {
        commit("setTreeTableData", data);
        
      }
    },
    getters: {
      getTableDataFromSQL: state => state.treeTableData,

      getFromSQL(){

      }
    }
  };
  