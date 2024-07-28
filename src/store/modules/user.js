import axios from 'axios';

const state = {
  users: []
};

const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },
  ADD_USER(state, user) {
    state.users.push(user);
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex((b) => b.id === updatedUser.id);
    if (index !== -1) {
      Vue.set(state.users, index, updatedUser)
    }
  }
};

const actions = {
  async fetchUsers({ commit }) {
    try {
      const response = await axios.get('https://tilia.rrota.org/api/User/GetAll');
      const users = response.data;
      commit('SET_USERS', users);
    } catch (error) {
      console.error('fetchUsers action failed with error:', error);
      throw error;
    }
  },
  async createUser({ commit, dispatch }, payload) {
    try {
      const response = await axios.post(
        'https://tilia.rrota.org/api/User/CreateUserViaAdmin',
        payload
      );
      const user = response.data;
      commit('ADD_USER', user);
      dispatch('fetchUsers');
    } catch (error) {
      console.error('createUser action failed with error:', error);
      throw error;
    }
  },
  async updateUser({ commit, dispatch }, payload) {
    try {
      const response = await axios.put(
        'https://tilia.rrota.org/api/User/UpdateUserViaAdmin',
        payload
      );
      const updatedUser = response.data;
      commit('UPDATE_USER', updatedUser);
      dispatch('fetchUsers');
    } catch (error) {
      console.error('updateUser action failed with error:', error);
      throw error;
    }
  }
};

const getters = {
  users: (state) => state.users
};

export default {
  state,
  mutations,
  actions,
  getters
};
