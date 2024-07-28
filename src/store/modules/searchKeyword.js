export default {
    state: {
      searchQuery: null,
    },
    mutations: {
      setSearchQuery(state, data) {
        state.searchQuery = data;
      },
    },
    actions: {
      updateSearchQuery({ commit }, data) {
        commit("setSearchQuery", data);
      },
    },
    getters: {
        getSearchquery: state => state.searchQuery,
    }
  };