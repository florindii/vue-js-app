import axios from 'axios';

const state = {
  arachnids: []
};

const mutations = {
  SET_ARACHNIDS(state, arachnids) {
    state.arachnids = arachnids;
  },
  ADD_ARACHNIDS(state, arachnid) {
    state.arachnids.push(arachnid);
  }
};

const actions = {
  async fetchArachnids({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/Arachnids/GetAll');
    const arachnids = response.data;
    commit('SET_ARACHNIDS', arachnids);
  },
  async createArachnid({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/Arachnids/Create', payload);
    const arachnid = response.data;
    commit('ADD_ARACHNID', arachnid);
  }
};

const getters = {
  arachnids: (state) => state.arachnids
};

export default {
  state,
  mutations,
  actions,
  getters
};
