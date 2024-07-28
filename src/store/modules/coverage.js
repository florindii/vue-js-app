import axios from 'axios';

const state = {
  coverages: []
};

const mutations = {
  SET_COVERAGES(state, coverages) {
    state.coverages = coverages;
  },
  ADD_COVERAGES(state, coverage) {
    state.coverages.push(coverage);
  }
};

const actions = {
  async fetchCoverages({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/CoverageType/GetAll');
    const coverages = response.data;
    commit('SET_COVERAGES', coverages);
  },
  async createCoverage({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/CoverageType/Create', payload);
    const coverage = response.data;
    commit('ADD_COVERAGE', coverage);
  }
};

const getters = {
  coverages: (state) => state.coverages
};

export default {
  state,
  mutations,
  actions,
  getters
};
