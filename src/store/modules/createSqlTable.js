import DatabaseHelper from '../../../Databasehelper';

export default {
    state: {

    },
    mutations: {
        TABLE_CREATED(state, data) {
        console.log("tablea u kriju");
      }
    },
    actions: {
        async createTableAction({ commit }) {
          // Call the createTable method from the DatabaseHelper
          await DatabaseHelper.createTable('mytable', 'column1 TEXT, column2 INTEGER');
    
          // Commit mutations or perform other actions as needed
          commit('TABLE_CREATED');
        },
    },
    getters: {

    }
  };
  