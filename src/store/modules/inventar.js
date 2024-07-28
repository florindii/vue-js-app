export default {
  state: {
    inventarSelectedYear: null,
    inventarId: null,
    inventarCoordinates:null,
    inventarTitle: null,
  },
  mutations: {
    setSelectedYear(state, data) {
      state.inventarSelectedYear = data;
    },
    setInventarId(state, data) {
      state.inventarId = data;
    },
    setInventarCoordinates(state, data){
      state.inventarCoordinates = data
    },
    setInventarTitle(state, data){
      state.inventarTitle = data;
      // alert(state.inventarTitle);
    }
  },
  actions: {
    updateSelectedYear({ commit }, data) {
      commit("setSelectedYear", data);
    },
    updateInventarId({ commit }, data) {
      commit("setInventarId", data);
    },
    updateInventarCoordinates({commit},data){
      commit("setInventarCoordinates",data);
    },
    updateInventarTitle({commit},data){
      commit("setInventarTitle",data);
    },
  },
  getters: {
    inventarSelectedYear: state => state.inventarSelectedYear,
    inventarId: state => state.inventarId,
    inventarTitle: state =>state.inventarTitle,
    inventarCoordinates: state => state.inventarCoordinates
  }
};
