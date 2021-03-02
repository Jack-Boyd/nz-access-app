import auth from '@react-native-firebase/auth';
import {startAddUser} from '../actions/user';

export default (result, ctx) => {
  return auth().createUserWithEmailAndPassword(result.email, result.id).then((user) => {
    if (user.user.uid) {
      const userId = user.user.uid; const name = result.name; const username = result.name; const email = result.email;
      ctx.props.dispatch(startAddUser({
        userId,
        name,
        username,
        email,
      }));
      auth().currentUser.updateProfile({
        displayName: username,
      });
      return {
        id: user.user.uid,
        username: username,
      };
    } else {
      console.log('reg failure..')
      return null;
    }
  }).catch((regError) => {
    console.log('facebook register error: ', regError);

    return auth().signInWithEmailAndPassword(result.email, result.id).then((user) => {
      if (user.user.uid) {
        return {
          id: user.user.uid,
          username: user.user.displayName,
        };
      } else {
        console.log('login failure..')
        return null;
      }
    }).catch((logError) => {
      console.log('facebook login error: ', logError);
      return null;
    });
  });
}