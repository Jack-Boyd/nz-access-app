import database from '@react-native-firebase/database';

const db = database();

//ADD_USER
export const addUser = (user) => ({
  type: 'ADD_USER',
  user
});

export const startAddUser = (userData = {} ) => {
  return (dispatch) => {
    const {
      userId = "",
      name = "",
      username = "",
      email = "",
    } = userData;
    const user = { name, username, email };
    return db.ref(`/users/${userData.userId}`).set(user).then(() => {
        dispatch(addUser({
          userId,
          ...user,
        }))
    });
  };
};

//ADD_USER_PHOTO
export const addUserPhoto = (userId, updates) => ({
  type: 'ADD_USER_PHOTO',
  userId,
  updates,
});

export const startAddUserPhoto = (userId, updates = {photo: photo}) => {
  return (dispatch) => {
    return db.ref(`/users/${userId}`).update(updates).then(() => {
        dispatch(addUserPhoto(userId, updates));
    });
  };
};

//EDIT_USER
export const editUser = (userId, updates) => ({
  type: 'EDIT_USER',
  userId,
  updates
});

export const startEditUser = (userId, updates = {user: user}) => {
  return (dispatch) => {
    return db.ref(`/users/${userId}`).update(updates).then(() => {
        dispatch(editUser(userId, updates));
    });
  };
}

//SET_USER
export const setUser = (user) => ({
    type: 'SET_USER',
    user
  });

export const startSetUser = (userId) => {
    return (dispatch) => {
        return db.ref(`/users/${userId}`).once('value').then((snapshot) => {
            const user = {
              id: userId,
              ...snapshot.val()
            }
            dispatch(setUser(user));
        });
    };
};

//REMOVE_USER
export const removeUser = () => ({
  type: 'REMOVE_USER',
});

export const startRemoveUser = (userId) => {
  return (dispatch) => {
    return dispatch(removeUser());
  };
};