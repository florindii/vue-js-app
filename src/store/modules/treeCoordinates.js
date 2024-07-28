export default {
    state: {
      treeCoordinates: null
    },
    mutations: {
      setTreeCoordinates(state, data) {
        state.treeCoordinates = data;
      }
    },
    actions: {
      addTreeCoordinates({ commit }, data) {
        console.log("dataa trees",data);
        commit("setTreeCoordinates", data);
      }
    },
    getters: {
      getTreeCoordinates: state => state.treeCoordinates
    }
  };
  