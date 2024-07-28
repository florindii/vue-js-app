import axios from 'axios';

const state = {
  workTypes: []
};

const mutations = {
  SET_WORKTYPES(state, workTypes) {
    state.workTypes = workTypes;
  },
  ADD_WORKTYPES(state, workType) {
    state.workTypes.push(workType);
  }
};

const actions = {
  async fetchWorkTypes({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/WorkType/GetAll');
    const workTypes = response.data;
    commit('SET_WORKTYPES', workTypes);
  },
  async createWorkType({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/WorkType/Create', payload);
    const workType = response.data;
    commit('ADD_WORKTYPE', workType);
  }
};

const getters = {
  workTypes: (state) => state.workTypes
};

export default {
  state,
  mutations,
  actions,
  getters
};
