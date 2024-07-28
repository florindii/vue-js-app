import axios from 'axios';

const state = {
  locations: []
};

const mutations = {
  SET_LOCATIONS(state, locations) {
    state.locations = locations;
  },
  ADD_LOCATIONS(state, location) {
    state.locations.push(location);
  }
};

const actions = {
  async fetchLocations({ commit }) {
    const response = await axios.get('https://tilia.rrota.org/api/Location/GetAll');
    const locations = response.data;
    commit('SET_LOCATIONS', locations);
  },
  async createLocation({ commit }, payload) {
    const response = await axios.post('https://tilia.rrota.org/api/Location/Create', payload);
    const location = response.data;
    commit('ADD_LOCATION', location);
  }
};

const getters = {
  locations: (state) => state.locations
};

export default {
  state,
  mutations,
  actions,
  getters
};
