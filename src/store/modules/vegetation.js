import axios from 'axios';

const state = {
  vegetations: []
};

const mutations = {
  SET_VEGETATIONS(state, vegetations) {
    state.vegetations = vegetations;
  },
  ADD_VEGETATIONS(state, vegetation) {
    state.vegetations.push(vegetation);
  }
};

const actions = {
  async fetchVegetations({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/VegetationType/GetAll');
    const vegetations = response.data;
    commit('SET_VEGETATIONS', vegetations);
  },
  async createVegetation({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/VegetationType/Create', payload);
    const vegetation = response.data;
    commit('ADD_VEGETATION', vegetation);
  }
};

const getters = {
  vegetations: (state) => state.vegetations
};

export default {
  state,
  mutations,
  actions,
  getters
};
