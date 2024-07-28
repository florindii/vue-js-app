import axios from 'axios';

const state = {
  mammals: []
};

const mutations = {
  SET_MAMMALS(state, mammals) {
    state.mammals = mammals;
  },
  ADD_MAMMALS(state, mammal) {
    state.mammals.push(mammal);
  }
};

const actions = {
  async fetchMammals({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/Mammals/GetAll');
    const mammals = response.data;
    commit('SET_MAMMALS', mammals);
  },
  async createMammal({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/Mammals/Create', payload);
    const mammal = response.data;
    commit('ADD_MAMMAL', mammal);
  }
};

const getters = {
  mammals: (state) => state.mammals
};

export default {
  state,
  mutations,
  actions,
  getters
};
