import axios from 'axios';

const state = {
  healths: []
};

const mutations = {
  SET_HEALTHS(state, healths) {
    state.healths = healths;
  },
  ADD_HEALTH(state, health) {
    state.healths.push(health);
  }
};

const actions = {
  async fetchHealths({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/Health/GetAll');
    const healths = response.data;
    commit('SET_HEALTHS', healths);
  },
  async createHealth({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/Health/Create', payload);
    const health = response.data;
    commit('ADD_HEALTH', health);
  }
};

const getters = {
  healths: (state) => state.healths
};

export default {
  state,
  mutations,
  actions,
  getters
};
