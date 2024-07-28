import firebase from "firebase/app";
import "firebase/auth";
import axios from "axios";
import router from "../../router/index";


export default {
  state: {
    loggedInUser:
      localStorage.getItem("userInfo") != null
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
    loading: false,
    error: null,
    emailSentForChangePassword: null,
    resetPasswordUser:null,
    firstName:null,
    lastName:null
  },
  getters: {
    loggedInUser: state => state.loggedInUser,
    loading: state => state.loading,
    error: state => state.error,
    emailInfoForChangePass: state => state.emailSentForChangePassword,
    resetPasswordInfo: state => state.resetPasswordUser,
    getUserFirstName: state => state.firstName,
    getUserLastName: state => state.lastName
  },
  mutations: {
    setUser(state, data) {
      state.loggedInUser = data;
      state.loading = false;
      state.error = null;
    },
    setForgotPassword(state, data) {
      state.emailSentForChangePassword = data;
      state.loading = false;
      state.error = null;
    },
    setResetPassword(state, data) {
      state.resetPasswordUser = data;
      state.loading = false;
      state.error = null;
    },
    setFirstName(state, data){
      console.log(":",data);
      state.firstName = data;

    },
    setLastName(state, data){
      state.lastName = data;

    },
    setLogout(state) {
      state.loggedInUser = null;
      state.loading = false;
      state.error = null;
      // this.$router.go("/");
    },
    setLoading(state, data) {
      state.loading = data;
      state.error = null;
    },
    setError(state, data) {
      state.error = data;
      state.loggedInUser = null;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
    login({ commit }, data) {
      commit("clearError");
      commit("setLoading", true);
      // firebase
      //   .auth()
      //   .signInWithEmailAndPassword(data.email, data.password)
      //   .then(user => {
      //     const newUser = { uid: user.user.uid };
      //     localStorage.setItem("userInfo", JSON.stringify(newUser));
      //     commit("setUser", { uid: user.user.uid });
      //     console.log("user");
      //   })
      console.log(data);
      axios.post('https://tilia.rrota.org/api/User/Authenticate', data)
        .then(response => {
          localStorage.setItem("token", JSON.stringify(response.data.token));
          console.log(response.data)
          commit("setFirstName", response.data.user.firstName);
          commit("setLastName", response.data.user.lastName);
          let userat = [];
          // Handle the response from the server
          const newUser = response.data;
          if (data.checkbox) {
            let user = JSON.parse(localStorage.getItem("userInfo"))
            let users = []

            if (user) {
              let usersArray = JSON.parse(localStorage.getItem('userInfo')) || [];
              let emailExists = usersArray.some(user => user.user.email === data.email);
              if (!emailExists) {
                usersArray.push(newUser)
                localStorage.setItem("userInfo", JSON.stringify(usersArray))
              }
            } else {
              users.push(newUser)
              localStorage.setItem("userInfo", JSON.stringify(users));
            }

          } else {
            userat.push(newUser)
            localStorage.setItem("userInfo", JSON.stringify(userat));

          }


          const getToken = localStorage.getItem("token");
          const token = JSON.parse(getToken)

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          axios.defaults.headers.post['Content-Type'] = 'application/json';
          commit("setUser", { uid: newUser });

          localStorage.setItem("token", JSON.stringify(response.data.token));


        })
        .catch(error => {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          console.log(error);
          localStorage.removeItem("userInfo");
          commit("setError", error);
          // ...
        });
    },
    loginWithAvatar({ commit }, data) {
      commit("clearError");
      commit("setLoading", true);
      // firebase
      //   .auth()
      //   .signInWithEmailAndPassword(data.email, data.password)
      //   .then(user => {
      //     const newUser = { uid: user.user.uid };
      //     localStorage.setItem("userInfo", JSON.stringify(newUser));
      //     commit("setUser", { uid: user.user.uid });
      //     console.log("user");
      //   })
      axios.post('https://tilia.rrota.org/api/User/AuthenticateByHash', data)
        .then(response => {
         commit("setFirstName", response.data.user.firstName);
         commit("setLastName", response.data.user.lastName);

          console.log("res",response);
          localStorage.setItem("token", JSON.stringify(response.data.token));
          
          const getToken = localStorage.getItem("token");
          const token = JSON.parse(getToken)

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          axios.defaults.headers.post['Content-Type'] = 'application/json';

          const getUsers = JSON.parse(localStorage.getItem("userInfo"));

          const userToUpdate = getUsers.find(user => user.user.id == response.data.user.id)
          console.log("userToUpdate",userToUpdate);
          if(userToUpdate) {
            const index = getUsers.findIndex(user => user.user.id === userToUpdate.user.id);
            getUsers[index] = response.data;
            const updatedUsers = JSON.stringify(getUsers);
            localStorage.setItem("userInfo", updatedUsers);
          }
          commit("setUser", { userAvatar: response });
          localStorage.setItem("token", JSON.stringify(response.data.token));
        })
        .catch(error => {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          console.log(error);

          commit("setError", error);
          // ...
        });
    },
    signUserUp({ commit }, data) {
      commit("setLoading", true);
      commit("clearError");
      firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then(user => {
          commit("setLoading", false);

          const newUser = {
            uid: user.user.uid
          };
          console.log(newUser);
          localStorage.setItem("userInfo", JSON.stringify(newUser));
          commit("setUser", newUser);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          localStorage.removeItem("userInfo");
          console.log(error);
        });
    },
    signOut({ commit }) {
      localStorage.removeItem("token")
      firebase
        .auth()
        .signOut()
        .then(
          () => {
            commit("setLogout");
          },
          _error => { }
        );
    },

    forgotPassword({ commit }, data) {
      axios
        .post('https://tilia.rrota.org/api/User/ForgotPassword', data)
        .then((response) => {
          commit("setForgotPassword", response.data);
        })
        .catch((error) => {
          commit("setError", error);
          // Handle the error here, such as displaying an error message to the user
        })
        .then(() => {
          // This will be executed regardless of success or failure
          // router.back();
        });
    },
    resetPassword({ commit }, data) {
      axios.post('https://tilia.rrota.org/api/User/ResetPassword', data)
        .then((response) => {
            commit("setResetPassword", response.data);
          })
          .catch((error) => {
            commit("setError", error);
            // Handle the error here, such as displaying an error message to the user
          })
    }

  }
};
