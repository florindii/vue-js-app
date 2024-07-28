import axios from 'axios';

const state = {
  beetles: []
};

const mutations = {
  SET_BEETLES(state, beetles) {
    state.beetles = beetles;
  },
  ADD_BEETLES(state, beetle) {
    state.beetles.push(beetle);
  }
};

const actions = {
  async fetchBeetles({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/Beetle/GetAll');
    const beetles = response.data;
    commit('SET_BEETLES', beetles);
  },
  async createBeetle({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/Beetle/Create', payload);
    const beetle = response.data;
    commit('ADD_BEETLE', beetle);
  }
};

const getters = {
  beetles: (state) => state.beetles
};

export default {
  state,
  mutations,
  actions,
  getters
};
