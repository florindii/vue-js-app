import axios from 'axios';

const state = {
  insects: []
};

const mutations = {
  SET_INSECTS(state, insects) {
    state.insects = insects;
  },
  ADD_INSECT(state, insect) {
    state.insects.push(insect);
  }
};

const actions = {
  async fetchInsects({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/InsectType/GetAll');
    const insects = response.data;
    commit('SET_INSECTS', insects);
  },
  async createInsect({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/InsectType/Create', payload);
    const insect = response.data;
    commit('ADD_INSECT', insect);
  }
};

const getters = {
  insects: (state) => state.insects
};

export default {
  state,
  mutations,
  actions,
  getters
};
