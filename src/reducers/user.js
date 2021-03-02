const userReducerDefaultState = null;

export default (state = userReducerDefaultState, action) => {
  switch (action.type) {
    case 'EDIT_USER':
      let usr = state;
      usr.username = action.updates.username;
      usr.summary = action.updates.summary;
      return usr;
    case 'SET_USER':
      let user = action.user;
      return user;
    case 'REMOVE_USER':
      return null;
    default:
      return state;
  }
};