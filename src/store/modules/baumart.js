import axios from 'axios';

const state = {
  baumarts: []
};

const mutations = {

  SET_BAUMARTS(state, baumarts) {
    state.baumarts = baumarts;
  },
  ADD_BAUMART(state, baumart) {
    state.baumarts.push(baumart);
  },
  UPDATE_BAUMART(state, updatedBaumart) {
    const index = state.baumarts.findIndex((b) => b.id === updatedBaumart.id);
    if (index !== -1) {
      state.baumarts.splice(index, 1, updatedBaumart);
    }
  }
};

const actions = {
  async fetchBaumarts({ commit }) {
    console.log ('fetchBaumarts action called');
    const response = await axios.get('https://tilia.rrota.org/api/TreeType/GetAll');
    const baumarts = response.data;
    commit('SET_BAUMARTS', baumarts);
  },
 async createBaumart({ commit, dispatch }, payload) {
  console.log("createBaumart action called with payload:", payload);

  try {
    const response = await axios.post(
      "https://tilia.rrota.org/api/TreeType/Create",
      payload
    );
    const baumart = response.data;
    console.log("createBaumart action succeeded with response:", baumart);
    commit("ADD_BAUMART", baumart);
     dispatch("fetchBaumarts");
  } catch (error) {
    console.error("createBaumart action failed with error:", error);
    throw error;
  }
}

  
};  

const getters = {
  baumarts: (state) => state.baumarts
};

export default {
  state,
  mutations,
  actions,
  getters
};
