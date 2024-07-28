import axios from 'axios';

const state = {
  substances: []
};

const mutations = {
  SET_SUBSTANCES(state, substances) {
    state.substances = substances;
  },
  ADD_SUBSTANCES(state, substance) {
    state.substances.push(substance);
  }
};

const actions = {
  async fetchSubstances({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/OtherSubstanceInputs/GetAll');
    const substances = response.data;
    commit('SET_SUBSTANCES', substances);
  },
  async createSubstance({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/OtherSubstanceInputs/Create', payload);
    const substance = response.data;
    commit('ADD_SUBSTANCE', substance);
  }
};

const getters = {
  substances: (state) => state.substances
};

export default {
  state,
  mutations,
  actions,
  getters
};
