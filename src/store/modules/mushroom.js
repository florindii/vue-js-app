import axios from 'axios';

const state = {
  mushrooms: []
};

const mutations = {
  SET_MUSHROOMS(state, mushrooms) {
    state.mushrooms = mushrooms;
  },
  ADD_MUSHROOM(state, mushroom) {
    state.mushrooms.push(mushroom);
  }
};

const actions = {
  async fetchMushrooms({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/MushroomType/GetAll');
    const mushrooms = response.data;
    commit('SET_MUSHROOMS', mushrooms);
  },
  async createMushroom({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/MushroomType/Create', payload);
    const mushroom = response.data;
    commit('ADD_MUSHROOM', mushroom);
  }
};

const getters = {
  mushrooms: (state) => state.mushrooms
};

export default {
  state,
  mutations,
  actions,
  getters
};
