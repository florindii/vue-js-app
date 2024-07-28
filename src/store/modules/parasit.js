import axios from 'axios';

const state = {
  parasits: []
};

const mutations = {
  SET_PARASITS(state, parasits) {
    state.parasits = parasits;
  },
  ADD_PARASIT(state, parasit) {
    state.parasits.push(parasit);
  }
};

const actions = {
  async fetchParasits({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/Parasit/GetAll');
    const parasits = response.data;
    commit('SET_PARASITS', parasits);
  },
  async createParasit({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/Parasit/Create', payload);
    const parasit = response.data;
    commit('ADD_PARASIT', parasit);
  }
};

const getters = {
  parasits: (state) => state.parasits
};

export default {
  state,
  mutations,
  actions,
  getters
};
