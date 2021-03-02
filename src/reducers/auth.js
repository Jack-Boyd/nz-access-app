const initialAuthState = { isLoggedIn: false, id: '' };

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {isLoggedIn: true, id: action.id};
    case "RESTORE_LOGIN":
      return {isLoggedIn: action.loggedIn, id: action.id};
    case "LOGOUT":
      return {isLoggedIn: false, id: ''};
    default:
      return state;
  }
}