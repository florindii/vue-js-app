import axios from 'axios';

const state = {
  roadSafetys: []
};

const mutations = {
  SET_ROADSAFETYS(state, roadSafetys) {
    state.roadSafetys = roadSafetys;
  },
  ADD_ROADSAFETYS(state, roadSafety) {
    state.roadSafetys.push(roadSafety);
  }
};

const actions = {
  async fetchRoadSafetys({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/RoadSafety/GetAll');
    const roadSafetys = response.data;
    commit('SET_ROADSAFETYS', roadSafetys);
  },
  async createRoadSafety({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/RoadSafety/Create', payload);
    const roadSafety = response.data;
    commit('ADD_ROADSAFETY', roadSafety);
  }
};

const getters = {
  roadSafetys: (state) => state.roadSafetys
};

export default {
  state,
  mutations,
  actions,
  getters
};
