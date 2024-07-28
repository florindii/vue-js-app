import axios from 'axios';

const state = {
  birds: []
};

const mutations = {
  SET_BIRDS(state, birds) {
    state.birds = birds;
  },
  ADD_BIRDS(state, bird) {
    state.birds.push(bird);
  }
};

const actions = {
  async fetchBirds({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/Bird/GetAll');
    const birds = response.data;
    commit('SET_BIRDS', birds);
  },
  async createBird({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/Bird/Create', payload);
    const bird = response.data;
    commit('ADD_BIRD', bird);
  }
};

const getters = {
  birds: (state) => state.birds
};

export default {
  state,
  mutations,
  actions,
  getters
};
