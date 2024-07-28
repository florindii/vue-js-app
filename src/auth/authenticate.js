import loggedInUser from "../store/modules/authData";

export default (to, from, next) => {
  if (
    loggedInUser.state.loggedInUser
  ) {
    next()
  }else if(
    localStorage.getItem('userInfo') != null
  ) {
    next()
  } else {
    next('/app/sessions/sign-in-two')
  }
}
