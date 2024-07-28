export default {
    state: {
      treeId: null,
      areaId:null,
      isTree:null
    },
    mutations: {
      setTreeId(state, data) {
        state.treeId = data;
      },
      setAreaId(state, data) {
        state.areaId = data;
      },
      setIsTree(state, data) {
        state.isTree = data;
      }
    },
    actions: {
      addTreeId({ commit }, data) {
        console.log("erdh",data);
        commit("setTreeId", data);
      },
      addAreaId({ commit }, data) {
        commit("setAreaId", data);
      },
      addIsTree({ commit }, data){
        commit("setIsTree", data);
      }
    },
    getters: {
      getTreeId: state => state.treeId,
      getAreaId: state => state.areaId,
      getIsTree: state => state.isTree
    }
  };
  